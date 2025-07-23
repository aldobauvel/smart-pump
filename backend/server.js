import express, { json } from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
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

// MULTER CONFIGURATION - SAVE IN FILE /UPLOADS
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

//METODO GET USUARIOS
app.get('/users', async (req, res) => {
  await db.read();
  if (!db.data || !db.data.users) {
    db.data = { users: [] };
    await db.write();
  }
  res.json(db.data.users);
});



//SUBE IMAGEN
app.post('/profile-picture/:id', upload.single('image'), async (req, res) => {
  try {
    const userId = req.params.id;
    const originalPath = req.file.path;
    const resizedFilename = `resized-${req.file.filename}`;
    const resizedPath = `uploads/${resizedFilename}`;

    // RESIZE IMAGE 300x300 SAVE AND CREATE NEW IMAGE
    await sharp(originalPath).resize(200, 200).toFile(resizedPath);

    // REMOVE THE ORIGINAL SIZE
    await fs.unlink(originalPath);

    // READ AND UPDATE BY USER
    await db.read();
    const user = db.data.users.find(u => u._id === userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.picture = resizedPath;
    await db.write();

    res.json({
      message: 'Resized and saved image',
      filename: resizedFilename,
      url: `http://localhost:3000/${resizedPath}`
    });
  } catch (err) {
    console.error('Error al subir imagen:', err);
    res.status(500).json({ message: 'Server error trying upload image' });
  }
});

//METODO PUT USUARIOS
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;

  await db.read();
  if (!db.data || !db.data.users) {
    db.data = { users: [] };
    await db.write();
  }

  const index = db.data.users.findIndex(user => user._id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update USER WITH NEW DATA KEEPING SAME ID
  db.data.users[index] = { ...req.body, id };
  await db.write();

  res.json(db.data.users[index]);
});

// SERVER START
async function startServer() {
  await db.read();  
  if (!db.data) {
    db.data = { users: [] };
    await db.write();
  }

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`);
  });
}

startServer();

