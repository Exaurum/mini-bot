const path = require('path');
const fs = require('fs');
const { Telegraf, session, Markup } = require('telegraf');

// обращение к сокрытой записи
require('dotenv').config();
const { BOT_TOKEN, CHAT_ID } = process.env;
if (!BOT_TOKEN || !CHAT_ID) throw new Error('"BOT_TOKEN" env var is required!');

// создаем экземпляр bot от telegraf
const bot = new Telegraf(BOT_TOKEN);
const chatId = CHAT_ID;// замените на свое значение, подробнее ниже

module.exports = {
    session,
    Markup,
    BOT_TOKEN,
    chatId,
    bot,
    fs,
    path
};
