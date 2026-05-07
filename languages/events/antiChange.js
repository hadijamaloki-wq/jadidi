module.exports = {
  config: {
    name: "antiChange",
    version: "1.0.0",
    author: "خبير البرمجة",
  },

  onStart: async function ({ api, event }) {
    // هذا الجزء يراقب الأحداث
    if (event.logMessageType == "log:thread-name" || event.logMessageType == "log:thread-icon") {
      const { threadID, logMessageData, author } = event;
      
      // إذا كان البوت هو من قام بالتغيير، لا تفعل شيئاً
      if (author == api.getCurrentUserID()) return;

      api.sendMessage("🛡️ [حماية] عذراً، لا يُسمح بتغيير إعدادات المجموعة!", threadID);

      // هنا يمكنك إضافة منطق لاستعادة الاسم أو الصورة القديمة إذا كان البوت يملك نسخة منها
      // حالياً سيقوم البوت فقط بتنبيه المجموعة ومنع العبث
    }
  }
};
