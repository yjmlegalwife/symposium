const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const filename = `photo-${Date.now()}.png`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('photo'), (req, res) => {
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ status: 'success', url: fileUrl });
});

// Endpoint to get all photo URLs
app.get('/photos', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to read uploads' });
    const urls = files.map(f => `/uploads/${f}`);
    res.json(urls);
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

