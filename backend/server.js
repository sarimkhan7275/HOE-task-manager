import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors"

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors())


// Routes
app.use("/api/tasks", taskRoutes);

app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT, () => console.log("Server running on port 4000"));
})
.catch(err => console.error(err));
