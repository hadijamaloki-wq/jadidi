const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "tik",
    version: "1.0.0",
    author: "خبير البرمجة",
    countDown: 10,
    role: 0,
    description: "البحث عن فيديو تيك توك",
    category: "الوسائط",
    guide: "{pn} [كلمة البحث]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const query = args.join(" ");
    if (!query) return api.sendMessage("📝 يرجى كتابة اسم الفيديو، مثال: .tik ون بيس", threadID, messageID);

    api.sendMessage("⏳ جاري البحث والتحميل...", threadID);

    try {
      const res = await axios.get(`https://api.samirxpikachu.run/tiktok/searchvideo?keywords=${encodeURIComponent(query)}`);
      const videoUrl = res.data.data.videos[0].play; 

      // التعديل هنا ليتناسب مع مجلد cache الذي أنشأته
      const filePath = path.join(__dirname, "..", "cache", `tik_${Date.now()}.mp4`);
      
      const videoStream = (await axios.get(videoUrl, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(filePath, Buffer.from(videoStream, "utf-8"));

      api.sendMessage({
        body: `✅ تم العثور على الفيديو!`,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => fs.unlinkSync(filePath), messageID);

    } catch (e) {
      api.sendMessage("❌ حدث خطأ، قد يكون الفيديو طويلاً جداً أو الـ API متوقف.", threadID, messageID);
    }
  }
};
