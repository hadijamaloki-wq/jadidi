const axios = require("axios");

module.exports = {
  config: {
    name: "tik",
    version: "1.0.3",
    role: 0,
    author: "AI & Vex",
    description: "بحث وتحميل فيديوهات تيك توك مع تفاعلات إيموجي",
    category: "وسائط",
    guide: "{pn} [اسم الفيديو أو الرابط]",
    countDown: 5
  },

  onStart: async function ({ api, event, args }) {
    const searchQuery = args.join(" ");
    
    if (!searchQuery) {
      return api.sendMessage("❌ يرجى كتابة اسم الفيديو أو وضع رابط.", event.threadID, event.messageID);
    }

    // التفاعل بـ 👍🏿 لبدء العملية (الانتظار)
    api.setMessageReaction("👍🏿", event.messageID, () => {}, true);

    try {
      let videoUrl = "";

      // التحقق إذا كان الرابط مباشر أو بحث
      if (searchQuery.includes("tiktok.com")) {
        videoUrl = searchQuery;
      } else {
        const searchRes = await axios.get(`https://api.davidcyriltech.my.id/tiktoksearch?text=${encodeURIComponent(searchQuery)}`);
        const results = searchRes.data.result;

        if (!results || results.length === 0) {
           api.setMessageReaction("❌", event.messageID, () => {}, true);
           return api.sendMessage("❌ لم أجد أي نتائج.", event.threadID, event.messageID);
        }
        // اختيار فيديو عشوائي من النتائج
        const randomVideo = results[Math.floor(Math.random() * Math.min(results.length, 5))];
        videoUrl = randomVideo.url; 
      }

      // جلب رابط التحميل بدون علامة مائية
      const dlRes = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(videoUrl)}`);
      const finalVideoUrl = dlRes.data.video.noWatermark;

      if (!finalVideoUrl) throw new Error("Link not found");

      const stream = (await axios.get(finalVideoUrl, { responseType: "stream" })).data;
      
      // التفاعل بـ ✌🏿 عند إرسال الفيديو (النجاح)
      api.setMessageReaction("✌🏿", event.messageID, () => {}, true);

      return api.sendMessage({
        attachment: stream
      }, event.threadID, event.messageID);

    } catch (e) {
      console.error(e);
      // التفاعل بـ ❌ في حالة الخطأ
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return api.sendMessage("❌ حدث خطأ، حاول مرة أخرى.", event.threadID);
    }
  }
};
