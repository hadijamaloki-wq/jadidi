const axios = require("axios");
const fs = require("fs");

module.exports.config = {
    name: "tik",
    version: "1.0.0",
    hasPermssion: 0, // مسموح للجميع
    credits: "خبير البرمجة",
    description: "البحث وتحميل فيديو من تيك توك",
    commandCategory: "الوسائط",
    usages: "[كلمة البحث]",
    cooldowns: 10
};

module.exports.run = async function({ api, event, args }) {
    const searchQuery = args.join(" ");
    if (!searchQuery) return api.sendMessage("يرجى كتابة ما تريد البحث عنه، مثال: .tik One Piece", event.threadID);

    api.sendMessage("🔍 جاري البحث والتحميل... الرجاء الانتظار.", event.threadID);

    try {
        // نستخدم API مجاني للبحث في تيك توك (قد تحتاج لتغيير الرابط حسب الـ API الذي تفضله)
        const res = await axios.get(`https://api.popcat.xyz/tiktok/search?q=${encodeURI(searchQuery)}`);
        const videoUrl = res.data.video; 

        // تحميل الفيديو إلى مسار مؤقت
        const path = __dirname + `/cache/tiktok_${Date.now()}.mp4`;
        const videoData = (await axios.get(videoUrl, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(path, Buffer.from(videoData, "utf-8"));

        // إرسال الفيديو كملف مرفق
        api.sendMessage({
            body: `✅ تم العثور على الفيديو!\nالعنوان: ${res.data.title}`,
            attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path)); // نحذف الملف بعد الإرسال لتوفير المساحة

    } catch (error) {
        api.sendMessage("❌ عذراً، حدث خطأ أثناء البحث أو لم أتمكن من العثور على الفيديو.", event.threadID);
    }
};
