import express from 'express';
import { connectDB } from './config/db.js';
import { initUserModel } from './models/user.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        await initUserModel();

        app.use(express.json());
        app.use(cookieParser());

        // Set up routes
        app.use('/', authRoutes)

        app.get('/', (req, res) => {
            res.send('Hello, World!');
        });

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error starting the server:', error.message);
        process.exit(1); // Exit the process with failure
    }
};

startServer()