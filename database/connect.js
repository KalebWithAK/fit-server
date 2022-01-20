const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: process.env.dbPassword,
    database: 'Fit'
});

module.exports = db;