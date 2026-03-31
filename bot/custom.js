const { log } = global.utils;

module.exports = async function ({ api, threadsData, usersData, getText }) {

    // 1. إرسال رسالة التشغيل عند البداية
    const welcomeMessage = "بوت امين تم تشغيله بنجاح! 😅✌🏿\nالميزات: حماية الروابط + ترحيب بالصور + مراقب المجموعات.";
    
    api.getThreadList(20, null, ["GROUP"], (err, list) => {
        if (!err) {
            list.forEach(thread => {
                api.sendMessage(welcomeMessage, thread.threadID);
            });
        }
    });

    // 2. الاستماع للأحداث (الترحيب المتقدم ومنع الروابط)
    api.listenMqtt(async (err, event) => {
        if (err) return;

        // ميزة الترحيب المتقدمة عند إضافة عضو جديد
        if (event.logMessageType === "log:subscribe") {
            const { threadID, logMessageData } = event;
            const addedParticipants = logMessageData.addedParticipants;
            const authorID = event.author; // الشخص الذي قام بالإضافة

            // جلب بيانات الجروب
            const threadInfo = await api.getThreadInfo(threadID);
            const threadName = threadInfo.threadName || "هذه المجموعة";
            const threadImg = threadInfo.imageSrc;

            for (let participant of addedParticipants) {
                const userID = participant.userFbId;
                const userName = participant.fullName;

                // رابط صورة الشخص المنضم ورابط صورة الشخص الذي أضافه
                const userImg = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                const authorImg = `https://graph.facebook.com/${authorID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

                const msg = {
                    body: `إضافة جديدة في "${threadName}"! 😍\n\n👤 العضو الجديد: ${userName}\n🤝 بواسطة: ${authorID === userID ? "انضمام ذاتي" : "أحد الأعضاء"}\n\nنورتنا يا بطل! ✨`,
                    mentions: [{ tag: userName, id: userID }],
                    attachment: [
                        // سيحاول البوت إرسال صورة العضو المنضم كملحق
                        await global.utils.getStreamFromURL(userImg)
                    ]
                };

                api.sendMessage(msg, threadID);
            }
        }

        // ميزة منع الروابط (Link Guard)
        if (event.type === "message" && (event.body && (event.body.includes("http://") || event.body.includes("https://")))) {
            api.unsendMessage(event.messageID);
            api.sendMessage(`⚠️ ممنوع نشر الروابط هنا!`, event.threadID);
        }
    });

    // 3. تحديث الرمز الأمني (fb_dtsg)
    setInterval(async () => {
        api.refreshFb_dtsg()
            .then(() => log.success("Custom", "Refreshed fb_dtsg"))
            .catch((err) => log.error("Custom", "Error refreshing fb_dtsg", err));
    }, 1000 * 60 * 60 * 48);
};
