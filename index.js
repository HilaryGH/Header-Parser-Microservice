require('dotenv').config();
const express = require('express');
const  app = express(); 
const path = require('path'); 
 const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));
const PORT = 3000;

// Serve static files (HTML, CSS, JS) from "public" folder
app.use(express.static("public"));

// Route to serve the HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
/// Middleware to ensure that IP address is correctly fetched
app.enable('trust proxy'); // This ensures we get the real IP behind a reverse proxy (like Heroku or similar services)

// Route to handle the request header parsing
app.get('/api/whoami', (req, res) => {
  // Get IP address (handle proxies)
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

  // Get the preferred language (Fallback to 'en' if not found)
  const language = req.headers['accept-language'] ? req.headers['accept-language'].split(',')[0] : 'en';

  // Get the user agent (browser and OS information)
  const software = req.get('User-Agent');

  // Return the parsed information
  res.json({
    ipaddress: ipAddress,
    language: language,
    software: software
  });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});