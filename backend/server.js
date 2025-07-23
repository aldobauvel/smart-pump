import express, { json } from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { nanoid } from 'nanoid';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import fs from 'fs/promises';

const app = express();
app.use(cors());
app.use(json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de multer para guardar en carpeta /uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Servir archivos estáticos (para acceder a las imágenes desde el frontend)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const adapter = new JSONFile('users.json');
const db = new Low(adapter,{});
await db.read()
console.log(db.data)

app.get('/users', async (req, res) => {
  await db.read();
  if (!db.data || !db.data.users) {
    db.data = { users: [] }; // <-- esto evita el error incluso si el archivo está dañado
    await db.write();
  }
  res.json(db.data.users);
});

app.post('/users', async (req, res) => {
  await db.read();
  if (!db.data || !db.data.users) {
    db.data = { users: [] };
  }

  const task = { id: nanoid(), ...req.body };
  db.data.users.push(task);
  await db.write();
  res.status(201).json(task);
});

//METODO PUT
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;

  await db.read();
  if (!db.data || !db.data.users) {
    db.data = { users: [] };
    await db.write();
  }

  const index = db.data.users.findIndex(user => user._id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }

  // Actualiza con los nuevos datos, conservando el mismo ID
  db.data.users[index] = { ...req.body, id };
  await db.write();

  res.json(db.data.users[index]);
});

app.post('/profile-picture/:id', upload.single('image'), async (req, res) => {
  try {
    const userId = req.params.id;
    const originalPath = req.file.path;
    const resizedFilename = `resized-${req.file.filename}`;
    const resizedPath = `uploads/${resizedFilename}`;

    // Redimensionar a 300x300 y guardar como nuevo archivo
    await sharp(originalPath).resize(200, 200).toFile(resizedPath);

    // 🧹 Eliminar la imagen original
    await fs.unlink(originalPath);

    // Leer y actualizar al usuario
    await db.read();
    const user = db.data.users.find(u => u._id === userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.picture = resizedPath;
    await db.write();

    res.json({
      message: 'Imagen optimizada y guardada',
      filename: resizedFilename,
      url: `http://localhost:3000/${resizedPath}`
    });
  } catch (err) {
    console.error('Error al subir imagen:', err);
    res.status(500).json({ message: 'Error del servidor al subir imagen' });
  }
});



// 🛠 Aquí arrancamos todo
async function startServer() {
  await db.read();
  console.log('DB:', db.data); // <--- deberías ver { users: [...] }
  if (!db.data) {
    db.data = { users: [] };
    await db.write();
  }

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
  });
}

startServer(); // ✅ Aquí sí se espera correctamente la carga del JSON
// PUT y DELETE igual, no olvides hacer `await db.read(); db.data ||= { users: [] }` si es necesario
