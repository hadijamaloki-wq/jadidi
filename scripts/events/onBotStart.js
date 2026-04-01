module.exports = {
    config: {
        name: "botStart",
        version: "1.0",
        author: "Amin",
        category: "events",
        description: "رسالة عند تشغيل البوت"
    },

    onStart: async ({ api }) => {
        // هنا يمكنك إرسال رسالة في مجموعات معينة أو كل المجموعات

        const welcomeToGroups = "✅ **بوت أمين تم تشغيله بنجاح!**\n\n" +
                               "البوت الآن يعمل بشكل طبيعي ✅\n" +
                               "أرسل .menu لعرض قائمة الأوامر\n\n" +
                               "شكراً لاستخدامك البوت 💕";

        // طريقة 1: إرسال رسالة في أول 5 مجموعات فقط (موصى بها)
        api.getThreadList(5, null, ["GROUP"], (err, list) => {
            if (err) return;

            list.forEach(thread => {
                api.sendMessage(welcomeToGroups, thread.threadID);
            });
        });

        console.log("✅ تم إرسال رسالة تشغيل البوت بنجاح");
    }
};
