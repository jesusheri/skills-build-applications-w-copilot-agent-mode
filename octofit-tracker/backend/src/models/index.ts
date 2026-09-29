import { model, Schema, Types } from 'mongoose';

export interface User {
  username: string;
  email: string;
  displayName: string;
  totalPoints: number;
  teamId?: Types.ObjectId;
}

const userSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    displayName: { type: String, required: true, trim: true },
    totalPoints: { type: Number, min: 0, default: 0 },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  },
  { timestamps: true },
);

export interface Team {
  name: string;
  description: string;
  memberIds: Types.ObjectId[];
}

const teamSchema = new Schema<Team>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true, default: '' },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

export interface Activity {
  userId: Types.ObjectId;
  type: 'running' | 'walking' | 'strength' | 'cycling' | 'other';
  durationMinutes: number;
  distanceKm?: number;
  points: number;
  completedAt: Date;
}

const activitySchema = new Schema<Activity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['running', 'walking', 'strength', 'cycling', 'other'], required: true },
    durationMinutes: { type: Number, min: 1, required: true },
    distanceKm: { type: Number, min: 0 },
    points: { type: Number, min: 0, default: 0 },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export interface LeaderboardEntry {
  userId: Types.ObjectId;
  teamId?: Types.ObjectId;
  period: string;
  totalPoints: number;
}

const leaderboardSchema = new Schema<LeaderboardEntry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', index: true },
    period: { type: String, required: true, trim: true, index: true },
    totalPoints: { type: Number, min: 0, required: true, default: 0 },
  },
  { timestamps: true },
);

leaderboardSchema.index({ userId: 1, period: 1 }, { unique: true });

export interface Workout {
  name: string;
  description: string;
  focus: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
}

const workoutSchema = new Schema<Workout>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    focus: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    durationMinutes: { type: Number, min: 1, required: true },
  },
  { timestamps: true },
);

export const UserModel = model<User>('User', userSchema);
export const TeamModel = model<Team>('Team', teamSchema);
export const ActivityModel = model<Activity>('Activity', activitySchema);
export const LeaderboardModel = model<LeaderboardEntry>('LeaderboardEntry', leaderboardSchema);
export const WorkoutModel = model<Workout>('Workout', workoutSchema);