import express from "express";
import { registerUser, loginUser,setUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post('/set-user', setUser);

export default router;
