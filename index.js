// 1️⃣ Importaciones
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";

// 2️⃣ Configurar dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

// 3️⃣ Depuración de variables
console.log("🔍 SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("🔍 SUPABASE_KEY:", process.env.SUPABASE_KEY ? "OK" : "Missing");

// 4️⃣ Crear cliente Supabase
let supabase;
try {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
} catch (err) {
  console.error("❌ Error al crear cliente Supabase:", err.message);
}

// 5️⃣ Configurar Express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==== 6️⃣ RUTAS API CON MANEJO DE ERRORES ====

// Obtener todas las tareas
app.get("/api/tasks", async (req, res) => {
  try {
    const { data, error } = await supabase.from("tasks").select("*").order("id");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("❌ GET /api/tasks:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Crear nueva tarea
app.post("/api/tasks", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "El título es obligatorio" });

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ title, done: false }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error("❌ POST /api/tasks:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar tarea
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { done } = req.body;

    const { data, error } = await supabase
      .from("tasks")
      .update({ done })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("❌ PUT /api/tasks/:id:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar tarea
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error("❌ DELETE /api/tasks/:id:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ==== 7️⃣ Servir frontend estático ====
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ==== 8️⃣ Iniciar servidor con manejo de errores global
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

// Capturar errores no manejados
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});
