import { Sequelize } from "sequelize-typescript";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: 3306,
  dialect: "mysql",
  models: [path.join(__dirname, "../models/*.ts")], //load all your model files automatically into Sequelize
  logging: false,
});

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    await sequelize.sync({ force: false, alter: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Error during database initialization:", error);
  }
};
