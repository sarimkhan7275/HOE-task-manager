import express from "express";
import Task from "../models/Task.js";


const router = express.Router();

// create task
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ➤ get all task
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();

    const formatTask = (t) => ({
      id: t._id,
      title: t.title,
      description: t.description,
      status: t.status,
      date: t.updatedAt 
    });

    const grouped = {
      todo: tasks.filter(t => t.status === "todo").map(formatTask),
      inProgress: tasks.filter(t => t.status === "inProgress").map(formatTask),
      done: tasks.filter(t => t.status === "done").map(formatTask),
    };

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// update task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// change task status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["todo", "inProgress", "done"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// delete taks 
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




export default router;
