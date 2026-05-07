module.exports.config = {
    name: "كنيات",
    version: "1.0.0",
    hasPermssion: 1, // 1 تعني مسموح لمسؤولي المجموعة فقط
    credits: "خبير البرمجة",
    description: "تغيير كنيات جميع أعضاء المجموعة",
    commandCategory: "القروب",
    usages: "[الاسم الجديد]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const participants = threadInfo.participantIDs;
    const customName = args.join(" ");

    if (!customName) return api.sendMessage("رجاءً اكتب الكنية الجديدة بعد الأمر. مثال: .كنيات قراصنة", event.threadID);

    api.sendMessage(`⏳ بدأ تغيير كنيات ${participants.length} عضو... سيستغرق الأمر بعض الوقت لتجنب حظر البوت.`, event.threadID);

    for (let i = 0; i < participants.length; i++) {
        // نستخدم setTimeout لوضع فاصل زمني (1 ثانية) بين كل تغيير
        setTimeout(() => {
            api.changeNickname(customName, event.threadID, participants[i]);
        }, i * 1000); 
    }
};
