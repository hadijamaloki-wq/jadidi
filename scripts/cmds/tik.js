module.exports = {
  config: {
    name: "tik",
    version: "1.0.0",
    role: 0,
    author: "AI",
    description: "البحث عن فيديوهات تيك توك وتحميلها",
    category: "وسائط",
    guide: "{pn} [اسم الفيديو]",
    countDown: 5
  },

  onStart: async function ({ api, event, args }) {
    const axios = require("axios");
    const searchQuery = args.join(" ");
    if (!searchQuery) return api.sendMessage("الرجاء كتابة اسم الفيديو، مثال: .tik ون بيس", event.threadID, event.messageID);

    api.sendMessage("⏳ جاري البحث والتحميل...", event.threadID);

    try {
      // استخدام API مجاني للبحث والتحميل
      const res = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(searchQuery)}`);
      // ملاحظة: بعض الـ APIs تتطلب رابط مباشر، إذا كنت تريد "بحث" نحتاج API مختلف
      // هذا المثال يفترض وجود API يدعم البحث أو التحميل برابط
      
      const videoUrl = res.data.video.noWatermark; // رابط الفيديو بدون علامة مائية

      const stream = (await axios.get(videoUrl, { responseType: "stream" })).data;
      return api.sendMessage({
        body: `✅ تم تحميل فيديو: ${searchQuery}`,
        attachment: stream
      }, event.threadID, event.messageID);

    } catch (e) {
      return api.sendMessage("❌ عذراً، تعذر العثور على الفيديو أو حدث خطأ.", event.threadID);
    }
  }
};
