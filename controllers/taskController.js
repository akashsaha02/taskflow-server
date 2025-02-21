import Task from "../models/Task.js";
import { io } from "../server.js";  // Import the io instance

export const createTask = async (req, res) => {
    try {
        console.log(req.body);
        const { title, description, category, userId } = req.body;
        const newTask = new Task({ title, description, category, userId: userId });
        await newTask.save();

        io.emit("taskUpdated", { action: "create", task: newTask });  // Emit event

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

        io.emit("taskUpdated", { action: "update", task: updatedTask });  // Emit event

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);

        io.emit("taskUpdated", { action: "delete", taskId: req.params.id });  // Emit event

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
