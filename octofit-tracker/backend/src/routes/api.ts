import express, { type Request, type Response } from 'express';
import { isValidObjectId, type Model, type UpdateQuery } from 'mongoose';
import {
  ActivityModel,
  LeaderboardModel,
  TeamModel,
  UserModel,
  WorkoutModel,
} from '../models/index.js';

const apiRouter = express.Router();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function createCrudRouter<T>(resource: string, resourceModel: Model<T>) {
  const router = express.Router();

  router.get('/', async (_request, response) => {
    const records = await resourceModel.find().sort({ createdAt: -1 }).limit(100);
    response.json(records);
  });

  router.post('/', async (request: Request, response: Response) => {
    if (!isRecord(request.body)) {
      response.status(400).json({ error: 'Request body must be a JSON object' });
      return;
    }

    const record = await resourceModel.create(request.body as T);
    response.status(201).json(record);
  });

  router.get('/:id', async (request, response) => {
    if (!isValidObjectId(request.params.id)) {
      response.status(400).json({ error: 'Invalid resource id' });
      return;
    }

    const record = await resourceModel.findById(request.params.id);
    if (!record) {
      response.status(404).json({ error: `${resource} not found` });
      return;
    }
    response.json(record);
  });

  router.patch('/:id', async (request: Request, response: Response) => {
    if (!isValidObjectId(request.params.id)) {
      response.status(400).json({ error: 'Invalid resource id' });
      return;
    }
    if (!isRecord(request.body)) {
      response.status(400).json({ error: 'Request body must be a JSON object' });
      return;
    }

    const { _id, createdAt, updatedAt, ...bodyUpdates } = request.body;
    const updates = bodyUpdates as UpdateQuery<T>;
    const record = await resourceModel.findByIdAndUpdate(request.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!record) {
      response.status(404).json({ error: `${resource} not found` });
      return;
    }
    response.json(record);
  });

  router.delete('/:id', async (request, response) => {
    if (!isValidObjectId(request.params.id)) {
      response.status(400).json({ error: 'Invalid resource id' });
      return;
    }

    const record = await resourceModel.findByIdAndDelete(request.params.id);
    if (!record) {
      response.status(404).json({ error: `${resource} not found` });
      return;
    }
    response.json({ deleted: true });
  });

  return router;
}

apiRouter.use('/users', createCrudRouter('User', UserModel));
apiRouter.use('/teams', createCrudRouter('Team', TeamModel));
apiRouter.use('/activities', createCrudRouter('Activity', ActivityModel));
apiRouter.use('/workouts', createCrudRouter('Workout', WorkoutModel));

apiRouter.get('/leaderboard', async (request, response) => {
  let leaderboardQuery = LeaderboardModel.find();
  if (typeof request.query.period === 'string') {
    leaderboardQuery = leaderboardQuery.where('period').equals(request.query.period);
  }
  if (typeof request.query.teamId === 'string') {
    if (!isValidObjectId(request.query.teamId)) {
      response.status(400).json({ error: 'Invalid team id' });
      return;
    }
    leaderboardQuery = leaderboardQuery.where('teamId').equals(request.query.teamId);
  }

  const entries = await leaderboardQuery
    .populate('userId', 'username displayName')
    .populate('teamId', 'name')
    .sort({ totalPoints: -1 })
    .limit(100);
  response.json(entries);
});

export default apiRouter;