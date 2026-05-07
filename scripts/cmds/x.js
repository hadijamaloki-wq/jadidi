module.exports = {
  config: {
    name: "x",
    version: "4.0.0",
    author: "Amine (Alen)",
    countDown: 0, // إلغاء الانتظار للسرعة
    role: 2,
    shortDescription: { en: "حماية اسم المجموعة فائقة السرعة" },
    category: "حماية"
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID } = event;
    if (args[0] === "on") {
      const info = await api.getThreadInfo(threadID);
      global.GoatBot.x_protect = global.GoatBot.x_protect || {};
      global.GoatBot.x_protect[threadID] = info.threadName;
      return message.reply("💍 تم تفعيل درع حماية الاسم المسرع");
    }
    if (args[0] === "off") {
      delete global.GoatBot.x_protect[threadID];
      return message.reply("💍 تم إيقاف الحماية");
    }
  },

  onEvent: async function ({ api, event }) {
    const { threadID, logMessageType, author, logMessageData } = event;
    if (logMessageType !== "log:thread-name") return;

    const protectName = global.GoatBot.x_protect && global.GoatBot.x_protect[threadID];
    if (!protectName) return;

    const isBotAdmin = (global.config.adminBot || []).includes(author);
    
    if (isBotAdmin) {
      global.GoatBot.x_protect[threadID] = logMessageData.name;
    } else {
      // إرجاع الاسم فوراً بدون أي تأخير
      api.setTitle(protectName, threadID);
    }
  }
};
