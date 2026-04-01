module.exports = {
  config: {
    name: "tik",
    version: "1.0.1",
    role: 0,
    author: "AI",
    description: "البحث عن فيديوهات تيك توك وتحميلها",
    category: "وسائط",
    guide: "{pn} [اسم الفيديو أو الرابط]",
    countDown: 5
  },

  onStart: async function ({ api, event, args }) {
    const axios = require("axios");
    const searchQuery = args.join(" ");
    if (!searchQuery) return api.sendMessage("الرجاء كتابة اسم الفيديو أو وضع رابط، مثال: .tik ون بيس", event.threadID, event.messageID);

    api.sendMessage("⏳ جاري البحث والتحميل...", event.threadID);

    try {
      let videoUrl = "";

      // التحقق مما إذا كان المدخل رابطاً أم كلمة بحث
      if (searchQuery.includes("tiktok.com")) {
        videoUrl = searchQuery;
      } else {
        // استخدام API للبحث عن الفيديو وجلب رابط أول نتيجة
        const searchRes = await axios.get(`https://api.davidcyriltech.my.id/tiktoksearch?text=${encodeURIComponent(searchQuery)}`);
        
        if (!searchRes.data.result || searchRes.data.result.length === 0) {
           return api.sendMessage("❌ لم أتمكن من العثور على أي فيديو بهذا الاسم.", event.threadID, event.messageID);
        }
        // أخذ رابط أول فيديو من نتائج البحث
        videoUrl = searchRes.data.result[0].url; 
      }

      // تحميل الفيديو بدون علامة مائية باستخدام API التحميل
      const dlRes = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(videoUrl)}`);
      const finalVideoUrl = dlRes.data.video.noWatermark;

      const stream = (await axios.get(finalVideoUrl, { responseType: "stream" })).data;
      return api.sendMessage({
        body: `✅ تم تحميل فيديو لـ: ${searchQuery}`,
        attachment: stream
      }, event.threadID, event.messageID);

    } catch (e) {
      console.log(e);
      return api.sendMessage("❌ عذراً، تعذر العثور على الفيديو أو حدث خطأ في الخادم.", event.threadID);
    }
  }
};
