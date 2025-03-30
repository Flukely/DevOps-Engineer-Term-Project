const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));

// Route หลัก
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API ตัวอย่าง
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});