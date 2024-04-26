const { connection } = require('./connectMysql');

function stopBot(bot) {
    // Ctrl+C обработчики событий SIGINT и SIGTERM для остановки бота
    process.once('SIGINT', async () => {
        try {
            console.log('Остановка бота...');
            await bot.stop();
            console.log('Бот остановлен');
            // Закрытие соединения с базой данных
            connection.end((err) => {
                if (err) {
                    console.error('Ошибка закрытия соединения с базой данных:', err);
                    return;
                }
                console.log('Соединение с базой данных успешно закрыто');
            });
        } catch (error) {
            console.error('Ошибка при остановке бота:', error);
        }
    });

    process.once('SIGTERM', async () => {
        try {
            console.log('Остановка бота...');
            await bot.stop();
            console.log('Бот остановлен');
            // Закрытие соединения с базой данных
            connection.end((err) => {
                if (err) {
                    console.error('Ошибка закрытия соединения с базой данных:', err);
                    return;
                }
                console.log('Соединение с базой данных успешно закрыто');
            });
        } catch (error) {
            console.error('Ошибка при остановке бота:', error);
        }
    });
}

module.exports = stopBot;
