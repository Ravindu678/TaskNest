
import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {

  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [editId, setEditId] = useState(null);
 



  // Load tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/todos");
    setTasks(res.data);
  };

  // Add task
  const addTask = async () => {
    await axios.post("http://localhost:5000/todos", {
      title,
      description,
      priority,
      dueDate
    });

    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");

    fetchTasks();
  };

  const updateTask = async () => {
  await axios.put(`http://localhost:5000/todos/${editId}`, {
    title,
    description,
    priority,
    dueDate
  });

  setEditId(null);
  setTitle("");
  setDescription("");
  setPriority("Medium");
  setDueDate("");

  fetchTasks();
};


  // Delete task
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/todos/${id}`);
    fetchTasks();
  };

  // Mark completed
  const completeTask = async (id) => {
    await axios.put(`http://localhost:5000/todos/${id}`, {
      status: "Completed"
    });
    fetchTasks();
  };

  return (
    <div className="container mt-4">
      <h2>Todo App (v2)</h2>

       <input
      className="form-control mb-3"
      placeholder="Search tasks..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
/>

      {/* Add Task */}
      <input className="form-control mb-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea className="form-control mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select className="form-control mb-2"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <input className="form-control mb-2"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button
      className="btn btn-primary mb-4"
      onClick={editId ? updateTask : addTask}
>
      {editId ? "Update Task" : "Add Task"}
      </button>

      
      {/* Task List */}
      {tasks
  .filter(task =>
    task.title && task.title.toLowerCase().includes(search.toLowerCase())
  )
  .map(task => (

        <div key={task._id} className="card mb-2 p-2">
          <h5>{task.title}</h5>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <p>Priority: {task.priority}</p>

          {task.status !== "Completed" && (
            <button className="btn btn-success me-2"
              onClick={() => completeTask(task._id)}>
              Complete
            </button>
          )}

          <button className="btn btn-warning me-2"
  onClick={() => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDueDate(task.dueDate?.substring(0, 10));
  }}>
  Edit
</button>

<button className="btn btn-danger"
  onClick={() => deleteTask(task._id)}>
  Delete
</button>

        </div>
      ))}
    </div>
  );
}

export default App;


