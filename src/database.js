const { connection } = require('./connectMysql');

// Подключение к базе данных
connection.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключение к базе данных успешно!');
});

// Функция для выполнения SQL-запроса
function executeQuery(ctx, sql, values, callback) {
    // Выполнение SQL-запроса
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Ошибка выполнения SQL-запроса:', err);
            ctx.reply('Произошла ошибка при сохранении вашего ответа. Пожалуйста, попробуйте еще раз.');
            return;
        }

        console.log('Ответ пользователя успешно сохранен в базе данных!');


        callback();
    });
}

module.exports = {
    executeQuery
};
