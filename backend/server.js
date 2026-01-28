const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://Raviya:Raviyatask321@cluster0.nuub8uv.mongodb.net/?appName=Cluster0");



const TodoSchema = new mongoose.Schema({
   title: String,
  description: String,
  status: {
    type: String,
    default: "Pending"
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: String,
    default: "Medium"
  },
  dueDate: Date,
  createdDate: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model("Todo", TodoSchema);

// 🔹 Create task
app.post("/todos", async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save();
  res.json(todo);
});

// 🔹 Get all tasks
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// 🔹 Update task (edit / complete)
app.put("/todos/:id", async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// 🔹 Delete task
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
