import express from "express";
import dotenv from "dotenv";
import { getClient } from "./config/db";

dotenv.config();

const app = express();
// Default to 3000 if PORT is not defined in .env
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Budget Control Service is running");
});

async function startServer() {
  try {
    const client = await getClient();
    console.log("Connected to Neon PostgreSQL successfully.");
    client.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server due to DB connection error:", error);
    process.exit(1); 
  }
}

startServer();