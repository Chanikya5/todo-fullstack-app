import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:8080/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add todo
  const addTodo = async () => {
    if (!title.trim()) return;

    try {
      await axios.post(API_URL, {
        title: title,
        description: "",
        completed: false,
      });

      setTitle("");
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Toggle complete
  const toggleComplete = async (todo) => {
    try {
      await axios.put(`${API_URL}/${todo.id}`, {
        ...todo,
        completed: !todo.completed,
      });

      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Filtered todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  return (
    <div className="app-container">
      <div className="card">
        <h1>Todo Manager</h1>

        <div className="input-section">
          <input
            type="text"
            placeholder="Enter new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={addTodo}>Add</button>
        </div>

        <div className="filter-section">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="todo-item"
              onClick={() => toggleComplete(todo)}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                opacity: todo.completed ? 0.6 : 1,
              }}
            >
              <span>{todo.title}</span>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTodo(todo.id);
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
