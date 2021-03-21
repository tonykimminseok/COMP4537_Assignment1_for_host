const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    host: process.env.HOST,
    port: process.env.PORT_DB,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DABABASE,
});

client.connect((err) => {
    if (err) {
        console.log("Database not connected!")
        throw err;
    }

    console.log('Database connected!');
});

module.exports = client;
