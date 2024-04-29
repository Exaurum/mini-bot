const path = require('path');
const fs = require('fs');
const { Telegraf, session, Markup } = require('telegraf');

require('dotenv').config();
const { BOT_TOKEN, CHAT_ID } = process.env;
if (!BOT_TOKEN || !CHAT_ID) throw new Error('"BOT_TOKEN" env var is required!');

const bot = new Telegraf(BOT_TOKEN);
const chatId = CHAT_ID;

module.exports = {
    session,
    Markup,
    BOT_TOKEN,
    chatId,
    bot,
    fs,
    path
};
