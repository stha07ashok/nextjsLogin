import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { initializeDatabase } from "./database/connectDB";
import cookieParser from "cookie-parser";
import { router } from "./routes/user.routers";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  initializeDatabase();
});
