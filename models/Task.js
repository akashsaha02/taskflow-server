import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true, maxlength: 50 },
    description: { type: String, maxlength: 200 },
    category: { type: String, enum: ["To-Do", "In Progress", "Done"], default: "To-Do" },
    timestamp: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

export default mongoose.model("Task", TaskSchema);
