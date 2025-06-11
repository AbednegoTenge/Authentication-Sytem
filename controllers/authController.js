import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const authController = {
    async register(req, res) {
        const {username, email, password} = req.body;
        try {
            // check if ser already exists
            const existingUser = await User.findOne({ where: { email }});
            if (existingUser) { return res.status(400).json({ error: 'User already exists' }); };

            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            // create new user
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword
            });

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email
                }
            });
        } catch (error) {
            console.error('Error during registration:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    async login(req, res) {
        const {email, password} = req.body;
        try {
            //find user by email
            const user = await User.findOne({
                where: { email }
            });
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            };

            //compare password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password' });
            };

            // generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            //set token in cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'Strict', // Prevent CSRF attacks
                maxAge: 3600000 // 1 hour
            });
            res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

export default authController;