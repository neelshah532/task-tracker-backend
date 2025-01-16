import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
    },
    email: {
        type: String,
        required: [true, "Please an email"],
        unique: true,
        trim: true,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please add a valid email",
        ],
    },

    password: { type: String, required: [true, "Please add password!"], },
    isVerified: {
        type: Boolean,
        default: false,
    },
});

userSchema.pre('save', async function (next) {
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

export default User;