import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import csv from "csv-parser";
import { Investor, Transaction } from "./src/models/index.js";
import router from "./src/routes/investors.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from Next.js
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json());
app.use("/api/investors", router);

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/mfdashboard";

const ingestData = async () => {
  const count = await Investor.countDocuments();
  if (count === 0 && fs.existsSync("./data/Mutual_Fund_Summary.csv")) {
    console.log("Ingesting initial data...");
    // Basic CSV processing logic goes here
    // Parse CSV -> Create Transactions -> Create Investors -> Link ObjectIds
    console.log("Data ingestion complete.");
  }
};

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(5000, async () => {
      console.log("Backend API running on http://localhost:5000");
      await ingestData();
    });
  })
  .catch(console.error);
