const { log } = global.utils;

module.exports = async function ({ api }) {
    // رسالة التشغيل فقط
    const welcomeMessage = "بوت امين تم تشغيله بنجاح! 😅✌🏿";
    api.getThreadList(10, null, ["GROUP"], (err, list) => {
        if (!err) list.forEach(thread => api.sendMessage(welcomeMessage, thread.threadID));
    });

    setInterval(async () => {
        api.refreshFb_dtsg().catch(() => {});
    }, 1000 * 60 * 60 * 48);
};
