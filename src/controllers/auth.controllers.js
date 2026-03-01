// import sendRegistrationEmail from '../services/email.services.js';
import UserModel from './../models/user.models.js';
import jwt from 'jsonwebtoken';
export async function userRegisterController(req, res) {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            { }
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const isEmailExists = await UserModel.findOne({ email });
        if (isEmailExists) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const newUser = new UserModel({ email, name, password });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
        res.cookie("token", token, { httpOnly: true, secure: false });
        res.status(201).json({
            user: {
                _id: newUser._id,
                email: newUser.email,
                name: newUser.name
            }
        });
        // await sendRegistrationEmail(newUser.email, newUser.name);
    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message
        });
    }
}


export async function userLoginController(req, res) {
    { }
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await UserModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
        res.cookie("token", token, { httpOnly: true, secure: false });
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({
            success: false,
            message: "Error logging in",
            error: error.message
        });
    }
}