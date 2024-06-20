const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para redirigir HTTP a HTTPS
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'klmmiwtj_site001',
  password: 'fdjfd8JDF7DH7$%dsfd',
  database: 'klmmiwtj_site01'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating subscriptions table:', err.message);
      return;
    }
    console.log('Subscriptions table created or already exists');
  });

  const createReviewsTableQuery = `
    CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      review TEXT NOT NULL,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createReviewsTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating reviews table:', err.message);
      return;
    }
    console.log('Reviews table created or already exists');
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/reviews', (req, res) => {
  const query = 'SELECT * FROM reviews ORDER BY date DESC LIMIT 10';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching reviews:', err.message);
      return res.status(500).send('Error fetching reviews');
    }
    res.json(results);
  });
});

app.post('/submit-review', (req, res) => {
  const { name, review } = req.body;
  if (!name || !review) {
    return res.status(400).send('Name and review are required');
  }

  const insertQuery = 'INSERT INTO reviews (name, review) VALUES (?, ?)';
  db.query(insertQuery, [name, review], (err, result) => {
    if (err) {
      console.error('Error saving review:', err.message);
      return res.status(500).send('Error saving review');
    }
    res.json({ success: true });
  });
});

app.post('/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send('Email is required');
  }

  const insertQuery = 'INSERT INTO subscriptions (email) VALUES (?)';
  db.query(insertQuery, [email], (err, result) => {
    if (err) {
      console.error('Error saving subscription:', err.message);
      return res.status(500).send('Error saving subscription');
    }
    res.send('Subscription successful');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.post('/submit-project', (req, res) => {
  const { name, phone, project } = req.body;
  if (!name || !phone || !project) {
    return res.status(400).send('All fields are required');
  }

  const insertQuery = 'INSERT INTO projects (name, phone, project) VALUES (?, ?, ?)';
  db.query(insertQuery, [name, phone, project], (err, result) => {
    if (err) {
      console.error('Error saving project:', err.message);
      return res.status(500).send('Error saving project');
    }
    res.json({ success: true });
  });
});



