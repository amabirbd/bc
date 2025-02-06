import express from "express";
import { signup, login, logout } from "../controllers/authController";
import { signupValidator, loginValidator } from "../validators/auth";
import { authenticate } from "../middleware/authentication";

const router = express.Router();

router.post("/signup", signupValidator(), signup);
router.post("/login", loginValidator(), login);
router.post("/logout", authenticate as express.RequestHandler, logout);

export default router;
