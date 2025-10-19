const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'charityevents_db',
    charset: 'utf8mb4'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = connection;