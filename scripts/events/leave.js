const { getTime, drive } = global.utils;

module.exports = {
    config: {
        name: "leave",
        version: "1.5",
        author: "Amin",
        category: "events",
        description: "رسائل وداع عند خروج الأعضاء"
    },

    langs: {
        vi: { /* لا نحتاجها */ },
        en: {
            session1: "صباحاً",
            session2: "ظهراً",
            session3: "مساءً",
            session4: "ليلاً",
            leaveType1: "غادر بنفسه",
            leaveType2: "تم طرده"
        }
    },

    onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
        if (event.logMessageType !== "log:unsubscribe") return;

        // ────── إعدادات الرسائل ──────
        const ENABLE_LEAVE_MESSAGES = true;   // غيرها إلى false إذا تبي تعطيل الرسائل

        if (!ENABLE_LEAVE_MESSAGES) return;

        const { threadID, author } = event;
        const { leftParticipantFbId } = event.logMessageData;

        // لا ترسل رسالة إذا كان البوت هو اللي غادر
        if (leftParticipantFbId == api.getCurrentUserID()) return;

        try {
            const threadData = await threadsData.get(threadID);
            const userName = await usersData.getName(leftParticipantFbId);
            const hours = getTime("HH");

            // تحديد نوع الخروج
            const leaveType = (leftParticipantFbId == author) 
                ? "غادر المجموعة بنفسه" 
                : "تم طرده من المجموعة";

            // رسالة الوداع الجميلة
            const leaveMessage = `😢 وداعاً يا ${userName}...\n\n` +
                                `${leaveType}\n\n` +
                                `نتمنى لك التوفيق في حياتك 💔\n` +
                                `سنفتقدك معنا 🌹`;

            const form = { body: leaveMessage };

            // إضافة صورة الشخص اللي غادر (اختياري)
            try {
                const userImg = `https://graph.facebook.com/${leftParticipantFbId}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
                form.attachment = await global.utils.getStreamFromURL(userImg);
            } catch (e) {
                // لو فشل تحميل الصورة، نكمل بدونها
            }

            await message.send(form);

        } catch (error) {
            console.log("خطأ في رسالة الوداع:", error);
        }
    }
};
