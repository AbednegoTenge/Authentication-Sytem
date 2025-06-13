import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/email.js';



const authController = {
    async register(req, res) {
        const {username, email, password} = req.body;
        try {
            // check if user already exists
            const existingUser = await User.findOne({ where: { email }});
            if (existingUser) { return res.status(400).json({ error: 'User already exists' }); };

            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // create new user
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                isVerified: false
            });

            const verificationToken = jwt.sign({id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            const verifyUrl = `http://localhost:${process.env.PORT}/verify-email/?token=${verificationToken}`;

            //send verification email
            await sendVerificationEmail(email, verifyUrl);

            res.status(201).json({
                message: 'User registered successfully. Please check your email to verify your account'
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
                    email: user.email,
                    isVerified: user.isVerified
                }
            });
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    async verifyEmail(req, res) {
        const { token } = req.query;

        if (!token) return res.status(400).json({ error: 'Verification token is missing' });

        try {
            // Decode token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { id, email } = decoded; // use 'id' not 'userId'

            // Find the user
            const user = await User.findOne({
                where: {
                    id,
                    email
                }
            });

            if (!user) {
                return res.status(400).json({ error: 'User not found or token invalid' });
            }

            if (user.isVerified) {
                return res.status(200).json({ message: "User already verified" });
            }

            // Verify the user
            user.isVerified = true;
            await user.save();

            return res.status(200).json({ message: 'Email verified successfully' });
        } catch (error) {
            console.log(error);
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({ error: 'Verification token expired' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(400).json({ error: 'Invalid verification token' });
            }
            res.status(500).json({ error: 'Server error' });
        }
    }
};

export default authController;