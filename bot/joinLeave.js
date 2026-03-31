module.exports = {
    config: {
        name: "joinLeave",
        version: "1.1.0",
        author: "Amin",
        category: "events"
    },
    onStart: async ({ api, event }) => {
        const { threadID, logMessageType, logMessageData, author } = event;

        // --- 1. حالة دخول عضو جديد (Join) ---
        if (logMessageType === "log:subscribe") {
            const addedParticipants = logMessageData.addedParticipants;
            for (let participant of addedParticipants) {
                const userID = participant.userFbId;
                const userName = participant.fullName;
                
                // روابط الصور (صورة العضو وصورة الجروب)
                const userImg = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                
                const msg = {
                    body: `نورت المجموعة يا ${userName}! 😍✨\n━━━━━━━━━━━━━\n👤 المضاف: ${userName}\n🤝 بواسطة: ${author === userID ? "انضمام ذاتي" : "أحد الأعضاء"}\n━━━━━━━━━━━━━\nنتمنى لك وقتاً ممتعاً معنا! 🌷`,
                    attachment: await global.utils.getStreamFromURL(userImg)
                };
                api.sendMessage(msg, threadID);
            }
        }

        // --- 2. حالة خروج أو طرد عضو (Leave) ---
        if (logMessageType === "log:unsubscribe") {
            const leftID = logMessageData.leftParticipantFbId;
            
            // جلب اسم الشخص الذي غادر
            const userInfo = await api.getUserInfo(leftID);
            const userName = userInfo[leftID].name;
            const userImg = `https://graph.facebook.com/${leftID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            const msg = {
                body: `وداعاً يا ${userName}.. سنفتقدك! 😢💔\n━━━━━━━━━━━━━\nخرج ${author === leftID ? "بنفسه" : "مطروداً"} من المجموعة.\n━━━━━━━━━━━━━`,
                attachment: await global.utils.getStreamFromURL(userImg)
            };
            api.sendMessage(msg, threadID);
        }
    }
};
