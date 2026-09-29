import mongoose, { Types } from 'mongoose';
import { connectDatabase } from '../config/database.js';
import {
  ActivityModel,
  LeaderboardModel,
  TeamModel,
  UserModel,
  WorkoutModel,
} from '../models/index.js';

const teams = [
  { key: 'trail-blazers', name: 'Trail Blazers', description: 'Outdoor miles and steady progress.' },
  { key: 'core-crew', name: 'Core Crew', description: 'Strength, balance, and consistency.' },
];

const users = [
  { key: 'maya', username: 'maya.chen', email: 'maya.chen@example.test', displayName: 'Maya Chen', team: 'trail-blazers', totalPoints: 50 },
  { key: 'leo', username: 'leo.martin', email: 'leo.martin@example.test', displayName: 'Leo Martin', team: 'trail-blazers', totalPoints: 50 },
  { key: 'sam', username: 'sam.patel', email: 'sam.patel@example.test', displayName: 'Sam Patel', team: 'core-crew', totalPoints: 35 },
  { key: 'ava', username: 'ava.johnson', email: 'ava.johnson@example.test', displayName: 'Ava Johnson', team: 'core-crew', totalPoints: 45 },
];

const activities = [
  { id: '66d000000000000000000001', user: 'maya', type: 'running' as const, durationMinutes: 24, distanceKm: 3.2, points: 32, completedAt: new Date('2026-09-24T16:00:00.000Z') },
  { id: '66d000000000000000000002', user: 'maya', type: 'strength' as const, durationMinutes: 18, points: 18, completedAt: new Date('2026-09-27T16:00:00.000Z') },
  { id: '66d000000000000000000003', user: 'leo', type: 'cycling' as const, durationMinutes: 30, distanceKm: 8, points: 30, completedAt: new Date('2026-09-23T16:00:00.000Z') },
  { id: '66d000000000000000000004', user: 'leo', type: 'walking' as const, durationMinutes: 20, distanceKm: 1.8, points: 20, completedAt: new Date('2026-09-28T16:00:00.000Z') },
  { id: '66d000000000000000000005', user: 'sam', type: 'running' as const, durationMinutes: 26, distanceKm: 3.5, points: 35, completedAt: new Date('2026-09-25T16:00:00.000Z') },
  { id: '66d000000000000000000006', user: 'ava', type: 'strength' as const, durationMinutes: 25, points: 30, completedAt: new Date('2026-09-22T16:00:00.000Z') },
  { id: '66d000000000000000000007', user: 'ava', type: 'walking' as const, durationMinutes: 15, distanceKm: 1.2, points: 15, completedAt: new Date('2026-09-29T16:00:00.000Z') },
];

const workouts = [
  { name: 'Easy Endurance Run', description: 'A relaxed run with a conversational pace.', focus: 'running', difficulty: 'beginner' as const, durationMinutes: 25 },
  { name: 'Walk and Reset', description: 'A brisk walk followed by a short cooldown.', focus: 'walking', difficulty: 'beginner' as const, durationMinutes: 20 },
  { name: 'Bodyweight Basics', description: 'A balanced circuit using simple bodyweight movements.', focus: 'strength', difficulty: 'beginner' as const, durationMinutes: 20 },
  { name: 'Steady Bike Intervals', description: 'Alternate steady riding with short, controlled efforts.', focus: 'cycling', difficulty: 'intermediate' as const, durationMinutes: 30 },
];

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    const teamIds: Record<string, Types.ObjectId> = {};
    for (const team of teams) {
      const savedTeam = await TeamModel.findOneAndUpdate(
        { name: team.name },
        { $set: { name: team.name, description: team.description, memberIds: [] } },
        { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true },
      );
      teamIds[team.key] = savedTeam._id;
    }

    const userIds: Record<string, Types.ObjectId> = {};
    for (const user of users) {
      const savedUser = await UserModel.findOneAndUpdate(
        { username: user.username },
        {
          $set: {
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            teamId: teamIds[user.team],
            totalPoints: user.totalPoints,
          },
        },
        { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true },
      );
      userIds[user.key] = savedUser._id;
    }

    for (const team of teams) {
      const memberIds = users
        .filter((user) => user.team === team.key)
        .map((user) => userIds[user.key]);
      await TeamModel.updateOne({ _id: teamIds[team.key] }, { $set: { memberIds } });
    }

    for (const activity of activities) {
      await ActivityModel.findOneAndUpdate(
        { _id: new Types.ObjectId(activity.id) },
        {
          $set: {
            userId: userIds[activity.user],
            type: activity.type,
            durationMinutes: activity.durationMinutes,
            distanceKm: activity.distanceKm,
            points: activity.points,
            completedAt: activity.completedAt,
          },
        },
        { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true },
      );
    }

    for (const user of users) {
      await LeaderboardModel.findOneAndUpdate(
        { userId: userIds[user.key], period: '2026-09' },
        {
          $set: {
            userId: userIds[user.key],
            teamId: teamIds[user.team],
            period: '2026-09',
            totalPoints: user.totalPoints,
          },
        },
        { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true },
      );
    }

    for (const workout of workouts) {
      await WorkoutModel.findOneAndUpdate(
        { name: workout.name },
        { $set: workout },
        { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true },
      );
    }

    console.log(
      `Database seeding complete: ${users.length} users, ${teams.length} teams, ${activities.length} activities, ${users.length} leaderboard entries, ${workouts.length} workouts.`,
    );
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seedDatabase();
