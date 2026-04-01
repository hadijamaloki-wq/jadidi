const { getTime, drive } = global.utils;

if (!global.temp.welcomeEvent)
    global.temp.welcomeEvent = {};

module.exports = {
    config: {
        name: "welcome",
        version: "1.8",
        author: "Amin",
        category: "events",
        description: "رسالة ترحيب احترافية مع صور العضو + المضيف + الجروب"
    },

    onStart: async ({ threadsData, message, event, api, usersData }) => {
        if (event.logMessageType !== "log:subscribe") return;

        return async function () {
            const { threadID, author } = event;
            const addedParticipants = event.logMessageData.addedParticipants || [];

            // إذا كان البوت هو الذي تمت إضافته
            if (addedParticipants.some(p => p.userFbId == api.getCurrentUserID())) {
                api.changeNickname(global.GoatBot.config.nickNameBot || "أمين بوت", threadID, api.getCurrentUserID());
                return message.send("✅ تم تفعيل البوت بنجاح في المجموعة!\n\nأرسل .menu لعرض الأوامر");
            }

            // تأخير بسيط لجمع البيانات
            if (!global.temp.welcomeEvent[threadID]) {
                global.temp.welcomeEvent[threadID] = {
                    joinTimeout: null,
                    dataAddedParticipants: []
                };
            }

            global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...addedParticipants);
            clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

            global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async () => {
                try {
                    const threadData = await threadsData.get(threadID);
                    if (threadData.settings.sendWelcomeMessage === false) return;

                    const dataAdded = global.temp.welcomeEvent[threadID].dataAddedParticipants;
                    const threadName = threadData.threadName || "هذه المجموعة";

                    const mentions = [];
                    const userNames = [];

                    // جمع أسماء ومنشنات
                    for (const user of dataAdded) {
                        userNames.push(user.fullName);
                        mentions.push({ tag: user.fullName, id: user.userFbId });
                    }

                    const addedByName = await usersData.getName(author);

                    // ────── جلب الصور الثلاث ──────
                    const attachments = [];

                    // 1. صورة العضو الجديد (أول واحد)
                    if (dataAdded[0]) {
                        const img1 = `https://graph.facebook.com/${dataAdded[0].userFbId}/picture?width=512&height=512`;
                        attachments.push(await global.utils.getStreamFromURL(img1).catch(() => null));
                    }

                    // 2. صورة الشخص الذي أضاف
                    const imgAdder = `https://graph.facebook.com/${author}/picture?width=512&height=512`;
                    attachments.push(await global.utils.getStreamFromURL(imgAdder).catch(() => null));

                    // 3. صورة المجموعة
                    if (threadData.imageSrc) {
                        attachments.push(await global.utils.getStreamFromURL(threadData.imageSrc).catch(() => null));
                    }

                    const welcomeText = `🌟 مرحباً بكم في ${threadName} 🌟\n\n` +
                                      `👤 العضو الجديد: ${userNames.join("، ")}\n` +
                                      `👤 تمت الإضافة بواسطة: ${addedByName}\n\n` +
                                      `نتمنى لكم وقتاً ممتعاً ومليئاً بالفائدة معنا 💕\n` +
                                      `━━━━━━━━━━━━━━━`;

                    const form = {
                        body: welcomeText,
                        mentions: mentions,
                        attachment: attachments.filter(Boolean) // إزالة الصور الفاشلة
                    };

                    await message.send(form);

                } catch (error) {
                    console.log("خطأ في رسالة الترحيب:", error);
                } finally {
                    delete global.temp.welcomeEvent[threadID];
                }
            }, 1800); // تأخير 1.8 ثانية
        };
    }
};
