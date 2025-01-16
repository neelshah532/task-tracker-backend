import Task from "../models/TaskModel.js";

// Validation function
const validateTask = (task) => {
    const errors = [];
    if (!task || typeof task !== "object") errors.push("Task data is invalid.");
    if (!task.title || task.title.trim() === "") errors.push("Title is required.");
    if (task.description !== undefined && task.description.trim() === "") {
        errors.push("Description cannot be empty.");
    }
    if (task.status && !["incomplete", "completed"].includes(task.status)) {
        errors.push("Invalid status.");
    }
    if (task.priority && !["Low", "Medium", "High"].includes(task.priority)) {
        errors.push("Invalid priority.");
    }
    return errors;
};

// Create a New Task
export const createTask = async (req, res) => {
    const { title, description, status, priority } = req.body;

    // Validate task data
    const errors = validateTask({ title, description, status, priority });
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        const newTask = new Task({
            title,
            description,
            status,
            priority,
            userId: req.userId,
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        console.error(err); // Log the error to the server console
        res.status(500).json({ error: "Error creating task", details: err.message });
    }
}

// Fetch Tasks with Pagination and Filtering
export const getTask = async (req, res) => {
    const { page = 1, limit = 10, status, priority, sortBy = "creationDate", order = "desc" } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    try {
        const tasks = await Task.find(filter)
            .sort({ [sortBy]: order === "desc" ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const totalTasks = await Task.countDocuments(filter);

        res.json({
            tasks,
            pagination: {
                total: totalTasks,
                page: Number(page),
                limit: Number(limit),
            },
        });
    } catch (err) {
        res.status(500).json({ error: "Error fetching tasks" });
    }
};


export const updateTask = async (req, res) => {
    const { title, description, status, priority } = req.body;
    const errors = validateTask({ title, description, status, priority });
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, status, priority },
            { new: true }
        );
        if (!updatedTask) return res.status(404).json({ error: "Task not found" });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: "Error updating task" });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting task" });
    }
};



export const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['completed', 'incomplete'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        // Find and update the specific task
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Verify user owns this task
        const taskUserId = task.userId?.toString();
        const currentUserId = req.userId?.toString();

        // Verify user owns this task
        if (taskUserId !== currentUserId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this task'
            });
        }

        // Update the task status
        task.status = status;
        await task.save();

        return res.json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error updating task status:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating task status'
        });
    }
};