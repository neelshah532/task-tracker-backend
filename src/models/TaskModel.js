
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["Incomplete", "Completed"], default: "Incomplete" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User"  },
},
    {
        timestamps: true
    });


const Task = mongoose.model("Task", taskSchema);

export default Task;