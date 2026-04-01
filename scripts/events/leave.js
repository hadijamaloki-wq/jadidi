const { getTime } = global.utils;

module.exports = {
    config: {
        name: "leave",
        version: "1.0",
        author: "Amin",
        category: "events"
    },

    onStart: async ({ api, event, usersData }) => {
        if (event.logMessageType !== "log:unsubscribe") return;

        const { threadID, author } = event;
        const leftID = event.logMessageData.leftParticipantFbId;

        // لا ترسل رسالة إذا كان البوت هو الذي غادر
        if (leftID == api.getCurrentUserID()) return;

        try {
            const userName = await usersData.getName(leftID);
            const isSelfLeave = leftID === author;

            const msg = `😢 وداعاً يا ${userName}...\n\n` +
                       `${isSelfLeave ? "غادر المجموعة بنفسه" : "تم طرده من المجموعة"}\n\n` +
                       `نتمنى لك التوفيق في حياتك 💔`;

            await api.sendMessage(msg, threadID);
        } catch (e) {
            console.log("خطأ في رسالة الوداع:", e);
        }
    }
};
