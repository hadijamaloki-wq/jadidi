const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "anisearch",
    aliases: ["انمي", "مانهوا", "رواية"],
    version: "2.5.0",
    author: "Amin",
    role: 0,
    description: "البحث عن الأنمي والمانهوا والروايات وتحويل النتائج لفيديو",
    category: "media",
    guide: { en: ".anisearch [اسم العمل]" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const query = args.join(" ");

    if (!query) return api.sendMessage("⚠️ | يا **Maestro**، اكتب سمية الأنمي أو المانهوا أو الرواية اللي بغيتي!", threadID, messageID);

    try {
      // 1. تفاعل الانتظار
      api.setMessageReaction("⏳", messageID, () => {}, true);
      api.sendMessage(`🔍 | جاري البحث عن فيديو لـ "${query}" في عالم الأنمي والمانهوا...`, threadID, messageID);

      // 2. البحث عن فيديو (Edit/Trailer) باستعمال محرك بحث ميديا قوي
      // استعملت كلمات مفتاحية ذكية باش يجي الفيديو ناضي (AMV/Edit)
      const searchKeywords = encodeURIComponent(`${query} anime manhwa edit amv`);
      const searchRes = await axios.get(`https://www.tikwm.com/api/feed/search?keywords=${searchKeywords}&count=1`);
      
      const videoData = searchRes.data.data.videos[0];

      if (!videoData) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return api.sendMessage("❌ | مالقيت حتى فيديو لهاد العمل، جرب تتأكد من السمية.", threadID, messageID);
      }

      // 3. تحميل الفيديو
      const vidPath = path.join(__dirname, "cache", `ani_${senderID}.mp4`);
      const videoUrl = videoData.play;
      const vidBuffer = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(vidPath, Buffer.from(vidBuffer.data));

      // 4. تفاعل النجاح وإرسال الفيديو
      api.setMessageReaction("✅", messageID, () => {}, true);
      
      const caption = `🎬 | **النتيجة:** ${videoData.title.slice(0, 50)}...\n` +
                      `✨ | لـ: ${query}\n` +
                      `━━━━━━━━━━━━━━━\n` +
                      `👤 **المطور:** Amin (Maestro)`;

      api.sendMessage({
        body: caption,
        attachment: fs.createReadStream(vidPath)
      }, threadID, () => {
          if (fs.existsSync(vidPath)) fs.unlinkSync(vidPath);
      }, messageID);

    } catch (error) {
      console.error(error);
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage("❌ | وقع مشكل أثناء جلب الفيديو، جرب مرة أخرى.", threadID, messageID);
    }
  }
};
