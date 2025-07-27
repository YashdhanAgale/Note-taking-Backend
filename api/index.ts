// api/index.ts
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from '../src/config/db';
import authRoutes from '../src/routes/authRoutes';
import noteRoutes from '../src/routes/noteRoutes';

dotenv.config();
const app = express();

const allowedOrigins = [
  'https://note-taking-frontend-a2zu0ksgq-yashodhans-projects-7e631381.vercel.app',
];

app.use(
  cors({
    origin: (origin, cb) =>
      !origin || allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error('Not allowed by CORS')),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.get('/api/hello', (_req, res) => {
  res.send('Hello from the backend!');
});


export default app;
