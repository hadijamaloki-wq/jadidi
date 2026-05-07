module.exports = {
  config: {
    name: "antiout",
    version: "1.0.0",
    author: "خبير البرمجة"
  },

  onStart: async function ({ api, event }) {
    if (event.logMessageType === "log:unsubscribe") {
      const { leftParticipantFbId, threadID } = event.logMessageData;
      
      // إذا كان البوت هو من غادر، لا تفعل شيئاً
      if (leftParticipantFbId == api.getCurrentUserID()) return;

      api.sendMessage("🚫 لا أحد يغادر هنا! سأعيدك رغماً عنك.", threadID);
      
      api.addUserToGroup(leftParticipantFbId, threadID, (err) => {
        if (err) api.sendMessage("❌ لم أستطع إعادته، قد يكون أغلق حسابه أو حظر البوت.", threadID);
      });
    }
  }
};
