// Вопросы для опроса
const questionsLp = [
    'Цель создания Landing Page?',
    'Отметьте наличие материалов',
    'Какие приемлимые сроки разработки сайта?',
    'Ваше решение по вопросу дизайна?'
];

const buttonIndicatonLp = {
    question_1: {
        key_1: 'Узнаваемости бренда',
        key_2: 'Увеличение продаж',
        action_1: 'lp_brand1',
        action_2: 'lp_commerce1'
    },
    question_2: {
        key_1: 'Фото',
        key_2: 'Лого',
        key_3: 'Видео',
        action_1: 'lp_foto2',
        action_2: 'lp_logo2',
        action_3: 'lp_video2'
    },
    question_3: {
        key_1: 'Меньше месяца',
        key_2: 'До 2-х месяцев',
        key_3: 'До 3-х месяцев',
        action_1: 'lp_monthA3',
        action_2: 'lp_monthB3',
        action_3: 'lp_monthC3'
    },
    question_4: {
        key_1: 'Есть примеры',
        key_2: 'Полажусь на опыт',
        key_3: 'Есть готовый',
        action_1: 'lp_dizainA4',
        action_2: 'lp_dizainB4',
        action_3: 'lp_dizainC4'
    }


};

module.exports = {
    questionsLp,
    buttonIndicatonLp
};
