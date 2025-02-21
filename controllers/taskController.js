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
        const email = req.params.email;
        const tasks = await Task.find({ userId: email });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const existingTask = await Task.findById(id);

        if (!existingTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        // Only update if there's a change in category or other fields
        if (existingTask.category === req.body.category) {
            return res.json(existingTask);
        }

        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });

        if (updatedTask) {
            io.emit("taskUpdated", { action: "update", task: updatedTask }); // Emit real-time update
        }

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
