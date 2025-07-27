import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';

dotenv.config();
const app = express();

// ✅ Step 1: Allowed Origins
const allowedOrigins = [
  'https://note-taking-frontend-pied.vercel.app',
  'https://note-taking-frontend-a2zu0ksgq-yashodhans-projects-7e631381.vercel.app',
];

// ✅ Step 2: CORS Setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ✅ Step 3: Preflight Middleware (Very Important!)
app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Step 4: Middleware Order
app.use(express.json());
app.use(cookieParser());

// ✅ Step 5: Connect DB and Routes
connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.get('/api/hello', (req, res) => {
  res.send('Hello from the backend!');
});

// ✅ Step 6: Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
