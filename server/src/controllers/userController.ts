import { Request, Response, NextFunction, RequestHandler } from "express";
import User from "../models/userModel";
import { Op } from "sequelize";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie";
import bcryptjs from "bcryptjs";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../nodemailer/emails";
import crypto from "crypto";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

//user registration
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Error("All fields are required");
    }

    // Check if user already exists
    const userAlreadyExists = await User.findOne({ where: { email } });
    if (userAlreadyExists) {
      res.status(400).json({ success: false, message: "User already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Create the user object
    const newUser = {
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      lastLogin: new Date(),
      isVerified: false,
    };

    // Save the user to the database
    const createdUser = await User.create(newUser);

    // Generate JWT token and set it as a cookie
    generateTokenAndSetCookie(res, createdUser.id);

    //send verification email
    await sendVerificationEmail(createdUser.email, Number(verificationToken));

    // Send success response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: createdUser.id,
        email: createdUser.email,
        isVarified: createdUser.isVerified,
        verificationToken: createdUser.verificationToken,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

//verify email
export const verifyEmail: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      where: {
        verificationToken: code,
        verificationTokenExpiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
      return;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, "User");

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user.id,
        email: user.email,
        isVerified: user.isVerified,
        verificationToken: user.verificationToken,
        verificationTokenExpiresAt: user.verificationTokenExpiresAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

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

    const token = generateTokenAndSetCookie(res, user.id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      authToken: token,
      user: {
        id: user.id,
        email: user.email,
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

//user logout
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

//forget password
export const forgetpassword: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    console.log("Generated reset token:", resetToken);
    console.log("Reset token expiry:", resetTokenExpiresAt);

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/resetpassword/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

//reset password
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ success: false, message: "Password is required" });
      return;
    }

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
      return;
    }

    // update password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

//check auth
export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({
      where: { id: (req as AuthenticatedRequest).userId },
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};


