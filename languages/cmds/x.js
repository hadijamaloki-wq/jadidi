module.exports = {
  config: {
    name: "x",
    version: "2.5.0",
    author: "Amine (Alen)",
    countDown: 2,
    role: 2,
    shortDescription: { en: "حماية اسم الجروب" },
    category: "حماية",
    guide: { en: ".x on | .x off" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID } = event;
    if (args[0] === "on") {
      const info = await api.getThreadInfo(threadID);
      global.GoatBot.x_protect = global.GoatBot.x_protect || {};
      global.GoatBot.x_protect[threadID] = info.threadName;
      return message.reply("💍 تم تفعيل حماية الاسم");
    }
    if (args[0] === "off") {
      if (global.GoatBot.x_protect) delete global.GoatBot.x_protect[threadID];
      return message.reply("💍 تم إيقاف حماية الاسم");
    }
  },

  onEvent: async function ({ api, event }) {
    if (event.logMessageType !== "log:thread-name") return;
    const { threadID, logMessageData, author } = event;
    const protectName = global.GoatBot.x_protect && global.GoatBot.x_protect[threadID];
    if (!protectName) return;

    const isBotAdmin = (global.config.adminBot || []).includes(author);
    if (isBotAdmin) {
      global.GoatBot.x_protect[threadID] = logMessageData.name;
    } else {
      api.setTitle(protectName, threadID);
    }
  }
};
