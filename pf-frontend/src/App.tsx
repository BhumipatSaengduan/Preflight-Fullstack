import { useEffect, useState } from "react";
import axios from "axios";
import { type TodoItem } from "./types";
import dayjs from "dayjs";
function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [titleText, setTitleText] = useState("");
  const [dueDateText, setDueDateText] = useState("");
  const [locationText, setLocationText] = useState("");
  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");
  const [curTodoId, setCurTodoId] = useState("");

  async function fetchData() {
    const res = await axios.get<TodoItem[]>("api/todo");
    setTodos(res.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleTitleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitleText(e.target.value);
  }

  function handleDueDateInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDueDateText(e.target.value);
  }

  function handleLocationInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLocationText(e.target.value);
  }

  function handleSubmit() {
    if (!titleText) return;
    if (!dueDateText) return;
    if (!locationText) return;
    if (mode === "ADD") {
      axios
        .request({
          url: "/api/todo",
          method: "put",
          data: {
            todoText: titleText,
            dueDate: dueDateText,
            location: locationText,
          },
        })
        .then(() => {
          setTitleText("");
          setDueDateText("");
          setLocationText("");
        })
        .then(fetchData)
        .catch((err) => alert(err));
    } else {
      axios
        .request({
          url: "/api/todo",
          method: "patch",
          data: {
            id: curTodoId,
            todoText: titleText,
            dueDate: dueDateText,
            location: locationText,
          },
        })
        .then(() => {
          setTitleText("");
          setDueDateText("");
          setLocationText("");
          setMode("ADD");
          setCurTodoId("");
        })
        .then(fetchData)
        .catch((err) => alert(err));
    }
  }

  function handleDelete(id: string) {
    axios
      .delete("/api/todo", { data: { id } })
      .then(fetchData)
      .then(() => {
        setMode("ADD");
        setTitleText("");
        setDueDateText("");
        setLocationText("");
      })
      .catch((err) => alert(err));
  }

  function handleCancel() {
    setMode("ADD");
    setTitleText("");
    setDueDateText("");
    setLocationText("");
    setCurTodoId("");
  }
  return (
    <div className="container">
      <header>
        <h1>Todo App</h1>
      </header>
      <main>
        <div
          style={{ display: "flex", flexDirection: "column", width: "auto" }}
        >
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <label style={{ fontSize: "1.25rem", marginRight: "0.5rem" }}>
              Title:
            </label>
            <input
              style={{ fontSize: "1rem", height: "2.25rem" }}
              type="text"
              onChange={handleTitleInputChange}
              value={titleText}
              data-cy="input-text"
            />
          </div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <label style={{ fontSize: "1.25rem", marginRight: "0.5rem" }}>
              Due&nbsp;Date:
            </label>
            <input
              style={{ padding: "0.5rem", height: "2.25rem" }}
              type="date"
              onChange={handleDueDateInputChange}
              value={dueDateText}
              data-cy="due-date-input-text"
            />
          </div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <label style={{ fontSize: "1.25rem", marginRight: "0.5rem" }}>
              Location:
            </label>
            <input
              style={{ padding: "0.5rem", height: "2.25rem" }}
              type="text"
              onChange={handleLocationInputChange}
              value={locationText}
              data-cy="location-input-text"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleSubmit} data-cy="submit">
              {mode === "ADD" ? "Submit" : "Update"}
            </button>
            {mode === "EDIT" && (
              <button
                onClick={handleCancel}
                className="secondary"
                style={{ marginLeft: "0.5rem" }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        <div data-cy="todo-item-wrapper">
          {todos.sort(compareDate).map((item, idx) => {
            const { date, time } = formatDateTime(item.createdAt);
            const { date: dueDate } = formatDateTime(item.dueDate);
            const text = item.todoText;
            return (
              <article
                key={item.id}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                <div>({idx + 1})</div>
                <div>📅{date}</div>
                <div>⏰{time}</div>
                <div data-cy='todo-item-text'>📰{text}</div>
                <div data-cy='todo-item-due-date'>❌{dueDate}</div>
                <div data-cy='todo-item-location'>📍{item.location}</div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setMode("EDIT");
                    setCurTodoId(item.id);
                    setTitleText(item.todoText);
                    setDueDateText(item.dueDate);
                    setLocationText(item.location);
                  }}
                  data-cy="todo-item-update"
                >
                  {curTodoId !== item.id ? "🖊️" : "✍🏻"}
                </div>

                {mode === "ADD" && (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(item.id)}
                    data-cy='todo-item-delete'
                  >
                    🗑️
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default App;

function formatDateTime(dateStr: string) {
  if (!dayjs(dateStr).isValid()) {
    return { date: "N/A", time: "N/A" };
  }
  const dt = dayjs(dateStr);
  const date = dt.format("D/MM/YY");
  const time = dt.format("HH:mm");
  return { date, time };
}

function compareDate(a: TodoItem, b: TodoItem) {
  const da = dayjs(a.createdAt);
  const db = dayjs(b.createdAt);
  return da.isBefore(db) ? -1 : 1;
}