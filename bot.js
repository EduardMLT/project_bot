// const TelegramBot = require("node-telegram-bot-api");
// const token = "YOUR_TELEGRAM_BOT_TOKEN"; // Токен бота від BotFather
// const bot = new TelegramBot(token, { polling: true });

// // Відправка повідомлення в канал
// const channelId = "@your_test_channel"; // ID або ім'я каналу

// bot.onText(/\/send (.+)/, (msg, match) => {
//   const chatId = msg.chat.id;
//   const resp = match[1]; // Текст повідомлення
//   bot.sendMessage(channelId, resp); // Відправка в канал
//   bot.sendMessage(chatId, "Повідомлення надіслано!");
// });

/***************************** */

// const TelegramBot = require("node-telegram-bot-api");
// const token = "7475221612:AAEAFWEl6UJ5HovUlK3dY_MI7rJ5Hy73ikM";
// const bot = new TelegramBot(token, { polling: true });

// // Отримання ID, коли хтось надсилає повідомлення в канал
// bot.on("message", (msg) => {
//     console.log("start bot");
//   console.log(msg.chat.id); // Виводить ID чату (каналу) у консоль
// });

/****************** */

// const TelegramBot = require("node-telegram-bot-api");
// const token = "";
// const bot = new TelegramBot(token, { polling: true });

// // Лог при запуску бота
// console.log("Бот запущено!");

// // Обробка отриманих повідомлень
// bot.on("message", (msg) => {
//   const chatId = msg.chat.id;
//   console.log(`Отримано повідомлення: ${msg.text} від користувача ${chatId}`);
//   bot.sendMessage(chatId, "Привіт! Я ваш бот.");
// });

/****************** */

// require("dotenv").config();
// const TelegramBot = require("node-telegram-bot-api");

// // Отримання токена з .env
// const token = process.env.TELEGRAM_BOT_TOKEN;
// const bot = new TelegramBot(token, { polling: true });

// const channelId = process.env.TELEGRAM_CHANNEL_ID; // ID вашого каналу

// console.log("Бот запущено!");

// bot.on("message", (msg) => {
//   const chatId = msg.chat.id;
//   const text = msg.text;
//   console.log(`Отримано повідомлення: ${text} від користувача ${chatId}`);
//   bot.sendMessage(chatId, "Привіт! Я ваш бот.");
// });

// // Тестове сповіщення в канал
// bot.sendMessage(channelId, "Тестове сповіщення для каналу!");

require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// Отримання токена та ID каналу з .env
const token = process.env.TELEGRAM_BOT_TOKEN;
const channelId = process.env.TELEGRAM_CHANNEL_ID;
const bot = new TelegramBot(token, { polling: true });

console.log("Бот запущено!");

// Функція для отримання інформації про канал
const getChannelInfo = async () => {
  try {
    const chat = await bot.getChat(channelId);
    return chat.username; // або chat.username для username каналу
  } catch (error) {
    console.error("Помилка при отриманні інформації про канал:", error);
    return "Невідомий канал";
  }
};

// Обробка отриманих повідомлень
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const channelName = await getChannelInfo(); // Отримання імені каналу

  console.log(
    `Отримано повідомлення: ${text} від користувача ${chatId} у каналі ${channelName}`
  );
  bot.sendMessage(chatId, "Привіт! Я ваш бот.");
});

// Тестове сповіщення в канал
bot.sendMessage(channelId, "Тестове сповіщення для каналу!");