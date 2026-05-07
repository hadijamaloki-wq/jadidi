module.exports = {
  config: {
    name: "v",
    version: "2.0.0",
    author: "Amine (Alen)",
    countDown: 2,
    role: 2, // للمطور (Bot Admin) فقط 💍
    shortDescription: { en: "التحكم في الكنيات (لآدمن البوت)" },
    category: "حماية",
    guide: { en: ".v vv on [الاسم] | .v cc on | .v t [الاسم]" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, senderID } = event;
    const action = args[0];

    // v.t (تغيير كنيتك أنت يا مطور)
    if (action === "t") {
      const myNick = args.slice(1).join(" ");
      await api.changeNickname(myNick, threadID, senderID);
      return message.reply("💍 تم تحديث كنيتك يا كينج");
    }

    // v.vv on (توحيد الكنيات)
    if (action === "vv") {
      if (args[1] === "on") {
        const nick = args.slice(2).join(" ");
        if (!nick) return message.reply("💍 اكتب الكنية اللي بغيتي تفرضها");
        
        global.GoatBot.vv_lock = global.GoatBot.vv_lock || {};
        global.GoatBot.vv_lock[threadID] = nick;
        
        const info = await api.getThreadInfo(threadID);
        for (let id of info.participantIDs) {
          api.changeNickname(nick, threadID, id);
        }
        return message.reply(`💍 تم توحيد الكنيات وقفلها: ${nick}`);
      }
      if (args[1] === "off") {
        delete global.GoatBot.vv_lock[threadID];
        return message.reply("💍 تم إيقاف القفل الموحد");
      }
    }

    // v.cc on (مسح الكنيات)
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
        delete global.GoatBot.cc_lock[threadID];
        return message.reply("💍 تم إيقاف قفل المسح");
      }
    }
  },

  onEvent: async function ({ api, event }) {
    const { threadID, logMessageType, logMessageData, author } = event;
    
    // التحقق إذا كان الشخص الذي غير الكنية هو آدمن البوت
    const isBotAdmin = global.config.adminBot.includes(author);

    if (logMessageType === "log:nickname" && !isBotAdmin) {
      if (global.GoatBot.vv_lock && global.GoatBot.vv_lock[threadID]) {
        api.changeNickname(global.GoatBot.vv_lock[threadID], threadID, logMessageData.participant_id);
      } else if (global.GoatBot.cc_lock && global.GoatBot.cc_lock[threadID]) {
        api.changeNickname("", threadID, logMessageData.participant_id);
      }
    }
  }
};
