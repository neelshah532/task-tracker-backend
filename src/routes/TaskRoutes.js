
import { Router } from "express";
import { createTask, deleteTask, getTask, updateTask, updateTaskStatus } from "../controller/TaskController.js";
const router = Router();

// Task Routes
router.post("/", createTask);
router.get("/", getTask);
router.get("/:id", getTask);
router.put("/:id", updateTask); // Update a task by ID
router.delete("/:id", deleteTask); // Delete a task by ID
router.patch('/:id/status', updateTaskStatus);

export default router;  
