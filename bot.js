const TelegramBot = require("node-telegram-bot-api");
const token = "YOUR_TELEGRAM_BOT_TOKEN"; // Токен бота від BotFather
const bot = new TelegramBot(token, { polling: true });

// Відправка повідомлення в канал
const channelId = "@your_test_channel"; // ID або ім'я каналу

bot.onText(/\/send (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1]; // Текст повідомлення
  bot.sendMessage(channelId, resp); // Відправка в канал
  bot.sendMessage(chatId, "Повідомлення надіслано!");
});
