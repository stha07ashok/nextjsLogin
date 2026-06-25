import { Sequelize } from "sequelize-typescript";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const dbHost = process.env.DB_HOST?.trim();

const sequelize = new Sequelize({
  host: dbHost === "localhost" ? "127.0.0.1" : dbHost,
  username: process.env.DB_USER?.trim(),
  password: process.env.DB_PASSWORD?.trim(),
  database: process.env.DB_DATABASE?.trim(),
  port: 3306,
  dialect: "mysql",
  models: [path.join(__dirname, "../models/*.ts")], 
  logging: false,
  dialectOptions: {
    socketPath: "/tmp/mysql.sock"
  }
});

// Init database
export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(" Database connected successfully!");

    await sequelize.sync({ force: true, alter: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Error during database initialization:", error);
  }
};