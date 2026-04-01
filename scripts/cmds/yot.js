module.exports = {
  config: {
    name: "yot",
    version: "1.0.0",
    role: 0,
    author: "AI",
    description: "البحث عن فيديوهات يوتيوب",
    category: "وسائط",
    guide: "{pn} [اسم الفيديو]",
    countDown: 5
  },

  onStart: async function ({ api, event, args }) {
    const axios = require("axios");
    const yts = require("yt-search");
    const searchQuery = args.join(" ");

    if (!searchQuery) return api.sendMessage("الرجاء كتابة اسم الفيديو، مثال: .yot ون بيس", event.threadID, event.messageID);

    try {
      const searchResults = await yts(searchQuery);
      const video = searchResults.videos[0];

      if (!video) return api.sendMessage("❌ لم يتم العثور على نتائج.", event.threadID);

      const message = `🎬 العنوان: ${video.title}\n⏱️ المدة: ${video.timestamp}\n🔗 الرابط: ${video.url}`;
      
      // لإرسال الفيديو كملف نحتاج مكتبة تحميل، هنا سنرسل المعلومات والرابط كبداية
      return api.sendMessage({
        body: message,
        attachment: (await axios.get(video.thumbnail, { responseType: "stream" })).data
      }, event.threadID, event.messageID);

    } catch (e) {
      return api.sendMessage("❌ حدث خطأ أثناء البحث.", event.threadID);
    }
  }
};
