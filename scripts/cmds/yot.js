module.exports = {
  config: {
    name: "yot",
    version: "1.0.1",
    role: 0,
    author: "AI",
    description: "البحث عن فيديوهات يوتيوب وتحميلها",
    category: "وسائط",
    guide: "{pn} [اسم الفيديو]",
    countDown: 5
  },

  onStart: async function ({ api, event, args }) {
    const axios = require("axios");
    const yts = require("yt-search");
    const searchQuery = args.join(" ");

    if (!searchQuery) return api.sendMessage("الرجاء كتابة اسم الفيديو، مثال: .yot ون بيس", event.threadID, event.messageID);

    api.sendMessage("⏳ جاري البحث عن الفيديو وتحميله، يرجى الانتظار...", event.threadID);

    try {
      // 1. البحث عن الفيديو
      const searchResults = await yts(searchQuery);
      const video = searchResults.videos[0];

      if (!video) return api.sendMessage("❌ لم يتم العثور على نتائج.", event.threadID);

      const message = `🎬 العنوان: ${video.title}\n⏱️ المدة: ${video.timestamp}`;
      
      // 2. استخدام API خارجي مجاني لتحميل فيديو يوتيوب كـ MP4
      const dlRes = await axios.get(`https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(video.url)}`);
      
      if (!dlRes.data.success) {
          return api.sendMessage("❌ عذراً، فشل استخراج رابط تحميل الفيديو.", event.threadID);
      }

      const videoDownloadUrl = dlRes.data.result.download_url;

      // 3. إرسال الفيديو كملف مرفق
      const stream = (await axios.get(videoDownloadUrl, { responseType: "stream" })).data;
      
      return api.sendMessage({
        body: message,
        attachment: stream
      }, event.threadID, event.messageID);

    } catch (e) {
      console.log(e);
      return api.sendMessage("❌ حدث خطأ أثناء البحث أو أن حجم الفيديو كبير جداً على الإرسال.", event.threadID);
    }
  }
};
