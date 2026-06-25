import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import { initializeDatabase } from "./database/connectDB";
import cookieParser from "cookie-parser";
import { router } from "./routes/user.routers";
import cors from "cors";




const app = express();
const port = process.env.PORT;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api", router);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  initializeDatabase();
});
