/*************** 1 - цей бот отримує нове сповіщення яке вручну йому передається з monitoredChannelId і відправляє його до  alertChannelId , якщо сповіщення має попередження УВАГа( регістр не важливий ) - то попередження передається в  alertChannelId якщо ні - просто текст повідомлення виводиться в консоль*/

// require("dotenv").config();
// const TelegramBot = require("node-telegram-bot-api");

// // Отримання токена та ID каналу з .env
// const token = process.env.TELEGRAM_BOT_TOKEN;
// const monitoredChannelId = String(process.env.MONITORED_CHANNEL_ID); // ID каналу для моніторингу
// const alertChannelId = String(process.env.ALERT_CHANNEL_ID); // Ваш канал для тривожних сповіщень
// const bot = new TelegramBot(token, { polling: true });

// console.log("Бот запущено!");

// // Обробка повідомлень
// bot.on("message", (msg) => {
//   const chatId = String(msg.chat.id);
//   const text = msg.text;
//   const forwardFromChatId = msg.forward_from_chat
//     ? String(msg.forward_from_chat.id)
//     : null;

//   console.log(`Отримано повідомлення: ${JSON.stringify(msg)}`);

//   // Перевірка chatId та forwardFromChatId
//   console.log(
//     `Chat ID: ${chatId}, Monitored Channel ID: ${monitoredChannelId}`
//   );
//   console.log(`Forward From Chat ID: ${forwardFromChatId}`);
//   console.log(`Text: ${text}`);

//   // Перевірка, чи повідомлення з монітореного каналу
//   if (
//     (forwardFromChatId && forwardFromChatId === monitoredChannelId) ||
//     chatId === monitoredChannelId
//   ) {
//     console.log(`Отримано повідомлення з монітореного каналу: ${text}`);

//     // Перевірка, чи є в повідомленні слово "УВАГА" (незалежно від регістру)
//     if (text && text.toUpperCase().includes("УВАГА")) {
//       console.log("Попередження з УВАГОЮ знайдено!");

//       // Надсилаємо повідомлення до каналу для тривожних сповіщень
//       bot
//         .sendMessage(alertChannelId, `Термінове попередження: ${text}`)
//         .catch((err) =>
//           console.error(`Помилка при відправці повідомлення: ${err}`)
//         );
//     } else {
//       // Якщо немає слова "УВАГА", виводимо повідомлення в консоль
//       console.log(`Повідомлення не містить попередження ,  є звичайним : ${text}`);
//     }
//   } else {
//     console.log(`Отримано повідомлення з іншого джерела: ${text}`);
//   }
// });

// // Обробка помилок бота
// bot.on("polling_error", (error) => {
//   console.error(`Помилка polling: ${error.message}`);
// });

/********* 8- налуштуємо вебХуки */
/**************** 9-   після кожного перезапуску Ngrok і сервера вебхук буде оновлюватися автоматично, що усуває необхідність ручної зміни URL */

// require("dotenv").config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const axios = require("axios"); // Для HTTP запитів
// const TelegramBot = require("node-telegram-bot-api");

// const token = process.env.TELEGRAM_BOT_TOKEN;
// const monitoredChannelId = String(process.env.MONITORED_CHANNEL_ID);
// const alertChannelId = String(process.env.ALERT_CHANNEL_ID);

// const bot = new TelegramBot(token);

// const app = express();
// app.use(bodyParser.json());

// let webhookUrl = "";

// // Функція для отримання поточного URL Ngrok
// async function getNgrokUrl() {
//   try {
//     const res = await axios.get("http://127.0.0.1:4040/api/tunnels");
//     const tunnels = res.data.tunnels;
//     const httpsTunnel = tunnels.find((tunnel) => tunnel.proto === "https");
//     return httpsTunnel ? httpsTunnel.public_url : null;
//   } catch (err) {
//     console.error("Помилка отримання Ngrok URL:", err);
//     return null;
//   }
// }

// // Оновлення вебхука
// async function updateWebhook() {
//   const ngrokUrl = await getNgrokUrl();
//   if (!ngrokUrl) {
//     console.error("Не вдалося отримати URL Ngrok.");
//     return;
//   }

//   webhookUrl = `${ngrokUrl}/bot${token}`;
//   bot
//     .setWebHook(webhookUrl)
//     .then(() => {
//       console.log(`Вебхук успішно налаштовано на URL: ${webhookUrl}`);
//     })
//     .catch((err) => {
//       console.error(`Помилка налаштування вебхука: ${err}`);
//     });
// }

// // Викликаємо оновлення вебхука під час запуску
// updateWebhook();

// const updateInterval = 1 * 60 * 1000; // Перевірка кожні 1 хвилину

// // Функція для перевірки і оновлення вебхука
// async function checkAndUpdateWebhook() {
//   console.log(`виконуємо перевірку оновлення вебхука`);
//   try {
//     const webhookInfo = await bot.getWebHookInfo();
//     if (webhookInfo.url !== webhookUrl) {
//       await updateWebhook();
//     }
//   } catch (err) {
//     console.error(`Помилка перевірки вебхука: ${err}`);
//   }
// }

// // Періодична перевірка
// setInterval(checkAndUpdateWebhook, updateInterval);

// // Маршрут для обробки вебхуків
// app.post(`/bot${token}`, (req, res) => {
//   const msg = req.body.message || req.body.channel_post;

//   if (msg) {
//     const chatId = String(msg.chat.id);
//     const text = msg.text;
//     const forwardFromChatId = msg.forward_from_chat
//       ? String(msg.forward_from_chat.id)
//       : null;

//     console.log(`Отримано повідомлення: ${JSON.stringify(msg)}`);

//     if (
//       (forwardFromChatId && forwardFromChatId === monitoredChannelId) ||
//       chatId === monitoredChannelId
//     ) {
//       console.log(`Отримано повідомлення з монітореного каналу: ${text}`);

//       if (text && text.toUpperCase().includes("УВАГА")) {
//         console.log("Попередження з УВАГОЮ знайдено!");

//         bot
//           .sendMessage(
//             alertChannelId,
//             `‼️ <b>Термінове попередження:</b> ${text}`,
//             { parse_mode: "HTML" } // Використання HTML для форматування
//           )
//           .catch((err) =>
//             console.error(`Помилка при відправці повідомлення: ${err}`)
//           );
//       } else {
//         console.log(`Повідомлення не містить попередження: ${text}`);
//       }
//     } else {
//       console.log(`Отримано повідомлення з іншого джерела: ${text}`);
//     }
//   }

//   res.sendStatus(200);
// });

// // Запуск сервера
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Сервер працює на порту ${PORT}`);
// });

/******************** 10- з виводом урл */

// require("dotenv").config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const axios = require("axios"); // Для HTTP запитів
// const TelegramBot = require("node-telegram-bot-api");

// const token = process.env.TELEGRAM_BOT_TOKEN;
// const monitoredChannelId = String(process.env.MONITORED_CHANNEL_ID);
// const alertChannelId = String(process.env.ALERT_CHANNEL_ID);

// const bot = new TelegramBot(token);

// const app = express();
// app.use(bodyParser.json());

// let webhookUrl = "";

// // Функція для отримання поточного URL Ngrok
// async function getNgrokUrl() {
//   try {
//     const res = await axios.get("http://127.0.0.1:4040/api/tunnels");
//     const tunnels = res.data.tunnels;
//     const httpsTunnel = tunnels.find((tunnel) => tunnel.proto === "https");
//     return httpsTunnel ? httpsTunnel.public_url : null;
//   } catch (err) {
//     console.error("Помилка отримання Ngrok URL:", err);
//     return null;
//   }
// }

// // Оновлення вебхука
// async function updateWebhook() {
//   const ngrokUrl = await getNgrokUrl();
//   if (!ngrokUrl) {
//     console.error("Не вдалося отримати URL Ngrok.");
//     return;
//   }

//   const newWebhookUrl = `${ngrokUrl}/bot${token}`;
//   console.log(
//     `1.1 : старий URL: ${webhookUrl}, новий URL: ${newWebhookUrl}`);
  
//   if (webhookUrl !== newWebhookUrl) {
//     console.log(
//       `Оновлення вебхука: старий URL: ${webhookUrl}, новий URL: ${newWebhookUrl}`
//     );
//     webhookUrl = newWebhookUrl;
//     try {
//       await bot.setWebHook(webhookUrl);
//       console.log(`Вебхук успішно налаштовано на URL: ${webhookUrl}`);
//     } catch (err) {
//       console.error(`Помилка налаштування вебхука: ${err}`);
//     }
//   } else {
//     console.log(`URL вебхука залишається без змін: ${webhookUrl}`);
//   }
// }

// const updateInterval = 1 * 20 * 500; // Перевірка кожні 10 сек

// // Викликаємо оновлення вебхука під час запуску
// (async () => {
//   await updateWebhook();
//   setInterval(checkAndUpdateWebhook, updateInterval); // Періодична перевірка
// })();



// // Функція для перевірки і оновлення вебхука
// async function checkAndUpdateWebhook() {
//   console.log(`Виконуємо перевірку оновлення вебхука`);
//   try {
//     const webhookInfo = await bot.getWebHookInfo();
//     console.log(`Поточний URL вебхука: ${webhookInfo.url}`);
//     if (webhookInfo.url !== webhookUrl) {
//       console.log(`Старий URL вебхука: ${webhookInfo.url}`);
//       await updateWebhook();
//     } else {
//       console.log(`URL вебхука залишається без змін: ${webhookInfo.url}`);
//     }
//   } catch (err) {
//     console.error(`Помилка перевірки вебхука: ${err}`);
//   }
// }

// // Маршрут для обробки вебхуків
// app.post(`/bot${token}`, (req, res) => {
//   const msg = req.body.message || req.body.channel_post;

//   if (msg) {
//     const chatId = String(msg.chat.id);
//     const text = msg.text;
//     const forwardFromChatId = msg.forward_from_chat
//       ? String(msg.forward_from_chat.id)
//       : null;

//     console.log(`Отримано повідомлення: ${JSON.stringify(msg)}`);

//     if (
//       (forwardFromChatId && forwardFromChatId === monitoredChannelId) ||
//       chatId === monitoredChannelId
//     ) {
//       console.log(`Отримано повідомлення з монітореного каналу: ${text}`);

//       if (text && text.toUpperCase().includes("УВАГА")) {
//         console.log("Попередження з УВАГОЮ знайдено!");

//         bot
//           .sendMessage(
//             alertChannelId,
//             `‼️ <b>Термінове попередження:</b> ${text}`,
//             { parse_mode: "HTML" } // Використання HTML для форматування
//           )
//           .catch((err) =>
//             console.error(`Помилка при відправці повідомлення: ${err}`)
//           );
//       } else {
//         console.log(`Повідомлення не містить попередження: ${text}`);
//       }
//     } else {
//       console.log(`Отримано повідомлення з іншого джерела: ${text}`);
//     }
//   }

//   res.sendStatus(200);
// });

// // Запуск сервера
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Сервер працює на порту ${PORT}`);
// });

/******************   18 - перевірки */

// require("dotenv").config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const axios = require("axios"); // Для HTTP запитів
// const TelegramBot = require("node-telegram-bot-api");

// const token = process.env.TELEGRAM_BOT_TOKEN;
// const monitoredChannelId = String(process.env.MONITORED_CHANNEL_ID);
// const alertChannelId = String(process.env.ALERT_CHANNEL_ID);

// const bot = new TelegramBot(token);

// const app = express();
// app.use(bodyParser.json());

// let webhookUrl = ""; // Початково пустий

// // Функція для отримання поточного URL Ngrok
// async function getNgrokUrl() {
//   try {
//     const res = await axios.get("http://127.0.0.1:4040/api/tunnels");
//     const tunnels = res.data.tunnels;
//     const httpsTunnel = tunnels.find((tunnel) => tunnel.proto === "https");
//     return httpsTunnel ? httpsTunnel.public_url : null;
//   } catch (err) {
//     console.error("Помилка отримання Ngrok URL:", err);
//     return null;
//   }
// }

// // Функція для отримання поточного вебхука з Telegram
// async function getCurrentWebhookUrl() {
//   try {
//     const webhookInfo = await bot.getWebHookInfo();
//     return webhookInfo.url || "";
//   } catch (err) {
//     console.error("Помилка отримання поточного вебхука:", err);
//     return "";
//   }
// }

// // Оновлення вебхука
// async function updateWebhook() {
//   const ngrokUrl = await getNgrokUrl();
//   if (!ngrokUrl) {
//     console.error("Не вдалося отримати URL Ngrok.");
//     return;
//   }

//   const newWebhookUrl = `${ngrokUrl}/bot${token}`;
//   console.log(`Поточний URL: ${webhookUrl}, новий URL: ${newWebhookUrl}`);

//   // Оновлюємо вебхук, якщо URL змінився
//   if (webhookUrl !== newWebhookUrl) {
//     console.log(
//       `Оновлення вебхука: старий URL: ${webhookUrl}, новий URL: ${newWebhookUrl}`
//     );
//     webhookUrl = newWebhookUrl; // Оновлюємо локальну змінну
//     try {
//       await bot.setWebHook(webhookUrl);
//       console.log(`Вебхук успішно налаштовано на URL: ${webhookUrl}`);
//     } catch (err) {
//       console.error(`Помилка налаштування вебхука: ${err}`);
//     }
//   } else {
//     console.log(`URL вебхука залишається без змін: ${webhookUrl}`);
//   }
// }

// // Перевірка кожні 10 секунд
// const updateInterval = 10 * 1000;

// // Викликаємо оновлення вебхука під час запуску
// (async () => {
//   webhookUrl = await getCurrentWebhookUrl(); // Призначаємо поточний вебхук під час запуску
//   await updateWebhook();
//   setInterval(checkAndUpdateWebhook, updateInterval); // Періодична перевірка
// })();

// // Функція для перевірки і оновлення вебхука
// async function checkAndUpdateWebhook() {
//   console.log(`Виконуємо перевірку оновлення вебхука`);
//   try {
//     const webhookInfo = await bot.getWebHookInfo();
//     console.log(`Поточний URL вебхука: ${webhookInfo.url}`);
//     if (webhookInfo.url !== webhookUrl) {
//       console.log(`Старий URL вебхука: ${webhookInfo.url}`);
//       await updateWebhook();
//     } else {
//       console.log(`URL вебхука залишається без змін: ${webhookInfo.url}`);
//     }
//   } catch (err) {
//     console.error(`Помилка перевірки вебхука: ${err}`);
//   }
// }

// // Маршрут для обробки вебхуків
// app.post(`/bot${token}`, (req, res) => {
//   const msg = req.body.message || req.body.channel_post;

//   if (msg) {
//     const chatId = String(msg.chat.id);
//     const text = msg.text;
//     const forwardFromChatId = msg.forward_from_chat
//       ? String(msg.forward_from_chat.id)
//       : null;

//     console.log(`Отримано повідомлення: ${JSON.stringify(msg)}`);

//     if (
//       (forwardFromChatId && forwardFromChatId === monitoredChannelId) ||
//       chatId === monitoredChannelId
//     ) {
//       console.log(`Отримано повідомлення з монітореного каналу: ${text}`);

//       if (text && text.toUpperCase().includes("УВАГА")) {
//         console.log("Попередження з УВАГОЮ знайдено!");

//         bot
//           .sendMessage(
//             alertChannelId,
//             `‼️ <b>Термінове попередження:</b> ${text}`,
//             { parse_mode: "HTML" } // Використання HTML для форматування
//           )
//           .catch((err) =>
//             console.error(`Помилка при відправці повідомлення: ${err}`)
//           );
//       } else {
//         console.log(`Повідомлення не містить попередження: ${text}`);
//       }
//     } else {
//       console.log(`Отримано повідомлення з іншого джерела: ${text}`);
//     }
//   }

//   res.sendStatus(200);
// });

// // Запуск сервера
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Сервер працює на порту ${PORT}`);
// });

/*****************  21 -- додаткові перевірки але тут щось з логікою переназначень*/

// require("dotenv").config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const axios = require("axios"); // Для HTTP запитів
// const TelegramBot = require("node-telegram-bot-api");

// const token = process.env.TELEGRAM_BOT_TOKEN;
// const monitoredChannelId = String(process.env.MONITORED_CHANNEL_ID);
// const alertChannelId = String(process.env.ALERT_CHANNEL_ID);

// const bot = new TelegramBot(token);

// const app = express();
// app.use(bodyParser.json());

// let webhookUrl = ""; // Це буде поточний URL вебхука

// // Функція для отримання поточного URL Ngrok
// async function getNgrokUrl() {
//   try {
//     const res = await axios.get("http://127.0.0.1:4040/api/tunnels");
//     const tunnels = res.data.tunnels;
//     const httpsTunnel = tunnels.find((tunnel) => tunnel.proto === "https");
//     return httpsTunnel ? httpsTunnel.public_url : null;
//   } catch (err) {
//     console.error("Помилка отримання Ngrok URL:", err);
//     return null;
//   }
// }

// // Оновлення вебхука
// async function updateWebhook() {
//   const ngrokUrl = await getNgrokUrl();
//   if (!ngrokUrl) {
//     console.error("Не вдалося отримати URL Ngrok.");
//     return;
//   }

//   const newWebhookUrl = `${ngrokUrl}/bot${token}`;

//   // Порівняння поточного і нового URL
//   if (webhookUrl !== newWebhookUrl) {
//     console.log(
//       `Оновлення вебхука: старий URL: ${webhookUrl}, новий URL: ${newWebhookUrl}`
//     );
//     webhookUrl = newWebhookUrl; // Оновлюємо значення після перевірки

//     try {
//       await bot.setWebHook(webhookUrl);
//       console.log(`Вебхук успішно налаштовано на URL: ${webhookUrl}`);
//     } catch (err) {
//       console.error(`Помилка налаштування вебхука: ${err}`);
//     }
//   } else {
//     console.log(`URL вебхука залишається без змін: ${webhookUrl}`);
//   }
// }

// // Періодична перевірка і оновлення вебхука
// const updateInterval = 1 * 10 * 1000; // Перевірка кожні 10 секунд
// async function checkAndUpdateWebhook() {
//   console.log("Виконуємо перевірку оновлення вебхука");

//   try {
//     const webhookInfo = await bot.getWebHookInfo();
//     console.log(`Поточний URL вебхука з Telegram: ${webhookInfo.url}`);

//     // Якщо вебхук змінений або відсутній, викликаємо оновлення
//     if (webhookInfo.url !== webhookUrl) {
//       console.log(`Старий URL вебхука: ${webhookInfo.url}`);
//       await updateWebhook();
//     } else {
//       console.log(`URL вебхука залишається без змін: ${webhookInfo.url}`);
//     }
//   } catch (err) {
//     console.error(`Помилка перевірки вебхука: ${err}`);
//   }
// }

// // Викликаємо оновлення вебхука під час запуску
// (async () => {
//   await updateWebhook();
//   setInterval(checkAndUpdateWebhook, updateInterval); // Періодична перевірка
// })();

// // Маршрут для обробки вебхуків
// app.post(`/bot${token}`, (req, res) => {
//   const msg = req.body.message || req.body.channel_post;

//   if (msg) {
//     const chatId = String(msg.chat.id);
//     const text = msg.text;
//     const forwardFromChatId = msg.forward_from_chat
//       ? String(msg.forward_from_chat.id)
//       : null;

//     console.log(`Отримано повідомлення: ${JSON.stringify(msg)}`);

//     if (
//       (forwardFromChatId && forwardFromChatId === monitoredChannelId) ||
//       chatId === monitoredChannelId
//     ) {
//       console.log(`Отримано повідомлення з монітореного каналу: ${text}`);

//       if (text && text.toUpperCase().includes("УВАГА")) {
//         console.log("Попередження з УВАГОЮ знайдено!");

//         bot
//           .sendMessage(
//             alertChannelId,
//             `‼️ <b>Термінове попередження:</b> ${text}`,
//             { parse_mode: "HTML" } // Використання HTML для форматування
//           )
//           .catch((err) =>
//             console.error(`Помилка при відправці повідомлення: ${err}`)
//           );
//       } else {
//         console.log(`Повідомлення не містить попередження: ${text}`);
//       }
//     } else {
//       console.log(`Отримано повідомлення з іншого джерела: ${text}`);
//     }
//   }

//   res.sendStatus(200);
// });

// // Запуск сервера
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Сервер працює на порту ${PORT}`);
// });

/**************** 22 - беремо інфу з ТГ-каналу */

// require("dotenv").config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const axios = require("axios"); // Для HTTP запитів
// const TelegramBot = require("node-telegram-bot-api");

// const token = process.env.TELEGRAM_BOT_TOKEN;
// const monitoredChannelId = String(process.env.MONITORED_CHANNEL_ID); // ID вашого InfoMonitoredChannel
// const alertChannelId = String(process.env.ALERT_CHANNEL_ID); // ID вашого InfoStreamAlerts
// const sourceChannelUsername = "@alarmukraine"; // Username каналу, з якого потрібно отримувати інформацію

// const bot = new TelegramBot(token);

// const app = express();
// app.use(bodyParser.json());

// let webhookUrl = ""; // Це буде поточний URL вебхука

// // Функція для отримання поточного URL Ngrok
// async function getNgrokUrl() {
//   try {
//     const res = await axios.get("http://127.0.0.1:4040/api/tunnels");
//     const tunnels = res.data.tunnels;
//     const httpsTunnel = tunnels.find((tunnel) => tunnel.proto === "https");
//     return httpsTunnel ? httpsTunnel.public_url : null;
//   } catch (err) {
//     console.error("Помилка отримання Ngrok URL:", err);
//     return null;
//   }
// }

// // Оновлення вебхука
// async function updateWebhook() {
//   const ngrokUrl = await getNgrokUrl();
//   if (!ngrokUrl) {
//     console.error("Не вдалося отримати URL Ngrok.");
//     return;
//   }

//   const newWebhookUrl = `${ngrokUrl}/bot${token}`;

//   // Порівняння поточного і нового URL
//   if (webhookUrl !== newWebhookUrl) {
//     console.log(
//       `Оновлення вебхука: старий URL: ${webhookUrl}, новий URL: ${newWebhookUrl}`
//     );
//     webhookUrl = newWebhookUrl; // Оновлюємо значення після перевірки

//     try {
//       await bot.setWebHook(webhookUrl);
//       console.log(`Вебхук успішно налаштовано на URL: ${webhookUrl}`);
//     } catch (err) {
//       console.error(`Помилка налаштування вебхука: ${err}`);
//     }
//   } else {
//     console.log(`URL вебхука залишається без змін: ${webhookUrl}`);
//   }
// }

// // Періодична перевірка і оновлення вебхука
// const updateInterval = 1 * 10 * 1000; // Перевірка кожні 10 секунд
// async function checkAndUpdateWebhook() {
//   console.log("Виконуємо перевірку оновлення вебхука");

//   try {
//     const webhookInfo = await bot.getWebHookInfo();
//     console.log(`Поточний URL вебхука з Telegram: ${webhookInfo.url}`);

//     // Якщо вебхук змінений або відсутній, викликаємо оновлення
//     if (webhookInfo.url !== webhookUrl) {
//       console.log(`Старий URL вебхука: ${webhookInfo.url}`);
//       await updateWebhook();
//     } else {
//       console.log(`URL вебхука залишається без змін: ${webhookInfo.url}`);
//     }
//   } catch (err) {
//     console.error(`Помилка перевірки вебхука: ${err}`);
//   }
// }

// // Викликаємо оновлення вебхука під час запуску
// (async () => {
//   await updateWebhook();
//   setInterval(checkAndUpdateWebhook, updateInterval); // Періодична перевірка
// })();

// // Тестовий маршрут для відправки повідомлення в моніторинговий канал
// app.get("/sendTest", (req, res) => {
//   const testMessage = "Тестове повідомлення для InfoMonitoredChannel";
//   bot
//     .sendMessage(monitoredChannelId, testMessage)
//     .then(() => {
//       console.log("Тестове повідомлення успішно відправлено!");
//       res.status(200).send("Повідомлення відправлено!");
//     })
//     .catch((err) => {
//       console.error(`Помилка при відправці повідомлення: ${err}`);
//       res.status(500).send("Помилка при відправці повідомлення.");
//     });
// });

// // Маршрут для обробки вебхуків
// app.post(`/bot${token}`, (req, res) => {
//   const msg = req.body.message || req.body.channel_post;

//   if (msg) {
//     console.log(`1.1 Отримано повідомлення: ${JSON.stringify(msg.chat)}`);     // dodano
//     const chatId = String(msg.chat.id);
//     const text = msg.text;
//     const forwardFromChatId = msg.forward_from_chat
//       ? String(msg.forward_from_chat.id)
//       : null;
//     const chatUsername = msg.chat && msg.chat.username;

//     console.log(`Отримано повідомлення: ${JSON.stringify(msg)}`);

//     // Перевірка, чи отримано повідомлення з каналу Alarm Ukraine
//     if (chatUsername === sourceChannelUsername) {
//       console.log(`Отримано повідомлення з каналу Alarm Ukraine: ${text}`);

//       // Пересилаємо повідомлення до InfoMonitoredChannel без перевірки
//       bot
//         .sendMessage(monitoredChannelId, text)
//         .then(() =>
//           console.log(
//             "Повідомлення успішно відправлено до InfoMonitoredChannel"
//           )
//         )
//         .catch((err) =>
//           console.error(`Помилка при відправленні повідомлення: ${err}`)
//         );
//     } else {
//       console.log(`Отримано повідомлення з іншого джерела: ${text}`);
//     }
//   }

//   res.sendStatus(200);
// });

// // Запуск сервера
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Сервер працює на порту ${PORT}`);
// });

/******************** тепер через -   API */

// require("dotenv").config();
// const axios = require("axios");
// const TelegramBot = require("node-telegram-bot-api");
// const express = require("express");

// // Ініціалізуємо бота
// const token = process.env.TELEGRAM_BOT_TOKEN;
// const alertChannelId = String(process.env.ALERT_CHANNEL_ID);
// const bot = new TelegramBot(token);

// // Ініціалізуємо сервер
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Функція для отримання сповіщень через API
// async function getThreatAlerts() {
//   try {
//     const res = await axios.get("https://api.ukrainealarm.com/api/v3/alerts", {
//       headers: {
//         accept: "application/json",
//         Authorization: process.env.ALARM_API_KEY,
//       },
//     });

//     const alerts = res.data;

//     // Обробка та перевірка загроз
//     alerts.forEach(async (alert) => {
//       if (alert.activeAlerts && alert.activeAlerts.length > 0) {
//         const regionName = alert.regionName;
//         const threatTypes = alert.activeAlerts.map((a) => a.type).join(", ");

//         if (regionName === "Полтавська область") {
//           try {
//             // Відправляємо попередження у канал з затримкою
//             await sendMessageWithRetry(
//               alertChannelId,
//               `‼️ <b>Загроза в регіоні:</b> ${regionName}\nТип загрози: ${threatTypes}`
//             );
//           } catch (err) {
//             console.error(`Помилка при відправці повідомлення: ${err}`);
//           }
//         } else {
//           // Виводимо сповіщення в консоль
//           console.log(
//             `Загроза в регіоні: ${regionName}\nТип загрози: ${threatTypes}`
//           );
//         }
//       }
//     });
//   } catch (error) {
//     console.error(`Помилка при отриманні даних з API: ${error}`);
//   }
// }

// // Функція для відправлення повідомлень з повторною спробою
// async function sendMessageWithRetry(chatId, text, retries = 5) {
//   while (retries > 0) {
//     try {
//       await bot.sendMessage(chatId, text, { parse_mode: "HTML" });
//       console.log("Повідомлення успішно відправлено");
//       break; // Виходимо з циклу, якщо повідомлення відправлене
//     } catch (err) {
//       console.error(`Помилка при відправці повідомлення: ${err}`);
//       if (err.response && err.response.data && err.response.data.parameters) {
//         const retryAfter = err.response.data.parameters.retry_after || 5;
//         console.log(`Повторна спроба через ${retryAfter} секунд`);
//         await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000)); // Затримка перед повторною спробою
//       } else {
//         retries--;
//         if (retries > 0) {
//           console.log(`Повторна спроба... (${retries} залишилося)`);
//           await new Promise((resolve) => setTimeout(resolve, 5000)); // Затримка перед повторною спробою
//         } else {
//           console.error(
//             "Не вдалося відправити повідомлення після кількох спроб"
//           );
//         }
//       }
//     }
//   }
// }

// // Запускаємо перевірку кожні 60 секунд
// setInterval(getThreatAlerts, 60 * 1000);

// // Запуск сервера
// app.listen(PORT, () => {
//   console.log(`Сервер працює на порту ${PORT}`);
// });

/*****************  from API - по полтавській і районам */

// require("dotenv").config();
// const axios = require("axios");
// const TelegramBot = require("node-telegram-bot-api");
// const express = require("express");

// // Ініціалізуємо бота
// const token = process.env.TELEGRAM_BOT_TOKEN;
// const alertChannelId = String(process.env.ALERT_CHANNEL_ID);
// const bot = new TelegramBot(token);

// // Ініціалізуємо сервер
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Зберігаємо стан тривоги
// let activeAlerts = {}; // зберігаємо для кожного регіону інформацію про останню тривогу

// // Функція для отримання сповіщень через API
// async function getThreatAlerts() {
//   try {
//     const res = await axios.get("https://api.ukrainealarm.com/api/v3/alerts", {
//       headers: {
//         accept: "application/json",
//         Authorization: process.env.ALARM_API_KEY,
//       },
//     });

//     const alerts = res.data;

//     // Обробка та перевірка загроз
//     for (const alert of alerts) {
//       if (alert.activeAlerts && alert.activeAlerts.length > 0) {
//         const regionName = alert.regionName;

//         // Перевіряємо, чи це Полтавська область
//         if (regionName === "Полтавська область") {
//           const alertKey = `${regionName}-${alert.regionId}`;

//           // Перевіряємо чи тривога вже активна
//           if (!activeAlerts[alertKey]) {
//             // Відправляємо сповіщення про нову тривогу
//             activeAlerts[alertKey] = { time: Date.now(), isActive: true };
//             const threatTypes = alert.activeAlerts
//               .map((a) => a.type)
//               .join(", ");
//             await sendMessageWithRetry(
//               alertChannelId,
//               `‼️ <b>Загроза в регіоні:</b> ${regionName}\nТип загрози: ${threatTypes}`
//             );
//           } else {
//             // Оновлюємо час останнього отримання тривоги
//             activeAlerts[alertKey].time = Date.now();
//           }
//         } else {
//           // Виводимо сповіщення в консоль для інших областей
//           console.log(`Загроза в регіоні: ${regionName}`);
//           alert.activeAlerts.forEach((alertItem) => {
//             console.log(`Тип загрози: ${alertItem.type}`);
//           });
//         }
//       }
//     }

//     // Перевіряємо, чи тривога триває довше 5 хвилин
//     checkForEndOfAlerts();
//   } catch (error) {
//     console.error(`Помилка при отриманні даних з API: ${error}`);
//   }
// }

// // Функція для перевірки завершення тривоги
// function checkForEndOfAlerts() {
//   const now = Date.now();
//   const fiveMinutes = 5 * 60 * 1000; // 5 хвилин у мілісекундах

//   for (const alertKey in activeAlerts) {
//     if (
//       activeAlerts[alertKey].isActive &&
//       now - activeAlerts[alertKey].time > fiveMinutes
//     ) {
//       // Відправляємо повідомлення про відбій тривоги
//       const [regionName] = alertKey.split("-");
//       sendMessageWithRetry(
//         alertChannelId,
//         `✅ <b>Відбій тривоги в регіоні:</b> ${regionName}`
//       );

//       // Очищуємо тривогу
//       delete activeAlerts[alertKey];
//     }
//   }
// }

// // Функція для відправлення повідомлень з повторною спробою
// async function sendMessageWithRetry(chatId, text, retries = 5) {
//   while (retries > 0) {
//     try {
//       await bot.sendMessage(chatId, text, { parse_mode: "HTML" });
//       console.log("Повідомлення успішно відправлено");
//       break; // Виходимо з циклу, якщо повідомлення відправлене
//     } catch (err) {
//       console.error(`Помилка при відправці повідомлення: ${err}`);
//       if (err.response && err.response.data && err.response.data.parameters) {
//         const retryAfter = err.response.data.parameters.retry_after || 5;
//         console.log(`Повторна спроба через ${retryAfter} секунд`);
//         await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000)); // Затримка перед повторною спробою
//       } else {
//         retries--;
//         if (retries > 0) {
//           console.log(`Повторна спроба... (${retries} залишилося)`);
//           await new Promise((resolve) => setTimeout(resolve, 5000)); // Затримка перед повторною спробою
//         } else {
//           console.error(
//             "Не вдалося відправити повідомлення після кількох спроб"
//           );
//         }
//       }
//     }
//   }
// }

// // Запускаємо перевірку кожні 60 секунд
// setInterval(getThreatAlerts, 60 * 1000);

// // Запуск сервера
// app.listen(PORT, () => {
//   console.log(`Сервер працює на порту ${PORT}`);
// });

/************************ + time */

// require("dotenv").config();
// const axios = require("axios");
// const TelegramBot = require("node-telegram-bot-api");
// const express = require("express");

// // Ініціалізуємо бота
// const token = process.env.TELEGRAM_BOT_TOKEN;
// const alertChannelId = String(process.env.ALERT_CHANNEL_ID);
// const bot = new TelegramBot(token);

// // Ініціалізуємо сервер
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Стан тривоги для регіонів
// let activeAlerts = {};

// // Функція для отримання сповіщень через API
// async function getThreatAlerts() {
//   try {
//     const res = await axios.get("https://api.ukrainealarm.com/api/v3/alerts", {
//       headers: {
//         accept: "application/json",
//         Authorization: process.env.ALARM_API_KEY,
//       },
//     });

//     const alerts = res.data;

//     const currentTime = new Date().toLocaleString(); // Поточний час
//     console.log(`Час отримання: ${currentTime}`);
//     console.log("отримуємо повідомлення: ", res);

//     // Обробка та перевірка загроз
//     for (const alert of alerts) {
//       if (alert.activeAlerts && alert.activeAlerts.length > 0) {
//         const regionName = alert.regionName;
//         const regionId = alert.regionId;
//         const alertKey = `${regionName}-${regionId}`;
//         const threatTypes = alert.activeAlerts.map((a) => a.type).join(", ");
//         const currentTime = new Date().toLocaleString(); // Поточний час

//         // Перевіряємо, чи це Полтавська область
//         if (regionName === "Полтавська область") {
//           // Якщо немає активної тривоги або минуло більше 66 секунд від останнього повідомлення
//           if (
//             !activeAlerts[alertKey] ||
//             Date.now() - activeAlerts[alertKey].time > 1.1 * 60 * 1000
//           ) {
//             // Оновлюємо час і стан
//             activeAlerts[alertKey] = { time: Date.now(), isActive: true };

//             // Виводимо інформацію в консоль тільки один раз при початку тривоги
//             console.log(`⚠️ Загроза в Полтавській області`);
//             console.log(`Тип загрози: ${threatTypes}`);
//             console.log(`Час отримання: ${currentTime}`);
//             console.log("===========================");

//             // Відправляємо повідомлення в канал
//             await sendMessageWithRetry(
//               alertChannelId,
//               `‼️ <b>Загроза в Полтавській області</b>\nТип загрози: ${threatTypes}`
//             );
//           } else {
//             // Оновлюємо час останнього сповіщення про загрозу
//             activeAlerts[alertKey].time = Date.now();
//           }
//         } else {
//           // Обробляємо інші регіони (тільки при першій тривозі)
//           if (
//             !activeAlerts[alertKey] ||
//             Date.now() - activeAlerts[alertKey].time > 1.1 * 60 * 1000
//           ) {
//             console.log(`Загроза в регіоні: ${regionName}`);
//             alert.activeAlerts.forEach((alertItem) => {
//               console.log(`Тип загрози: ${alertItem.type}`);
//               console.log(`Час отримання: ${new Date().toLocaleString()}`);
//             });
//             console.log("===========================");

//             // Оновлюємо час для інших регіонів
//             activeAlerts[alertKey] = { time: Date.now(), isActive: true };
//           } else {
//             activeAlerts[alertKey].time = Date.now();
//           }
//         }
//       }
//     }

//     // Перевіряємо завершення тривоги
//     checkForEndOfAlerts();
//   } catch (error) {
//     console.error(`Помилка при отриманні даних з API: ${error}`);
//   }
// }

// // Функція для перевірки завершення тривоги
// function checkForEndOfAlerts() {
//   const now = Date.now();
//   const fiveMinutes = 1.1 * 60 * 1000; // 1.1 хвилину у мілісекундах

//   for (const alertKey in activeAlerts) {
//     if (
//       activeAlerts[alertKey].isActive &&
//       now - activeAlerts[alertKey].time > fiveMinutes
//     ) {
//       // Відправляємо повідомлення про відбій тривоги
//       const [regionName] = alertKey.split("-");
//       sendMessageWithRetry(
//         alertChannelId,
//         `✅ <b>Відбій тривоги в регіоні:</b> ${regionName}`
//       );

//       // Виводимо в консоль інформацію про відбій тільки один раз
//       console.log(`✅ Відбій тривоги в регіоні: ${regionName}`);
//       console.log(`Час: ${new Date().toLocaleString()}`);
//       console.log("===========================");

//       // Видаляємо інформацію про тривогу
//       delete activeAlerts[alertKey];
//     }
//   }
// }

// // Функція для відправлення повідомлень з повторною спробою
// async function sendMessageWithRetry(chatId, text, retries = 5) {
//   while (retries > 0) {
//     try {
//       await bot.sendMessage(chatId, text, { parse_mode: "HTML" });
//       console.log("Повідомлення успішно відправлено");
//       break; // Виходимо з циклу, якщо повідомлення відправлене
//     } catch (err) {
//       console.error(`Помилка при відправці повідомлення: ${err}`);
//       if (err.response && err.response.data && err.response.data.parameters) {
//         const retryAfter = err.response.data.parameters.retry_after || 5;
//         console.log(`Повторна спроба через ${retryAfter} секунд`);
//         await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000)); // Затримка перед повторною спробою
//       } else {
//         retries--;
//         if (retries > 0) {
//           console.log(`Повторна спроба... (${retries} залишилося)`);
//           await new Promise((resolve) => setTimeout(resolve, 5000)); // Затримка перед повторною спробою
//         } else {
//           console.error(
//             "Не вдалося відправити повідомлення після кількох спроб"
//           );
//         }
//       }
//     }
//   }
// }

// // Запускаємо перевірку кожні 60 секунд
// setInterval(getThreatAlerts, 60 * 1000);

// // Запуск сервера
// app.listen(PORT, () => {
//   console.log(`Сервер працює на порту ${PORT}`);
// });

/***************  див Readme - п1-6     */

// require("dotenv").config();
// const axios = require("axios");
// const TelegramBot = require("node-telegram-bot-api");
// const express = require("express");

// // Ініціалізуємо бота
// const token = process.env.TELEGRAM_BOT_TOKEN;
// const alertChannelId = String(process.env.ALERT_CHANNEL_ID);
// const bot = new TelegramBot(token);

// // Ініціалізуємо сервер
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Стан тривоги для регіонів
// let activeAlerts = {};

// // Функція для отримання сповіщень через API
// async function getThreatAlerts() {
//   try {
//     const res = await axios.get("https://api.ukrainealarm.com/api/v3/alerts", {
//       headers: {
//         accept: "application/json",
//         Authorization: process.env.ALARM_API_KEY,
//       },
//     });

//     const alerts = res.data;

//     const currentTime = new Date().toLocaleString(); // Поточний час
//     console.log(`Час отримання: ${currentTime}`);
//     console.log("отримуємо повідомлення: ", alerts);

//     // Очищення тривог для регіонів, які більше не активні
//     const activeRegionIds = alerts.map((alert) => alert.regionId);
//     for (const alertKey in activeAlerts) {
//       const [regionName, regionId] = alertKey.split("-");
//       if (!activeRegionIds.includes(Number(regionId))) {
//         // Відправляємо відбій тривоги і видаляємо з активних
//         sendMessageWithRetry(
//           alertChannelId,
//           `✅ <b>Відбій тривоги в регіоні:</b> ${regionName}`
//         );
//         console.log(`✅ Відбій тривоги в регіоні: ${regionName}`);
//         delete activeAlerts[alertKey]; // Видаляємо з активних
//       }
//     }

//     for (const alert of alerts) {
//       if (alert.activeAlerts && alert.activeAlerts.length > 0) {
//         const regionName = alert.regionName;
//         const regionId = alert.regionId;
//         const alertKey = `${regionName}-${regionId}`;
//         const threatTypes = alert.activeAlerts.map((a) => a.type).join(", ");
//         const currentTime = new Date().toLocaleString(); // Поточний час

//         // Перевіряємо, чи це Полтавська область
//         if (regionName === "Полтавська область") {
//           // Перевіряємо, чи є активна тривога або нова тривога
//           if (!activeAlerts[alertKey]) {
//             // Якщо нова тривога - зберігаємо час
//             activeAlerts[alertKey] = { startTime: Date.now(), isActive: true };

//             console.log(`⚠️ Загроза в Полтавській області`);
//             console.log(`Тип загрози: ${threatTypes}`);
//             console.log(`Час отримання: ${currentTime}`);
//             console.log("===========================");

//             // Відправляємо повідомлення в Telegram
//             await sendMessageWithRetry(
//               alertChannelId,
//               `‼️ <b>Загроза в Полтавській області</b>\nТип загрози: ${threatTypes}`
//             );
//           } else {
//             // Оновлюємо час останнього сповіщення, але не виводимо повторно
//             activeAlerts[alertKey].startTime = Date.now();
//           }
//         } else {
//           // Для інших регіонів - обробляємо тільки один раз на початку тривоги
//           if (!activeAlerts[alertKey]) {
//             console.log(`Загроза в регіоні: ${regionName}`);
//             alert.activeAlerts.forEach((alertItem) => {
//               console.log(`Тип загрози: ${alertItem.type}`);
//               console.log(`Час отримання: ${new Date().toLocaleString()}`);
//             });
//             console.log("===========================");

//             // Оновлюємо стан тривоги
//             activeAlerts[alertKey] = { startTime: Date.now(), isActive: true };
//           }
//         }
//       }
//     }

//     // Перевіряємо завершення тривоги
//     checkForEndOfAlerts();
//   } catch (error) {
//     console.error(`Помилка при отриманні даних з API: ${error}`);
//   }
// }

// // Функція для перевірки завершення тривоги
// function checkForEndOfAlerts() {
//   const now = Date.now();
//   const timeLimit = 1.1 * 60 * 1000; // 66 секунд у мілісекундах

//   for (const alertKey in activeAlerts) {
//     if (
//       activeAlerts[alertKey].isActive &&
//       now - activeAlerts[alertKey].startTime > timeLimit
//     ) {
//       // Відправляємо повідомлення про відбій тривоги
//       const [regionName] = alertKey.split("-");
//       sendMessageWithRetry(
//         alertChannelId,
//         `✅ <b>Відбій тривоги в регіоні:</b> ${regionName}`
//       );

//       console.log(`✅ Відбій тривоги в регіоні: ${regionName}`);
//       console.log(`Час: ${new Date().toLocaleString()}`);
//       console.log("===========================");

//       // Видаляємо інформацію про тривогу
//       delete activeAlerts[alertKey];
//     }
//   }
// }

// // Функція для відправлення повідомлень з повторною спробою
// async function sendMessageWithRetry(chatId, text, retries = 5) {
//   while (retries > 0) {
//     try {
//       await bot.sendMessage(chatId, text, { parse_mode: "HTML" });
//       console.log("Повідомлення успішно відправлено");
//       break; // Виходимо з циклу, якщо повідомлення відправлене
//     } catch (err) {
//       console.error(`Помилка при відправці повідомлення: ${err}`);
//       if (err.response && err.response.data && err.response.data.parameters) {
//         const retryAfter = err.response.data.parameters.retry_after || 5;
//         console.log(`Повторна спроба через ${retryAfter} секунд`);
//         await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000)); // Затримка перед повторною спробою
//       } else {
//         retries--;
//         if (retries > 0) {
//           console.log(`Повторна спроба... (${retries} залишилося)`);
//           await new Promise((resolve) => setTimeout(resolve, 5000)); // Затримка перед повторною спробою
//         } else {
//           console.error(
//             "Не вдалося відправити повідомлення після кількох спроб"
//           );
//         }
//       }
//     }
//   }
// }

// // Запускаємо перевірку кожні 60 секунд
// setInterval(getThreatAlerts, 60 * 1000);

// // Запуск сервера
// app.listen(PORT, () => {
//   console.log(`Сервер працює на порту ${PORT}`);
// });

/**********************    наступний варіант */

require("dotenv").config();
const axios = require("axios"); // Додаємо axios
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const alertChannelId = process.env.ALERT_CHANNEL_ID; // ID каналу для сповіщень

// Оновлена структура зберігання стану тривог
let activeAlerts = {};

// Функція для отримання сповіщень через API
async function getThreatAlerts() {
  try {
    const res = await axios.get("https://api.ukrainealarm.com/api/v3/alerts", {
      headers: {
        accept: "application/json",
        Authorization: process.env.ALARM_API_KEY,
      },
    });

    const alerts = res.data;
    const currentTime = new Date().toLocaleString();
    // alerts.forEach((alert) => {
    //   console.log(
    //     "отримуємо повідомлення: ",
    //     alert.regionName, // Назва регіону
    //     alert.lastUpdate // Останнє оновлення
    //   );
    // });

    for (const alert of alerts) {
      const regionName = alert.regionName;
      const regionId = alert.regionId;
      const alertKey = `${regionName}-${regionId}`;
      const lastUpdate = alert.lastUpdate;
      const threatTypes = alert.activeAlerts
        ? alert.activeAlerts.map((a) => a.type).join(", ")
        : null;

      // Перевірка на тривогу
      if (alert.activeAlerts && alert.activeAlerts.length > 0) {
        // Якщо немає запису про тривогу або оновлення змінилось
        if (
          !activeAlerts[alertKey] ||
          activeAlerts[alertKey].lastUpdate !== lastUpdate
        ) {
          activeAlerts[alertKey] = {
            startTime: Date.now(),
            isActive: true,
            lastUpdate: lastUpdate,
          };

          console.log(`⚠️ Загроза в регіоні: ${regionName}`);
          console.log(`Тип загрози: ${threatTypes}`);
          console.log(`Час отримання: ${currentTime}`);
          console.log("===========================");

          // Відправляємо повідомлення про загрозу
          await sendMessageWithRetry(
            alertChannelId,
            `‼️ <b>Загроза в регіоні:</b> ${regionName}\nТип загрози: ${threatTypes}`
          );
        }
      } else if (activeAlerts[alertKey]) {
        // Якщо тривога вже завершилась (немає активних сповіщень)
        if (activeAlerts[alertKey].isActive) {
          console.log(`✅ Відбій тривоги в регіоні: ${regionName}`);
          console.log(`Час: ${new Date().toLocaleString()}`);
          console.log("===========================");

          await sendMessageWithRetry(
            alertChannelId,
            `✅ <b>Відбій тривоги в регіоні:</b> ${regionName}`
          );

          // Оновлюємо стан тривоги як неактивний
          activeAlerts[alertKey].isActive = false;
        }
      }
    }
  } catch (error) {
    console.error(`Помилка при отриманні даних з API: ${error}`);
  }
}

// Функція для відправлення повідомлень з повторною спробою
async function sendMessageWithRetry(chatId, text, retries = 5) {
  while (retries > 0) {
    try {
      await bot.sendMessage(chatId, text, { parse_mode: "HTML" });
      console.log("Повідомлення успішно відправлено");
      break;
    } catch (err) {
      console.error(`Помилка при відправці повідомлення: ${err}`);
      retries--;
      if (retries > 0) {
        console.log(`Повторна спроба... (${retries} залишилося)`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        console.error("Не вдалося відправити повідомлення після кількох спроб");
      }
    }
  }
}

// Запускаємо перевірку кожні 60 секунд
setInterval(getThreatAlerts, 60 * 1000);

// Запуск сервера
app.get("/", (req, res) => {
  res.send("Сервер бота працює!");
});

app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});