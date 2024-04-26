const mysql = require('mysql');

// обращение к сокрытой записи
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWD, DB_BASE_NAME } = process.env;
if (!DB_HOST || !DB_USER || !DB_PASSWD || !DB_BASE_NAME) throw new Error('"MYSQL_CONFIG" env var is required!');

// Создание подключения к базе данных MySQL
const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWD,
    database: DB_BASE_NAME
});

module.exports = {
    connection
};
