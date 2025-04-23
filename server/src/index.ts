import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { initializeDatabase } from "./database/connectDB";
import { router } from "./routes/routers";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  initializeDatabase();
});
