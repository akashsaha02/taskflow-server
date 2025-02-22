import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js"


dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
});

// Middleware
app.use(cors());
app.use(express.json());



// Routes
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);


// Socket.io Connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("taskUpdated", (data) => {
        io.emit("taskUpdated", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

app.get("/", (req, res) => {
    res.send("API is running...");
});

export { io };
