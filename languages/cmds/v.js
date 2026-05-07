const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "v",
    version: "2.5.0",
    author: "Amine (Alen)",
    countDown: 2,
    role: 2, // للمطور فقط
    shortDescription: { en: "التحكم في الكنيات" },
    category: "حماية",
    guide: { en: ".v vv on [الاسم] | .v cc on | .v t [الاسم]" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, senderID } = event;
    const action = args[0];

    if (action === "t") {
      const myNick = args.slice(1).join(" ");
      await api.changeNickname(myNick, threadID, senderID);
      return message.reply("💍 تم تحديث كنيتك");
    }

    if (action === "vv") {
      if (args[1] === "on") {
        const nick = args.slice(2).join(" ");
        if (!nick) return message.reply("💍 اكتب الكنية المطلوبة");
        global.GoatBot.vv_lock = global.GoatBot.vv_lock || {};
        global.GoatBot.vv_lock[threadID] = nick;
        const info = await api.getThreadInfo(threadID);
        for (let id of info.participantIDs) {
          api.changeNickname(nick, threadID, id);
        }
        return message.reply(`💍 تم قفل الكنيات على: ${nick}`);
      }
      if (args[1] === "off") {
        if (global.GoatBot.vv_lock) delete global.GoatBot.vv_lock[threadID];
        return message.reply("💍 تم إيقاف القفل");
      }
    }

    if (action === "cc") {
      if (args[1] === "on") {
        global.GoatBot.cc_lock = global.GoatBot.cc_lock || {};
        global.GoatBot.cc_lock[threadID] = true;
        const info = await api.getThreadInfo(threadID);
        for (let id of info.participantIDs) {
          api.changeNickname("", threadID, id);
        }
        return message.reply("💍 تم مسح الكنيات وقفلها");
      }
      if (args[1] === "off") {
        if (global.GoatBot.cc_lock) delete global.GoatBot.cc_lock[threadID];
        return message.reply("💍 تم إيقاف قفل المسح");
      }
    }
  },

  onEvent: async function ({ api, event }) {
    if (event.logMessageType !== "log:nickname") return;
    const { threadID, logMessageData, author } = event;
    const isBotAdmin = (global.config.adminBot || []).includes(author);

    if (!isBotAdmin) {
      if (global.GoatBot.vv_lock && global.GoatBot.vv_lock[threadID]) {
        api.changeNickname(global.GoatBot.vv_lock[threadID], threadID, logMessageData.participant_id);
      } else if (global.GoatBot.cc_lock && global.GoatBot.cc_lock[threadID]) {
        api.changeNickname("", threadID, logMessageData.participant_id);
      }
    }
  }
};
