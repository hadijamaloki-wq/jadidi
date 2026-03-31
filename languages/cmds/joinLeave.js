module.exports = {
    config: {
        name: "joinLeave",
        version: "1.2.0",
        author: "Amin",
        category: "events",
        description: "رسائل ترحيب ووداع عند دخول وخروج الأعضاء"
    },

    onStart: async ({ api, event }) => {
        const { threadID, logMessageType, logMessageData, author } = event;

        // دخول عضو جديد
        if (logMessageType === "log:subscribe") {
            const addedParticipants = logMessageData.addedParticipants || [];

            for (let participant of addedParticipants) {
                const userID = participant.userFbId;
                const userName = participant.fullName || "عضو جديد";

                try {
                    const userImg = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

                    const msg = {
                        body: `🌟 نورت المجموعة يا ${userName}! ✨\n\n👤 الاسم: ${userName}\n🤝 انضم ${author === userID ? "بنفسه" : "بواسطة أحد الأعضاء"}\n\nمرحباً بك معنا 💕`,
                        attachment: await global.utils.getStreamFromURL(userImg).catch(() => null)
                    };

                    await api.sendMessage(msg, threadID);
                } catch (e) {
                    console.log("خطأ في رسالة الترحيب:", e);
                }
            }
        }

        // خروج أو طرد عضو
        if (logMessageType === "log:unsubscribe") {
            const leftID = logMessageData.leftParticipantFbId;

            try {
                const userInfo = await api.getUserInfo(leftID);
                const userName = userInfo[leftID]?.name || "عضو";

                const userImg = `https://graph.facebook.com/${leftID}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

                const msg = {
                    body: `😢 وداعاً يا ${userName}...\n\nخرج ${author === leftID ? "بنفسه" : "تم طرده"} من المجموعة 💔`,
                    attachment: await global.utils.getStreamFromURL(userImg).catch(() => null)
                };

                await api.sendMessage(msg, threadID);
            } catch (e) {
                console.log("خطأ في رسالة الوداع:", e);
            }
        }
    }
};
