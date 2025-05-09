import express, { Request, Response } from "express";
import {
  checkAuth,
  forgetpassword,
  login,
  logout,
  resetPassword,
  signup,
  verifyEmail,
} from "../controllers/userController";
import { verifyToken } from "../middleware/verifyToken";

export const router = express.Router();

router.get("/checkauth", verifyToken, checkAuth);

router.post("/login", login);
router.post("/register", signup);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgetpassword", forgetpassword);
router.post("/resetpassword/:token", resetPassword);
