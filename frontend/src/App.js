import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // Optional: for custom styles

function App() {
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [createdDate, setCreatedDate] = useState("");
  const [editId, setEditId] = useState(null);

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/todos");
    setTasks(res.data);
  };

  // Add task
  const addTask = async () => {
    if (!title.trim()) return; // prevent empty title

    await axios.post("http://localhost:5000/todos", {
      title,
      description,
      priority,
      createdDate,
    });

    resetForm();
    fetchTasks();
  };

  // Update task
  const updateTask = async () => {
    if (!title.trim()) return;

    await axios.put(`http://localhost:5000/todos/${editId}`, {
      title,
      description,
      priority,
      createdDate,
    });

    resetForm();
    fetchTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/todos/${id}`);
    fetchTasks();
  };

  // Mark as completed
  const completeTask = async (id) => {
    await axios.put(`http://localhost:5000/todos/${id}`, { status: "Completed" });
    fetchTasks();
  };

  // Reset form
  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setCreatedDate("");
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4">My Modern Todo App</h2>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Add / Edit Task Form */}
      <div className="card p-4 mb-4 shadow-sm">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="d-flex mb-2">
          <select
            className="form-control me-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <input
            type="date"
            className="form-control"
            value={createdDate}
            onChange={(e) => setCreatedDate(e.target.value)}
          />
        </div>
        <button
          className={`btn ${editId ? "btn-warning" : "btn-primary"} w-100`}
          onClick={editId ? updateTask : addTask}
        >
          {editId ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* Task List */}
      {tasks
        .filter(
          (task) =>
            task.title &&
            task.title.toLowerCase().includes(search.toLowerCase())
        )
        .map((task) => (
          <div
            key={task._id}
            className={`card mb-3 p-3 shadow-sm ${
              task.status === "Completed" ? "bg-light" : ""
            }`}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className={task.status === "Completed" ? "text-decoration-line-through" : ""}>
                  {task.title}
                </h5>
                <p>{task.description}</p>
                <small>
                  Status:{" "}
                  <span
                    className={
                      task.status === "Completed" ? "text-success" : "text-warning"
                    }
                  >
                    {task.status}
                  </span>{" "}
                  | Priority:{" "}
                  <span
                    className={
                      task.priority === "High"
                        ? "text-danger fw-bold"
                        : task.priority === "Medium"
                        ? "text-primary fw-bold"
                        : "text-success fw-bold"
                    }
                  >
                    {task.priority}
                  </span>{" "}
                  | Created: {task.createdDate ? task.createdDate.substring(0, 10) : "N/A"}
                </small>
              </div>

              <div className="d-flex flex-column">
                {task.status !== "Completed" && (
                  <button
                    className="btn btn-success btn-sm mb-2"
                    onClick={() => completeTask(task._id)}
                  >
                    Complete
                  </button>
                )}
                <button
                  className="btn btn-warning btn-sm mb-2"
                  onClick={() => {
                    setEditId(task._id);
                    setTitle(task.title);
                    setDescription(task.description);
                    setPriority(task.priority);
                    setCreatedDate(task.createdDate?.substring(0, 10));
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default App;
