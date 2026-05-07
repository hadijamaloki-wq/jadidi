const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "tik",
    version: "2.0.0",
    author: "Amine (Alen)",
    countDown: 5,
    role: 0,
    shortDescription: { en: "البحث عن فيديوهات تيك توك وإرسالها" },
    category: "media",
    guide: { en: "{pn} <كلمات البحث>" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID } = event;
    const searchQuery = args.join(" ");

    if (!searchQuery) return message.reply("💍 وش تبي أدور لك في تيك توك؟ اكتب مثلاً: .tik مقاطع مضحكة");

    message.reply(`🔍 جاري البحث عن "${searchQuery}" في تيك توك..`);

    try {
      // 1. البحث عن فيديوهات بناءً على الكلمة المفتاحية
      const searchRes = await axios.get(`https://waifu-api.vercel.app/tiktok/search?query=${encodeURIComponent(searchQuery)}`);
      
      const videos = searchRes.data.results || searchRes.data;
      if (!videos || videos.length === 0) throw new Error("لم يتم العثور على نتائج");

      // اختيار فيديو عشوائي من أول 5 نتائج لزيادة التنوع
      const randomVideo = videos[Math.floor(Math.random() * Math.min(videos.length, 5))];
      const videoUrl = randomVideo.video_url || randomVideo.play;
      const title = randomVideo.title || "فيديو تيك توك";

      // 2. تحميل الفيديو وإرساله
      const videoPath = path.join(__dirname, "cache", `tik_search_${Date.now()}.mp4`);
      if (!fs.existsSync(path.join(__dirname, "cache"))) fs.mkdirSync(path.join(__dirname, "cache"));

      const response = await axios({
        method: 'get',
        url: videoUrl,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(videoPath);
      response.data.pipe(writer);

      writer.on('finish', () => {
        return api.sendMessage({
          body: `🎬 نتيجة البحث: ${title}`,
          attachment: fs.createReadStream(videoPath)
        }, threadID, () => {
          fs.unlinkSync(videoPath); // حذف الملف من السيرفر بعد الإرسال
        }, messageID);
      });

    } catch (err) {
      console.error(err);
      return message.reply("❌ عذراً، لم أجد أي فيديو بهذا الاسم. جرب كلمات بحث أخرى.");
    }
  }
};
