const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// -------------------------
// 1. MySQL CONNECTION
// -------------------------
const db = mysql.createConnection({
    host: "localhost",
    user: "root",           
    password: "Cs#_6308",           
    database: "beautyMart"  
});

// Check MySQL connection
db.connect((err) => {
    if (err) {
        console.log("MySQL Connection Failed:", err);
        return;
    }
    console.log("MySQL Connected Successfully!");
});

// -------------------------
// 2. REGISTER USER
// -------------------------
app.post("/register", (req, res) => {
    const { fullName, email, phone, address, password } = req.body;

    const sql = "INSERT INTO users (fullName, email, phone, address, password) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [fullName, email, phone, address, password], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Registration failed", error: err });
        }
        res.json({ message: "User Registered Successfully!" });
    });
});
// -------------------------
// 3. LOGIN USER with logging
// -------------------------
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ message: "Login error", error: err });

        const user_id = results.length > 0 ? results[0].id : null;
        const status = results.length > 0 ? "success" : "failed";
        const ip = req.ip || req.connection.remoteAddress;

        // Insert login attempt into user_logins table
        const insertLogin = "INSERT INTO user_logins (user_id, email, status, ip_address) VALUES (?, ?, ?, ?)";
        db.query(insertLogin, [user_id, email, status, ip], (err2) => {
            if (err2) console.error("Error logging login attempt:", err2);
        });

        // Respond to client
        if (results.length > 0) {
            res.json({ message: "Login Successful!" });
        } else {
            res.status(401).json({ message: "Invalid Email or Password" });
        }
    });
});

// -------------------------
// 4. START SERVER
// -------------------------
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
