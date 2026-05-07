const axios = require("axios");

module.exports = {
  config: {
    name: "x",
    version: "2.0.1",
    author: "Amine (Alen) & Modified",
    countDown: 2,
    role: 2, // للمطور (Bot Admin) فقط 💍
    shortDescription: { en: "حماية شاملة لاسم وصورة الجروب" },
    category: "حماية",
    guide: { en: ".x on | .x off" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID } = event;

    if (args[0] === "on") {
      const info = await api.getThreadInfo(threadID);
      global.GoatBot.x_protect = global.GoatBot.x_protect || {};
      
      // حفظ الاسم والصورة الحالية
      global.GoatBot.x_protect[threadID] = {
        name: info.threadName,
        imageSrc: info.imageSrc 
      };
      return message.reply("💍 تم تفعيل حماية الجروب الشاملة (الاسم + الصورة). فقط المطور يمكنه التغيير.");
    }

    if (args[0] === "off") {
      if (global.GoatBot.x_protect) delete global.GoatBot.x_protect[threadID];
      return message.reply("💍 تم إيقاف الحماية الشاملة.");
    }
  },

  onEvent: async function ({ api, event }) {
    const { threadID, logMessageType, logMessageData, author } = event;
    const protect = global.GoatBot.x_protect && global.GoatBot.x_protect[threadID];

    if (!protect) return;

    const botID = api.getCurrentUserID();
    if (author === botID) return; // منع البوت من الرد على نفسه

    const isBotAdmin = global.config.adminBot.includes(author);

    // 1. حماية اسم الجروب
    if (logMessageType === "log:thread-name") {
      if (isBotAdmin) {
        // لو المطور غير الاسم، نحدث الاسم المحمي
        protect.name = logMessageData.name;
      } else {
        // لو أي شخص آخر، نرجعه
        api.setTitle(protect.name, threadID);
      }
    }

    // 2. حماية صورة الجروب
    if (logMessageType === "log:thread-icon") {
      if (isBotAdmin) {
        // لو المطور غير الصورة، نحفظ الصورة الجديدة
        const info = await api.getThreadInfo(threadID);
        protect.imageSrc = info.imageSrc;
      } else {
        // لو أي شخص تاني، نرجع الصورة القديمة اللي حفظناها
        if (protect.imageSrc) {
          try {
            const response = await axios({
              url: protect.imageSrc,
              method: "GET",
              responseType: "stream"
            });
            api.changeGroupImage(response.data, threadID);
          } catch (error) {
            console.error("حدث خطأ أثناء استرجاع صورة الجروب", error);
          }
        }
      }
    }
  }
};
