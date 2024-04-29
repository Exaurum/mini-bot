const { session, Markup, bot, chatId, fs, path } = require('./config');
const { executeQuery } = require('./database');
const { questionsBot, buttonIndicatonBot } = require('./questionsAndButtonsBot');
const { questionsLp, buttonIndicatonLp } = require('./questionsAndButtonsLp');
const stopBot = require('./stopBot');

bot.use((ctx, next) => {
    const start = Date.now();
    return next().then(() => {
        const ms = Date.now() - start;
        console.log('время отклика %sms', ms);
    });
});

bot.use(session());


bot.command('bot_quit_chat', async (ctx) => {
    await ctx.telegram.leaveChat(ctx.message.chat.id);


    await ctx.leaveChat();
});

bot.start(async (ctx) => {
    try {
        const photoPath = path.join(__dirname, 'images/navigator.jpg');
        const photo = fs.readFileSync(photoPath);


        await ctx.replyWithPhoto({ source: photo, chatId });


        await ctx.reply('Привет! Я бот NAVIGATOR. Я помогу вам выбрать и оформить заказ на одну из следующих услуг: \n');


        await ctx.reply('Выберите действие:', coinInlineKeyboard);
    } catch (error) {
        console.error('Произошла ошибка:', error);

        await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте еще раз позже.');
    }
});





const button1 = Markup.button.callback('Разработка chat-bot', 'development_chat');
const button2 = Markup.button.callback('Разработка landing pages', 'development_lp');


const coinInlineKeyboard = Markup.inlineKeyboard([
    [button1],
    [button2]
]);


bot.action('development_chat', async (ctx) => {
    try {
        const currentQuestionIndex = 0;

        const { question, buttons } = generateButtons(questionsBot, buttonIndicatonBot, currentQuestionIndex);


        if (!ctx.session) {
            ctx.session = {};
        }

        ctx.session.question = question;
        ctx.session.buttons = buttons;


        ctx.session.developmentType = 'chat_bot';


        await ctx.reply(question, Markup.inlineKeyboard(buttons));


        if (!ctx.session.userId && !ctx.session.chatId) {
            ctx.session.userId = ctx.from.id;
            ctx.session.chatId = ctx.chat.id;


            console.log(`Сессии для пользователя доступны userId ${ctx.session.userId}`);
            console.log(`Сессии для пользователя доступны chatId ${ctx.session.chatId}`);
        } else {
            console.log('Сессии не сработали');
        }


        ctx.session.currentQuestionIndex = currentQuestionIndex;
    } catch (error) {
        console.error('Произошла ошибка:', error);

        await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте еще раз позже.');
    }
});



bot.action('development_lp', async (ctx) => {
    try {
        const currentQuestionIndex = 0;

        const { question, buttons } = generateButtons(questionsLp, buttonIndicatonLp, currentQuestionIndex);


        if (!ctx.session) {
            ctx.session = {};
        }


        ctx.session.question = question;
        ctx.session.buttons = buttons;


        ctx.session.developmentType = 'dev_lp';


        await ctx.reply(question, Markup.inlineKeyboard(buttons));


        if (!ctx.session.userId && !ctx.session.chatId) {
            ctx.session.userId = ctx.from.id;
            ctx.session.chatId = ctx.chat.id;


            console.log(`Сессии для пользователя доступны userId ${ctx.session.userId}`);
            console.log(`Сессии для пользователя доступны chatId ${ctx.session.chatId}`);
        } else {
            console.log('Сессии не сработали');
        }


        ctx.session.currentQuestionIndex = currentQuestionIndex;
    } catch (error) {
        console.error('Произошла ошибка:', error);

        await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте еще раз позже.');
    }
});


bot.on('callback_query', (ctx) => {
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


    let currentQuestionIndex = ctx.session.currentQuestionIndex;

    const buttonData = ctx.callbackQuery.data;

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


    const unixTime = Math.floor(Date.now() / 1000);


    const sql = 'INSERT INTO orders (user_id, chat_id, username, service, question, answer, unix_time) VALUES (?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?))';


    const values = [userId, chatId, username, service, question, answer, unixTime];



    executeQuery(ctx, sql, values, () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            const { question, buttons } = generateButtons(questions, buttonIndicaton, currentQuestionIndex);
            ctx.reply(question, Markup.inlineKeyboard(buttons));


            ctx.session.currentQuestionIndex = currentQuestionIndex;


            ctx.session.question = question;
            ctx.session.buttons = buttons;
        } else {
            ctx.reply('Спасибо за заполнение опроса! Мы свяжемся с вами в ближайшее время для обсуждения деталей заказа.');

            delete ctx.session.currentQuestionIndex;
        }
    });
});


function generateButtons(questions, buttonIndicaton, questionIndex) {
    const question = questions[questionIndex];


    const buttonData = buttonIndicaton[`question_${questionIndex + 1}`];


    const buttons = [];


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


bot.launch().then(() => {
    console.log('Бот запущен');
}).catch((err) => {
    console.error('Ошибка запуска бота:', err);
});


stopBot(bot);
