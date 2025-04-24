import { Request, Response, NextFunction, RequestHandler } from "express";
import User from "../models/userModel";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie";
import bcryptjs from "bcryptjs";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

//user login
export const login: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
      return;
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
      return;
    }

    generateTokenAndSetCookie(res, user.id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login ", error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};
