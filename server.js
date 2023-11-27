const express = require('express');
const mysql = require('mysql');
const path = require('path');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
});

const sanitizeInput = (text) => {
  const sanitizedText = text.replace(/[^A-Za-z0-9\s,]/g, '');
  return sanitizedText;
};




connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database!');
});

//app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  var sessionCookie = "";
  try {
    sessionCookie = sanitizeInput(req.cookies.session);
  }
  catch (error) {
    sessionCookie = "";
  }

  if (!sessionCookie) {
    res.cookie('session', Math.floor(Math.random() * 1000000000), {
      maxAge: 60 * 60 * 24, // 1 day
    });
    // return res.send('Cookie set');
  }
  if (isNaN(sessionCookie) || parseInt(sessionCookie) < 0 || parseInt(sessionCookie) > 999999999 || sessionCookie.length > 9) {
    // return res.status(400).send('Invalid cookie value');
  }
  //res.send('Valid cookie value');

  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/process', (req, res) => {
  var sessionCookie = "";
  try {
    sessionCookie = sanitizeInput(req.cookies.session);
  }
  catch (error) {
    sessionCookie = "";
    return res.status(400).send('Invalid ID');
  }
  // Prevent video overwrite
  if(sessionCookie == "video" || parseInt(sessionCookie) < 0 || parseInt(sessionCookie) > 999999999 || sessionCookie.length > 9){
    sessionCookie = "";
    return res.status(400).send(`Don't tamper the cookie, please return to <a href="/">home</a>`);
  }
  const text1 = sanitizeInput(req.body.text1).slice(0, 120);
  const text_session = String(sessionCookie);

  const sql = 'INSERT INTO meme_ronaldo (text, value) VALUES (?, ?)';
  const values = [text1, text_session];

  connection.query(sql, values, (err, result) => {
    if (err) throw err;
    res.redirect("/process");
  });
});

app.get('/process', (req, res) => {
  var sessionCookie = "";
  try {
    sessionCookie = sanitizeInput(req.cookies.session);
  }
  catch (error) {
    sessionCookie = "";
  }
  var value = "";
  if (!sessionCookie) {
    value = 'Cookie is not set, please return to <a href="/">home</a>';
  }
  else{
    value = "Please wait... don't refresh";
  }
  res.render(path.join(__dirname, 'public', 'process.ejs'), { value });
});

app.get('/check', (req, res) => {
  var sessionCookie = "";
  try {
    sessionCookie = sanitizeInput(req.cookies.session);
  }
  catch (error) {
    sessionCookie = "";
  }
  const vid = `${sessionCookie}.mp4`;

  const sql = 'SELECT status FROM meme_ronaldo WHERE value=? ORDER BY id DESC LIMIT 1';
  connection.query(sql, [sessionCookie], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      const row = result[0];

      if (row.status === '1') {
        res.send(`<a href=/`+vid+`>Click here</a>`);
      } else {
        res.send('Processing...');
      }
    } else {
      res.send('Cookie is not set, please return to <a href="/">home</a>');
    }
  });
});

// Define the directory containing the MP4 files
const videosDir = './videos';
app.use('/',express.static(path.join(__dirname, 'videos')));

// Create an object to store the current routes, as a part of videos
const routes = {};

// Get a list of all MP4 files in the directory and create initial routes
const files = fs.readdirSync(videosDir);
for (const file of files) {
  if (file.endsWith('.mp4')) {
    const filePath = path.join(videosDir, file);
    const videoName = path.basename(file, '.mp4');

    routes[videoName] = filePath;

    app.get(`/${videoName}`, (req, res) => {
      res.sendFile(filePath);
    });
  }
}

// Set up file system monitoring to detect changes in the videos directory
fs.watch(videosDir, (event, filename) => {
  if (event === 'rename' || event === 'change') {
    // Check if the renamed or changed file is an MP4 file
    if (filename.endsWith('.mp4')) {
      const filePath = path.join(videosDir, filename);
      const videoName = path.basename(filename, '.mp4');

      // Update the routes object and update the corresponding route handler
      routes[videoName] = filePath;
      app.get(`/${videoName}`, (req, res) => {
        res.sendFile(filePath);
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
