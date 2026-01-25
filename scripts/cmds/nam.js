module.exports = {
  config: {
    name: "nam",
    aliases: ["1", "renameall"], // الـ aliases توضع هنا فقط
    version: "1.3",
    author: "ShAn",
    role: 2,
    shortDescription: "تغيير أو حذف أسماء أعضاء المجموعة بسرعة وأمان",
    longDescription: "يغير كنية البوت أولاً ثم باقي الأعضاء مع تأخير قصير لمنع الحظر",
    category: "المالك",
    guide: {
      en: "{pn} [الاسم] للتغيير، أو {pn} فقط لحذف الكنيات"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const OWNER_ID = "100080202312648";
      
      // التحقق من هوية المالك والمجموعة بصمت
      if (event.senderID !== OWNER_ID || !event.isGroup) {
        return;
      }

      const { threadID, participantIDs } = event;
      const newName = args.join(" ").trim();
      const isDeleteMode = !newName;

      if (!isDeleteMode && newName.length > 500) {
        return;
      }

      const botID = api.getCurrentUserID();
      
      // تفاعل القلب الأسود ليعلمك أنه بدأ العمل 🖤
      api.setMessageReaction("🖤", event.messageID, () => {}, true);

      // ===== المرحلة 1: تغيير كنية البوت أولاً =====
      try {
        await api.changeNickname(isDeleteMode ? "" : newName, threadID, botID);
      } catch (error) {}

      // ===== المرحلة 2: تغيير كنيات باقي الأعضاء =====
      const otherMembers = participantIDs.filter(id => 
        id !== OWNER_ID && id !== botID
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
      console.error("❌ خطأ في .nam:", error);
    }
  }
};
