const axios = require('axios');
const yts = require('yt-search');

module.exports = {
  config: {
    name: "yot",
    version: "2.1.0",
    role: 0,
    author: "Maestro",
    description: "بحث وتحميل فيديوهات يوتيوب (نسخة الاستضافة)",
    category: "media",
    guide: "{pn} [اسم الفيديو]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const query = args.join(" ");

    if (!query) return api.sendMessage("❌ اكتب اسم الفيديو يا Maestro!", threadID, messageID);

    try {
      api.sendMessage(`🔍 جاري البحث عن "${query}"...`, threadID, messageID);

      const search = await yts(query);
      const video = search.videos[0];

      if (!video) return api.sendMessage("❌ ملقيت حتى فيديو بهاد السمية.", threadID, messageID);

      // تنبيه المستخدم باللي كنوجدو التحميل
      api.sendMessage(`⏳ كنوجد ليك الفيديو: "${video.title}"\n⏱️ المدة: ${video.timestamp}`, threadID, messageID);

      // استعمال API خارجي لتفادي حظر IP السيرفر
      const res = await axios.get(`https://api.boxi.my.id/api/youtube/download?url=${encodeURIComponent(video.url)}`);
      const downloadUrl = res.data.data.mp4;

      if (!downloadUrl) return api.sendMessage("⚠️ كاين مشكل فالسيرفر، جرب مرة أخرى.", threadID, messageID);

      const stream = (await axios.get(downloadUrl, { responseType: 'stream' })).data;

      return api.sendMessage({
        body: `✅ هاك الفيديو ديالك:\n📝 ${video.title}`,
        attachment: stream
      }, threadID, messageID);

    } catch (err) {
      return api.sendMessage("⚠️ وقع خطأ! جرب فيديو آخر أو اسم آخر.", threadID, messageID);
    }
  }
};
