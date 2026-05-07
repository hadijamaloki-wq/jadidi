module.exports = {
  config: {
    name: "v",
    version: "4.0.0",
    author: "Amine (Alen)",
    countDown: 0,
    role: 2,
    shortDescription: { en: "قفل الكنيات الصارم والمسرع" },
    category: "حماية"
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID } = event;
    const action = args[0];

    if (action === "vv") {
      if (args[1] === "on") {
        const nick = args.slice(2).join(" ");
        if (!nick) return message.reply("💍 دخل الكنية المطلوبة");
        global.GoatBot.vv_lock = global.GoatBot.vv_lock || {};
        global.GoatBot.vv_lock[threadID] = nick;
        
        const info = await api.getThreadInfo(threadID);
        for (let id of info.participantIDs) {
          api.changeNickname(nick, threadID, id);
        }
        return message.reply(`💍 تم قفل الكنيات على: ${nick}`);
      }
      if (args[1] === "off") {
        delete global.GoatBot.vv_lock[threadID];
        return message.reply("💍 تم إلغاء قفل الكنيات");
      }
    }
  },

  onEvent: async function ({ api, event }) {
    const { threadID, logMessageType, logMessageData, author } = event;
    if (logMessageType !== "log:nickname") return;

    const lockedNick = global.GoatBot.vv_lock && global.GoatBot.vv_lock[threadID];
    if (!lockedNick) return;

    const isBotAdmin = (global.config.adminBot || []).includes(author);
    
    // إذا كان المغير ليس آدمن البوت، يتم الإرجاع فوراً
    if (!isBotAdmin) {
      api.changeNickname(lockedNick, threadID, logMessageData.participant_id);
    }
  }
};
