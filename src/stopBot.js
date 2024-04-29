const { connection } = require('./connectMysql');

function stopBot(bot) {
    process.once('SIGINT', async () => {
        try {
            console.log('Остановка бота...');
            await bot.stop();
            console.log('Бот остановлен');

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
