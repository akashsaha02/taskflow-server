// const express = require('express');
// const app = express();
// const cors = require('cors');
// require('dotenv').config();
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const port = process.env.PORT || 5000;
// const jwt = require('jsonwebtoken');


// // middlewares
// app.use(cors({
//     origin: ['http://localhost:5173'],
//     credentials: true
// }));
// app.use(express.json());

// const uri = process.env.MONGO_URI;
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });


// async function run() {
//     try {
//         console.log('Connecting to the database');
//         const database = client.db("taskflow");
//         const users = database.collection("users");
//         const tasks = database.collection("tasks");


//         // jwt api

//         app.post('/jwt', async (req, res) => {
//             const user = req.body;
//             const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
//             res.send({ token })
//         });

//         // middleware functions
//         const verifyToken = (req, res, next) => {
//             // console.log(req.headers.authorization)
//             if (!req.headers.authorization) {
//                 return res.status(401).send({ message: 'Unauthorized request' });
//             }

//             const token = req.headers.authorization.split(' ')[1];
//             jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//                 if (err) {
//                     return res.status(403).send({ message: 'Forbidden request' });
//                 }
//                 req.decoded = decoded;
//                 next();
//             });
//         }

//         // Users Collection API

//         app.post('/users', async (req, res) => {
//             const user = req.body;
//             const query = { email: user.email };
//             const existingUser = await users.findOne(query);
//             if (existingUser) {
//                 res.send({ message: 'User already exists', insertedId: existingUser._id });
//                 return;
//             }
//             const result = await users.insertOne(user);
//             res.json(result);
//         });




//     } finally {
//         // Ensures that the client will close when you finish/error
//         // await client.close();
//     }
// }
// run().catch(console.dir);


// app.get('/', (req, res) => {
//     res.send('Task Flow Server!');
// });


// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });



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

export { io };
