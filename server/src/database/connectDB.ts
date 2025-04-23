import { Sequelize } from "sequelize-typescript";
import path from "path";

const sequelize = new Sequelize({
  host: "localhost",
  username: "root",
  password: "root@ashok",
  database: "nextJs-Login",
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
