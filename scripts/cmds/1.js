module.exports = {
  config: {
    name: "1", // تغيير اسم الأمر إلى 1
    aliases: ["nam", "renameall"], 
    version: "1.5",
    author: "ShAn & Gemini",
    role: 2,
    shortDescription: "تغيير أو حذف أسماء أعضاء المجموعة لكل الملاك",
    category: "المالك",
    guide: {
      en: "{pn} [الاسم] للتغيير، أو {pn} فقط لحذف الكنيات"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      // جلب قائمة الملاك من إعدادات البوت
      const { owner } = global.GoatBot.config;
      
      // التحقق من أن المرسل هو أحد الملاك وأننا داخل مجموعة
      if (!owner.includes(event.senderID) || !event.isGroup) {
        return;
      }

      const { threadID, participantIDs } = event;
      const newName = args.join(" ").trim();
      const isDeleteMode = !newName;

      // حماية من الأسماء الطويلة جداً
      if (!isDeleteMode && newName.length > 500) {
        return;
      }

      const botID = api.getCurrentUserID();
      
      // التفاعل بالقلب الأسود فوراً عند بدء التنفيذ 🖤
      api.setMessageReaction("🖤", event.messageID, () => {}, true);

      // 1. تغيير كنية البوت أولاً
      try {
        await api.changeNickname(isDeleteMode ? "" : newName, threadID, botID);
      } catch (error) {}

      // 2. تصفية القائمة لتغيير باقي الأعضاء (باستثناء البوت والمرسل)
      const otherMembers = participantIDs.filter(id => 
        id !== event.senderID && id !== botID
      );

      const BATCH_SIZE = 3; 
      const DELAY_BETWEEN_BATCHES = 300; 

      for (let i = 0; i < otherMembers.length; i += BATCH_SIZE) {
        const batch = otherMembers.slice(i, i + BATCH_SIZE);
        
        const batchPromises = batch.map(userId =>
          api.changeNickname(isDeleteMode ? "" : newName, threadID, userId)
            .catch(() => {})
        );
        
        await Promise.all(batchPromises);
        
        if (i + BATCH_SIZE < otherMembers.length) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
      }

    } catch (error) {
      console.error("❌", error);
    }
  }
};

