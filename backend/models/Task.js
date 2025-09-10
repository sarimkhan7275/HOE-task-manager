import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["todo", "inProgress", "done"],
    default: "todo",
  }
}, { timestamps: true }); 

export default mongoose.model("Task", taskSchema);
