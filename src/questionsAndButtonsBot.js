// Вопросы для опроса
const questionsBot = [
    'Нужен ли сбор статистики и данных пользователя?',
    'Какие языки должен поддерживать чат-бот (ассистент)?',
    'С какой системой необходимо интегрировать чат-бота?',
    'Нужен ли поиск или фильтрацию по заданным параметрам?'
];

const buttonIndicatonBot = {

    question_1: {
        key_1: 'да',
        key_2: 'нет',
        action_1: 'bot_yes1',
        action_2: 'bot_no1'
    },
    question_2: {
        key_1: 'Русский',
        key_2: 'Английский',
        key_3: 'Оба языка',
        action_1: 'bot_ru2',
        action_2: 'bot_en2',
        action_3: 'bot_all2'
    },
    question_3: {
        key_1: '1C',
        key_2: 'Excel (MS Office, Google Sheets)',
        key_3: 'Биллинг',
        action_1: 'bot_1c3',
        action_2: 'bot_table3',
        action_3: 'bot_biling3'
    },
    question_4: {
        key_1: 'Да',
        key_2: 'Нет',
        action_1: 'bot_yes4',
        action_2: 'bot_no4'
    }

};

module.exports = {
    questionsBot,
    buttonIndicatonBot
};
