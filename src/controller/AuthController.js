import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import User from "../models/Usermodel.js";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userID) => {
    return jwt.sign({ email, userID }, process.env.SECRET_KEY, {
        expiresIn: maxAge,
    });
};

export const signup = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long.",
            });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists.",
            });
        }

        const user = await User.create({ email, password, name });
        const token = createToken(email, user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge,
            secure: true,
            sameSite: "None",
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                token,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
        });
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        // Check if the user exists
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Verify the password
        const isMatch = await compare(password, userExists.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Generate token
        const token = createToken(email, userExists._id);

        // Set cookie and respond
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge,
            secure: true,
            sameSite: "None",
        });

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                id: userExists._id,
                email: userExists.email,
                name: userExists.name,
                isVerified: userExists.isVerified,
                token,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
        });
    }
};