import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import reportRoute from "../utils/reports.js";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://ronakparmar2428_db_user:abc%40123@staticdetection.z53q1az.mongodb.net/StaticDetection?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(console.error);


// Use the report route
app.use("/api", reportRoute);

app.listen(5000, () => console.log("Server running on port 5000"));
