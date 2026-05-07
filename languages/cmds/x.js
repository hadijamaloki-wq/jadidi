module.exports = {
  config: {
    name: "x",
    version: "2.0.0",
    author: "Amine (Alen)",
    countDown: 2,
    role: 2, // للمطور (Bot Admin) فقط 💍
    shortDescription: { en: "حماية اسم الجروب (لآدمن البوت)" },
    category: "حماية",
    guide: { en: ".x on | .x off" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID } = event;

    if (args[0] === "on") {
      const info = await api.getThreadInfo(threadID);
      global.GoatBot.x_protect = global.GoatBot.x_protect || {};
      global.GoatBot.x_protect[threadID] = {
        name: info.threadName
      };
      return message.reply("💍 تم تفعيل حماية الاسم (مسموح فقط لآدمن البوت بالتغيير)");
    }

    if (args[0] === "off") {
      if (global.GoatBot.x_protect) delete global.GoatBot.x_protect[threadID];
      return message.reply("💍 تم إيقاف الحماية");
    }
  },

  onEvent: async function ({ api, event }) {
    const { threadID, logMessageType, logMessageData, author } = event;
    const protect = global.GoatBot.x_protect && global.GoatBot.x_protect[threadID];

    if (!protect) return;

    if (logMessageType === "log:thread-name") {
      const isBotAdmin = global.config.adminBot.includes(author);

      if (isBotAdmin) {
        // إذا آدمن البوت غير الاسم، نحدث الاسم المحمي
        global.GoatBot.x_protect[threadID].name = logMessageData.name;
      } else {
        // إذا أي شخص آخر (حتى لو أدمن جروب) غير الاسم، نرجعه
        api.setTitle(protect.name, threadID);
      }
    }
  }
};
