module.exports = {
  config: {
    name: "كنيات",
    version: "1.0.0",
    author: "خبير البرمجة",
    countDown: 5,
    role: 1, // للمسؤولين فقط
    description: "تغيير كنية الجميع",
    category: "القروب",
    guide: "{pn} [الاسم الجديد]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID } = event;
    const customName = args.join(" ");
    if (!customName) return api.sendMessage("❌ اكتب الاسم الذي تريده لجميع الأعضاء", threadID);

    const threadInfo = await api.getThreadInfo(threadID);
    const userIDs = threadInfo.participantIDs;

    api.sendMessage(`⏳ بدأت تغيير كنيات ${userIDs.length} عضو...`, threadID);

    userIDs.forEach((id, index) => {
      setTimeout(() => {
        api.changeNickname(customName, threadID, id);
      }, index * 1500); // فاصل ثانية ونصف لحماية البوت
    });
  }
};
