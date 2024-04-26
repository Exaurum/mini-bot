// Подключаем файл config.js
const { session, Markup, bot, chatId, fs, path } = require('./config');
const { executeQuery } = require('./database');
const { questionsBot, buttonIndicatonBot } = require('./questionsAndButtonsBot');
const { questionsLp, buttonIndicatonLp } = require('./questionsAndButtonsLp');
const stopBot = require('./stopBot');

// Register logger middleware
bot.use((ctx, next) => {
    const start = Date.now();
    return next().then(() => {
        const ms = Date.now() - start;
        console.log('время отклика %sms', ms);
    });
});

// Register session middleware
bot.use(session());


// выход бота из чата если туду его добавили
bot.command('bot_quit_chat', async (ctx) => {
    // Явное использование
    await ctx.telegram.leaveChat(ctx.message.chat.id);

    // Использование контекстного ярлыка
    await ctx.leaveChat();
});

bot.start(async (ctx) => {
    try {
        const photoPath = path.join(__dirname, 'images/navigator.jpg');
        const photo = fs.readFileSync(photoPath); // Чтение изображения из файла

        // Отправляем изображение в ответ на команду /start
        await ctx.replyWithPhoto({ source: photo, chatId });

        // Затем отправляем текстовое сообщение
        await ctx.reply('Привет! Я бот NAVIGATOR. Я помогу вам выбрать и оформить заказ на одну из следующих услуг: \n');

        // Отправляем клавиатуру с кнопками
        await ctx.reply('Выберите действие:', coinInlineKeyboard);
    } catch (error) {
        console.error('Произошла ошибка:', error);
        // Обработка ошибок, если что-то пошло не так при отправке сообщений
        await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте еще раз позже.');
    }
});

// создаем клавиатуру для бота
// const coinInlineKeyboard = Markup.inlineKeyboard([Markup.button.callback('Разработка чат', 'flip_a_coint')])

// Создаем две кнопки
const button1 = Markup.button.callback('Разработка chat-bot', 'development_chat');
const button2 = Markup.button.callback('Разработка landing pages', 'development_lp');

// Создаем клавиатуру с этими кнопками
const coinInlineKeyboard = Markup.inlineKeyboard([
    [button1],
    [button2]
]);

// Обработчик нажатия на кнопку "Разработка чат-бот"
bot.action('development_chat', async (ctx) => {
    try {
        const currentQuestionIndex = 0;
        // Генерируем кнопки и вопросы для чат-бота
        const { question, buttons } = generateButtons(questionsBot, buttonIndicatonBot, currentQuestionIndex);

        // Инициализируем объект session, если он еще не был инициализирован
        if (!ctx.session) {
            ctx.session = {};
        }

        // Записываем вопросы и кнопки в сессию
        ctx.session.question = question;
        ctx.session.buttons = buttons;

        // При нажатии кнопки "Разработка чат-бот"
        ctx.session.developmentType = 'chat_bot';

        // Отправляем вопрос с клавиатурой
        await ctx.reply(question, Markup.inlineKeyboard(buttons));

        // Сохранение или чтение данных из сессии
        if (!ctx.session.userId && !ctx.session.chatId) {
            // Если это первое сообщение от пользователя, сохраняем его ID в сессию
            ctx.session.userId = ctx.from.id;
            ctx.session.chatId = ctx.chat.id;

            // Отправляем текстовое сообщение в ответ на нажатие кнопки
            console.log(`Сессии для пользователя доступны userId ${ctx.session.userId}`);
            console.log(`Сессии для пользователя доступны chatId ${ctx.session.chatId}`);
        } else {
            console.log('Сессии не сработали');
        }

        // Сохраняем индекс текущего вопроса в сессии
        ctx.session.currentQuestionIndex = currentQuestionIndex;
    } catch (error) {
        console.error('Произошла ошибка:', error);
        // Обработка ошибок, если что-то пошло не так при отправке сообщений
        await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте еще раз позже.');
    }
});


// Обработчик нажатия на кнопку "Разработка landing page"
bot.action('development_lp', async (ctx) => {
    try {
        const currentQuestionIndex = 0;
        // Генерируем кнопки и вопросы для landing page
        const { question, buttons } = generateButtons(questionsLp, buttonIndicatonLp, currentQuestionIndex);

        // Инициализируем объект session, если он еще не был инициализирован
        if (!ctx.session) {
            ctx.session = {};
        }

        // Записываем вопросы и кнопки в сессию
        ctx.session.question = question;
        ctx.session.buttons = buttons;

        // При нажатии кнопки "Разработка чат-бот"
        ctx.session.developmentType = 'dev_lp';

        // Отправляем вопрос с клавиатурой
        await ctx.reply(question, Markup.inlineKeyboard(buttons));

        // Сохранение или чтение данных из сессии
        if (!ctx.session.userId && !ctx.session.chatId) {
            // Если это первое сообщение от пользователя, сохраняем его ID в сессию
            ctx.session.userId = ctx.from.id;
            ctx.session.chatId = ctx.chat.id;

            // Отправляем текстовое сообщение в ответ на нажатие кнопки
            console.log(`Сессии для пользователя доступны userId ${ctx.session.userId}`);
            console.log(`Сессии для пользователя доступны chatId ${ctx.session.chatId}`);
        } else {
            console.log('Сессии не сработали');
        }

        // Сохраняем индекс текущего вопроса в сессии
        ctx.session.currentQuestionIndex = currentQuestionIndex;
    } catch (error) {
        console.error('Произошла ошибка:', error);
        // Обработка ошибок, если что-то пошло не так при отправке сообщений
        await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте еще раз позже.');
    }
});


// Создаем обработчик текстового ответа пользователя
bot.on('callback_query', (ctx) => {
    // Определяем, какой модуль вопросов и кнопок использовать
    let questions, buttonIndicaton;

    if (ctx.session.developmentType === 'chat_bot') {
        questions = questionsBot;
        buttonIndicaton = buttonIndicatonBot;
    } else if (ctx.session.developmentType === 'dev_lp') {
        questions = questionsLp;
        buttonIndicaton = buttonIndicatonLp;
    } else {
        console.log('Не определен контекст работы с выбором заказа');
    }

    // // Получаем индекс текущего вопроса из сессии
    let currentQuestionIndex = ctx.session.currentQuestionIndex;
    // Получаем данные о нажатой кнопке - экшен
    const buttonData = ctx.callbackQuery.data;
    // Сохраняем ответ пользователя в базу данных MySQL
    const userId = ctx.session.userId;
    const chatId = ctx.session.chatId;
    const username = ctx.from.username;
    const service = ctx.session.developmentType;
    const question = questions[currentQuestionIndex];
    const objX = buttonIndicaton[`question_${currentQuestionIndex + 1}`];

    let answer = '';

    if (typeof objX === 'object' && objX !== null) {
        answer = objX[`key_${buttonData.split('_')[1]}`];
    } else {
        answer = 'Не найден ключ объекта клавиатуры';
    }



    // Время ответа пользователя
    const unixTime = Math.floor(Date.now() / 1000); // Текущее время в формате Unix

    // SQL-запрос для вставки ответа пользователя в базу данных
    const sql = 'INSERT INTO orders (user_id, chat_id, username, service, question, answer, unix_time) VALUES (?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?))';

    // Данные для вставки в запрос
    const values = [userId, chatId, username, service, question, answer, unixTime];


    // Вызов функции executeQuery с передачей контекста ctx
    executeQuery(ctx, sql, values, () => {
        // В этом блоке кода вы можете использовать updatedQuestionIndex, который будет содержать обновленное значение
        // Если есть необходимость выполнить какие-либо действия с этим значением

        // Переходим к следующему вопросу (если есть)
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            const { question, buttons } = generateButtons(questions, buttonIndicaton, currentQuestionIndex);
            ctx.reply(question, Markup.inlineKeyboard(buttons));

            // Обновляем индекс текущего вопроса в сессии
            ctx.session.currentQuestionIndex = currentQuestionIndex;

            // Обновляем 
            ctx.session.question = question;
            ctx.session.buttons = buttons;
        } else {
            // Если вопросы закончились, завершаем опрос
            ctx.reply('Спасибо за заполнение опроса! Мы свяжемся с вами в ближайшее время для обсуждения деталей заказа.');
            // Удаляем индекс текущего вопроса из сессии
            delete ctx.session.currentQuestionIndex;
        }
    });
});


function generateButtons(questions, buttonIndicaton, questionIndex) {
    // Получаем вопрос из массива вопросов
    const question = questions[questionIndex];

    // Получаем данные для кнопок из объекта buttonIndicaton
    const buttonData = buttonIndicaton[`question_${questionIndex + 1}`];

    // Создаем массив кнопок
    const buttons = [];

    // Фильтруем ключи объекта и создаем кнопки только для key_ и action_
    Object.keys(buttonData).forEach((key) => {
        if (key.startsWith('key_')) {
            const actionKey = `action_${key.split('_')[1]}`;
            if (buttonData[actionKey]) {
                buttons.push(Markup.button.callback(buttonData[key], actionKey));
            }
        }
    });

    return { question, buttons };
}

bot.help((ctx) => ctx.reply('BOT NAVIGATOR - это личный помощник разработчика. \n\t Команды: \n /del - удалить заявку \n'));

// запуск
bot.launch().then(() => {
    console.log('Бот запущен');
}).catch((err) => {
    console.error('Ошибка запуска бота:', err);
});


stopBot(bot);
