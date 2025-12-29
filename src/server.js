// 1. CAMBIO: Usar sintaxis de import para dotenv
import 'dotenv/config'; 

import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// =====================
// LOGIN
// =====================
app.post("/login", async (req, res) => {
  try {
    const { cedula, clave } = req.body;
    
    // Buscamos usuario por cédula y clave
    const query = "SELECT * FROM usuarios WHERE cedula = $1 AND clave = $2";
    const result = await pool.query(query, [cedula, clave]);

    if (result.rows.length === 0) {
      return res.status(401).json({ msg: "Cédula o contraseña incorrecta" });
    }

    // Devolvemos el usuario (sin la clave por seguridad)
    const usuario = result.rows[0];
    delete usuario.clave; 
    
    res.json({ msg: "Bienvenido", usuario });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// REGISTRAR USUARIO
// =====================
app.post("/usuarios", async (req, res) => {
  try {
    const { cedula, nombre, clave } = req.body;

    if (!cedula || !nombre || !clave) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const query = `
      INSERT INTO usuarios (cedula, nombre, clave)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const result = await pool.query(query, [cedula, nombre, clave]);
    res.json({ msg: "Usuario registrado", data: result.rows[0] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// CONSULTAR POR ID
// =====================
app.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =====================
// 4. OBTENER TODOS LOS USUARIOS
// =====================
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// 5. EDITAR USUARIO
// =====================
app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { cedula, nombre, clave } = req.body;
    
    const query = "UPDATE usuarios SET cedula=$1, nombre=$2, clave=$3 WHERE id=$4 RETURNING *";
    const result = await pool.query(query, [cedula, nombre, clave, id]);
    
    if (result.rows.length === 0) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.json({ msg: "Usuario actualizado", usuario: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// 6. ELIMINAR USUARIO
// =====================
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    
    if (result.rowCount === 0) return res.status(404).json({ msg: "No encontrado" });
    res.json({ msg: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// SERVIDOR
// Corrección pequeña: usar la variable `port` definida arriba en lugar de 3000 fijo
app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));