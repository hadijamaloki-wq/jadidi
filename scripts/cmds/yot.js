const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const yts = require("yt-search");

module.exports = {
  config: {
    name: "yot",
    aliases: ["يوت", "reels"],
    version: "1.2.0",
    author: "Amin",
    role: 0,
    description: "البحث عن فيديوهات يوتيوب واختيار واحد لتحميله",
    category: "media",
    guide: { en: ".yot [اسم الفيديو]" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const query = args.join(" ");

    if (!query) return api.sendMessage("⚠️ | اكتب شنو بغيتي نقلب ليك!", threadID, messageID);

    try {
      api.sendMessage("🔍 | جاري البحث في يوتيوب...", threadID, messageID);

      const searchResults = await yts(query + " shorts");
      const videos = searchResults.videos.slice(0, 6);

      if (videos.length === 0) return api.sendMessage("❌ | مالقيت حتى نتيجة.", threadID, messageID);

      const dir = path.join(__dirname, "cache");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      let msg = "[ 𝐘𝐮𝐚𝐧 𝐒𝐲𝐬𝐭𝐞𝐦 - 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 ]\n━━━━━━━━━━━━━━━\n";
      let attachments = [];
      let videoData = [];

      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        msg += `${i + 1}. 🎬 ${video.title}\n⏱️ المدة: ${video.timestamp}\n━━━━━━━━━━━━━━━\n`;
        
        const imgPath = path.join(dir, `yot_${i}.jpg`);
        const res = await axios.get(video.thumbnail, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, Buffer.from(res.data));
        attachments.push(fs.createReadStream(imgPath));
        
        videoData.push({ title: video.title, url: video.url });
      }

      msg += "📌 | **رد على هاد الرسالة برقم الفيديو (من 1 لـ 6) باش نحملو ليك!**";

      api.sendMessage({ body: msg, attachment: attachments }, threadID, (err, info) => {
        attachments.forEach((_, i) => fs.unlinkSync(path.join(dir, `yot_${i}.jpg`)));
        
        if (!err) {
          // هاد السطر هو اللي تصلح باش يخدم مع Goat-Bot
          global.GoatBot.onReply.set(info.messageID, {
            commandName: module.exports.config.name,
            messageID: info.messageID,
            author: senderID,
            videoList: videoData
          });
        }
      }, messageID);

    } catch (error) {
      api.sendMessage("🥹 | حدث خطأ أثناء البحث.", threadID, messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, messageID, senderID, body } = event;

    if (senderID !== Reply.author) return api.sendMessage("⚠️ | هاد القائمة ماشي ديالك!", threadID, messageID);

    const choice = parseInt(body);
    if (isNaN(choice) || choice < 1 || choice > Reply.videoList.length) {
      return api.sendMessage("❌ | اختار رقم صحيح من 1 لـ " + Reply.videoList.length, threadID, messageID);
    }

    const selectedVideo = Reply.videoList[choice - 1];

    try {
      api.sendMessage(`⏳ | جاري تحميل: **${selectedVideo.title}**...`, threadID, messageID);

      const dlApiUrl = `https://api.joshweb.click/api/yt-dlp?url=${encodeURIComponent(selectedVideo.url)}`;
      const res = await axios.get(dlApiUrl);
      const videoUrl = res.data.result.video;

      const vidPath = path.join(__dirname, "cache", `yot_vid.mp4`);
      const vidRes = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(vidPath, Buffer.from(vidRes.data));

      // مسح الرد من الذاكرة
      global.GoatBot.onReply.delete(Reply.messageID);

      api.sendMessage({
        body: `🎥 | تفضل الفيديو!\n👤 المطور: Amin`,
        attachment: fs.createReadStream(vidPath)
      }, threadID, () => fs.unlinkSync(vidPath), messageID);

    } catch (error) {
      api.sendMessage("❌ | فشل التحميل، الفيديو قد يكون طويلاً.", threadID, messageID);
    }
  }
};
