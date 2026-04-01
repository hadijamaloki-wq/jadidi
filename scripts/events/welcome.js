const { getTime } = global.utils;

module.exports = {
    config: {
        name: "welcome",
        version: "1.8",
        author: "Amin",
        category: "events"
    },

    onStart: async ({ api, event, threadsData, usersData }) => {
        if (event.logMessageType !== "log:subscribe") return;

        const { threadID, author } = event;
        const addedParticipants = event.logMessageData.addedParticipants || [];

        if (addedParticipants.length === 0) return;

        // إذا كان البوت هو الذي تمت إضافته
        if (addedParticipants.some(p => p.userFbId == api.getCurrentUserID())) {
            return api.sendMessage("✅ تم تفعيل البوت بنجاح في المجموعة!\nأرسل .menu لعرض الأوامر", threadID);
        }

        try {
            const threadData = await threadsData.get(threadID);
            const threadName = threadData.threadName || "المجموعة";

            const newUser = addedParticipants[0];
            const newUserID = newUser.userFbId;
            const newUserName = newUser.fullName;

            const addedByName = await usersData.getName(author);

            // رسالة الترحيب الأنيقة
            const welcomeText = `🌟 مرحباً بك في ${threadName} 🌟\n\n` +
                               `👤 العضو الجديد: ${newUserName}\n` +
                               `👤 تمت الإضافة بواسطة: ${addedByName}\n\n` +
                               `نتمنى لك إقامة ممتعة ومفيدة معنا 💕`;

            // جلب الصور الثلاث (مثل الصورة اللي بعثتها)
            const attachments = [];

            // صورة العضو الجديد
            attachments.push(await global.utils.getStreamFromURL(`https://graph.facebook.com/${newUserID}/picture?width=512&height=512`));

            // صورة من أضافه
            attachments.push(await global.utils.getStreamFromURL(`https://graph.facebook.com/${author}/picture?width=512&height=512`));

            // صورة المجموعة (إذا كانت موجودة)
            if (threadData.imageSrc) {
                attachments.push(await global.utils.getStreamFromURL(threadData.imageSrc));
            }

            await api.sendMessage({
                body: welcomeText,
                attachment: attachments
            }, threadID);

        } catch (error) {
            console.log("خطأ في رسالة الترحيب:", error);
        }
    }
};
