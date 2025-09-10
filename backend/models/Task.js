import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["todo", "inProgress", "done"],
    default: "todo",
  }
}, { timestamps: true });  // <-- adds createdAt & updatedAt automatically

export default mongoose.model("Task", taskSchema);
