import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  userId?: string;
}

// Verify JWT
export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized - no token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    ) as jwt.JwtPayload;

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Error in verifyToken: ", error);
    if (error instanceof jwt.JsonWebTokenError) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token" });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
};
