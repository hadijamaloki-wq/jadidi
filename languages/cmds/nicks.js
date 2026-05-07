module.exports = {
  config: {
    name: "كنيات",
    version: "1.0.0",
    author: "Hadi",
    countDown: 5,
    role: 1,
    description: "تغيير كنية الجميع",
    category: "group",
    guide: "{pn} [الاسم]"
  },

  onStart: async function ({ api, event, args }) {
    const name = args.join(" ");
    if (!name) return api.sendMessage("اكتب الاسم بعد الأمر", event.threadID);

    const threadInfo = await api.getThreadInfo(event.threadID);
    const { participantIDs } = threadInfo;

    api.sendMessage(`جاري تغيير ${participantIDs.length} كنية...`, event.threadID);

    for (const id of participantIDs) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // انتظر ثانية
      api.changeNickname(name, event.threadID, id);
    }
  }
};
