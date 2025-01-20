// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from './src/routes/AuthRoutes.js';
import taskrouter from './src/routes/TaskRoutes.js';  // <-- Make sure this is imported correctly

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// const SECRET_KEY = process.env.SECRET_KEY;
// const databaseURL = process.env.ORIGIN;

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use("/api/tasks", taskrouter); 

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
