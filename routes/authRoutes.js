import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Import User model
const router = express.Router();

router.post("/jwt", async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.send({ token })
});

export default router;