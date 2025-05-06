const Task = require("../models/taskModel");

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Optional: validate required fields
    if (!title || !description || !status) {
      return res.status(400).json({ error: "Title, description, and status are required" });
    }

    const taskId = await Task.create({ title, description, status });
    res.status(201).json({ message: "Task created successfully", taskId });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.getAll(); // Get all tasks from DB

    // Filter tasks by status 'pending' and sort them by created_at
    const filteredTasks = tasks
      .filter(task => task.status === 'pending') // Only pending tasks
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by created_at, newest first
      .slice(0, 5); // Get the most recent 5 tasks

    res.status(200).json(filteredTasks);
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
};


// Get a single task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.getById(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Error retrieving task:", error);
    res.status(500).json({ error: "Failed to retrieve task" });
  }
};

// Update a task (only completedBy is allowed)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completedBy } = req.body;

    // Ensure completedBy is provided
    if (!completedBy) {
      return res.status(400).json({ error: "completedBy is required to update the task" });
    }

    // Prepare the update data, including status and completedBy
    const updatedData = { status, completedBy };

    // Perform the update
    await Task.update(id, updatedData);
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};


// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.delete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
};
