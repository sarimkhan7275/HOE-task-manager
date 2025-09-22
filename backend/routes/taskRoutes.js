import express from "express";
import Task from "../models/Task.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Create Task 
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    const task = new Task({
      title,
      description,
      status,
      priority: priority || "P3",
      user: req.user.id, 
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Tasks 
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    const formatTask = (t) => ({
      id: t._id,
      title: t.title,
      description: t.description,
      priority : t.priority,
      status: t.status,
      date: t.updatedAt,
    });

    const grouped = {
      todo: tasks.filter((t) => t.status === "todo").map(formatTask),
      inProgress: tasks.filter((t) => t.status === "inProgress").map(formatTask),
      done: tasks.filter((t) => t.status === "done").map(formatTask),
    };

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Update Task 
router.put("/:id", auth, async (req, res) => {
  try {
    const updates = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, 
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



//Change Task Status
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["todo", "inProgress", "done"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, 
      { status },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user : req.user.id, 
    });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// Bulk Update Task Priorities
router.post("/bulk-priority", auth, async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: "Invalid updates format" });
    }

    const results = [];

    for (const u of updates) {
      const task = await Task.findOneAndUpdate(
        { _id: u.id, user: req.user.id },  
        { priority: u.priority },
        { new: true }
      );
      if (task) results.push(task);
    }

    res.json({ message: "Priorities updated successfully", tasks: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





export default router;
