module.exports = {
  config: {
    name: "v",
    version: "2.0.1",
    author: "Amine (Alen) & Modified",
    countDown: 2,
    role: 2, // للمطور (Bot Admin) فقط 💍
    shortDescription: { en: "التحكم السريع في الكنيات (لآدمن البوت)" },
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
        
        // مسح قفل الـ cc عشان ما يحصلش تعارض
        if (global.GoatBot.cc_lock) delete global.GoatBot.cc_lock[threadID];
        
        const info = await api.getThreadInfo(threadID);
        message.reply("⏳ جاري توحيد الكنيات بسرعة...");
        
        // استخدام Promise.all لتغيير الكنيات في نفس اللحظة (سرعة فائقة)
        const promises = info.participantIDs.map(id => api.changeNickname(nick, threadID, id));
        await Promise.all(promises);
        
        return message.reply(`💍 تم توحيد الكنيات وقفلها: ${nick}`);
      }
      if (args[1] === "off") {
        if (global.GoatBot.vv_lock) delete global.GoatBot.vv_lock[threadID];
        return message.reply("💍 تم إيقاف القفل الموحد");
      }
    }

    // v.cc on (مسح الكنيات)
    if (action === "cc") {
      if (args[1] === "on") {
        global.GoatBot.cc_lock = global.GoatBot.cc_lock || {};
        global.GoatBot.cc_lock[threadID] = true;
        
        // مسح قفل الـ vv عشان ما يحصلش تعارض
        if (global.GoatBot.vv_lock) delete global.GoatBot.vv_lock[threadID];

        const info = await api.getThreadInfo(threadID);
        message.reply("⏳ جاري مسح الكنيات بسرعة...");
        
        const promises = info.participantIDs.map(id => api.changeNickname("", threadID, id));
        await Promise.all(promises);
        
        return message.reply("💍 تم مسح الكنيات وقفلها");
      }
      if (args[1] === "off") {
        if (global.GoatBot.cc_lock) delete global.GoatBot.cc_lock[threadID];
        return message.reply("💍 تم إيقاف قفل المسح");
      }
    }
  },

  onEvent: async function ({ api, event }) {
    const { threadID, logMessageType, logMessageData, author } = event;
    const botID = api.getCurrentUserID();
    
    // عشان البوت ميتفاعلش مع نفسه ويعلق
    if (author === botID) return;

    const isBotAdmin = global.config.adminBot.includes(author);
    if (isBotAdmin) return; // لو المطور هو اللي غير، مفيش مشكلة

    if (logMessageType === "log:nickname") {
      const participantID = logMessageData.participant_id;
      if (global.GoatBot.vv_lock && global.GoatBot.vv_lock[threadID]) {
        api.changeNickname(global.GoatBot.vv_lock[threadID], threadID, participantID);
      } else if (global.GoatBot.cc_lock && global.GoatBot.cc_lock[threadID]) {
        api.changeNickname("", threadID, participantID);
      }
    }
  }
};
