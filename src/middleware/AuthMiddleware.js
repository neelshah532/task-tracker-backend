import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/Usermodel.js";

dotenv.config();


export const authenticate = async (req, res, next) => {

    const token = req.header("Authorization");
    if (!token) return res.status(400).json({ status: false, msg: "Token not found" });
    let user;
    try {
        user = jwt.verify(token, ACCESS_TOKEN_SECRET);
    }
    catch (err) {
        return res.status(401).json({ status: false, msg: "Invalid token" });
    }

    try {
        user = await User.findById(user.id);
        if (!user) {
            return res.status(401).json({ status: false, msg: "User not found" });
        }

        req.user = user;
        next();
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
};