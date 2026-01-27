import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = () => {
    fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    })
    .then(res => res.json())
    .then(todo => {
      setTodos([...todos, todo]);
      setText("");
    });
  };

  const deleteTodo = id => {
    fetch(`http://localhost:5000/todos/${id}`, { method: "DELETE" })
      .then(() => setTodos(todos.filter(t => t._id !== id)));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">TaskNest</h2>

      <div className="input-group">
        <input className="form-control"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="New task" />
        <button className="btn btn-primary" onClick={addTodo}>Add</button>
      </div>

      <ul className="list-group mt-3">
        {todos.map(todo => (
          <li key={todo._id} className="list-group-item d-flex justify-content-between">
            {todo.text}
            <button className="btn btn-danger btn-sm"
              onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

