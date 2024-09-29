const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

// Enable cors for all routes
app.use(cors());

// Parse incoming request bodies in a middleware before handlers
app.use(bodyParser.json());

// Connect to the SQLite database or create one if it doesn't exist
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error connecting to the database", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create user table
db.run(`CREATE TABLE IF NOT EXISTS User(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
  )`);

// create address table

db.run(`CREATE TABLE IF NOT EXISTS Address(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT NOT NULL,
    userId INTEGER,
    FOREIGN KEY(userId) REFERENCES User(id) ON DELETE CASCADE
    )`);

// POST endpoint to handle user and address submissions

app.post("/register", (req, res) => {
  const { name, address } = req.body;
  if (!name || !address) {
    res.status(400);
    res.send({ message: "Name and address are required" });
    return;
  }

  // Check if the user with the given name already exists
  const findUserQuery = `SELECT * FROM User where name = ?`;
  db.get(findUserQuery, [name], function (err, row) {
    if (err) {
      res.status(500);
      res.send({ message: "Failed to fetch user details" });
      return;
    }
    if (row) {
      // Step 2: User exists, insert the address with the found userId
      const userId = row.id;
      const insertAddressQuery = `INSERT INTO Address (address,userId) VALUES (?,?)`;
      db.run(insertAddressQuery, [address, userId], function (err) {
        if (err) {
          res.status(500);
          res.send({ message: "Failed to insert address" });
          return;
        }
        res.status(200);
        res.send({ message: "Address saved for the existing user" });
        return;
      });
    } else {
      // Step 3: User does not exist, create a new user record and insert the address
      const insertUserQuery = `INSERT INTO User(name) VALUES (?)`;

      db.run(insertUserQuery, [name], function (err) {
        if (err) {
          res.status(500);
          res.send({ message: "Failed to insert new user details" });
          return;
        }

        const newUserId = this.lastID;

        const insertAddressQuery = `INSERT INTO Address (address,userId) VALUES (?,?)`;

        db.run(insertAddressQuery, [address, newUserId], function (err) {
          if (err) {
            res.status(500);
            res.send({ message: "Failed to insert address" });
            return;
          }

          res.status(200);
          res.send({ message: "User and address saved successfully" });
          return;
        });
      });
    }
  });
});

app.get("/users", (req, res) => {
  const getAllUsersQuery = `SELECT * FROM User`;
  db.all(getAllUsersQuery, [], function (err, rows) {
    if (err) {
      res.status(500);
      res.send({ message: "Failed to fetch all users" });
      return;
    }

    if (!rows) {
      res.status(400);
      res.send({ message: "Users not found" });
    }

    res.status(200);
    res.send({ users: rows });
  });
});

app.get("/address/:userId", (req, res) => {
  const { userId } = req.params;

  const getAllAddressesQuery = `SELECT * FROM Address WHERE userId = (?)`;

  db.all(getAllAddressesQuery, [userId], function (err, rows) {
    if (err) {
      res.status(500);
      res.send({ message: "Failed to fetch all address " });
      return;
    }

    if (!rows) {
      res.status(400);
      res.send({ message: "address not found" });
    }

    res.status(200);
    res.send({ addresses: rows });
  });
});

// start the server
const port = 3000;

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
