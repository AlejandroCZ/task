const API_URL = "/api/tasks"; // se ajustará automáticamente en Vercel

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");

// Cargar tareas
async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  list.innerHTML = "";
  tasks.forEach((t) => addTaskToDOM(t));
}

// Agregar tarea
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  const task = await res.json();
  addTaskToDOM(task);
  input.value = "";
});

// Renderizar en pantalla
function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span class="${task.done ? 'done' : ''}">${task.title}</span>
    <div>
      <button onclick="toggleTask(${task.id}, ${!task.done})">${task.done ? '❌' : '✅'}</button>
      <button onclick="deleteTask(${task.id})">🗑️</button>
    </div>
  `;
  list.appendChild(li);
}

// Marcar/desmarcar tarea
async function toggleTask(id, done) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done }),
  });
  loadTasks();
}

// Eliminar tarea
async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadTasks();
}

loadTasks();
