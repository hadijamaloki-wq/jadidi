const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const yts = require("yt-search");

module.exports = {
  config: {
    name: "yot",
    aliases: ["يوت", "reels"],
    version: "1.3.5",
    author: "Amin",
    role: 0,
    description: "البحث في يوتيوب (أقل من 6 دقائق) مع حذف القائمة وتفاعلات",
    category: "media",
    guide: { en: ".yot [اسم الفيديو]" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const query = args.join(" ");

    if (!query) return api.sendMessage("⚠️ | يا **Maestro**، اكتب شنو بغيتي نقلب ليك!", threadID, messageID);

    try {
      api.sendMessage("🔍 | جاري البحث في يوتيوب...", threadID, messageID);

      const searchResults = await yts(query);
      const shortVideos = searchResults.videos.filter(v => v.seconds <= 360);
      const videos = shortVideos.slice(0, 6);

      if (videos.length === 0) return api.sendMessage("❌ | مالقيت حتى فيديو قصير بهاد السمية.", threadID, messageID);

      const dir = path.join(__dirname, "cache");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      let msg = "[ 𝐘𝐮𝐚𝐧 𝐒𝐲𝐬𝐭𝐞𝐦 - 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 ]\n━━━━━━━━━━━━━━━\n";
      let attachments = [];
      let videoData = [];

      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        msg += `${i + 1}. 🎬 ${video.title}\n⏱️ المدة: ${video.timestamp}\n━━━━━━━━━━━━━━━\n`;
        const imgPath = path.join(dir, `yot_${i}_${senderID}.jpg`);
        const res = await axios.get(video.thumbnail, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, Buffer.from(res.data));
        attachments.push(fs.createReadStream(imgPath));
        videoData.push({ title: video.title, url: video.url });
      }

      msg += "📌 | **رد على هاد الرسالة برقم الفيديو!**";

      api.sendMessage({ body: msg, attachment: attachments }, threadID, (err, info) => {
        attachments.forEach((_, i) => {
            const p = path.join(dir, `yot_${i}_${senderID}.jpg`);
            if (fs.existsSync(p)) fs.unlinkSync(p);
        });
        if (!err) {
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
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("❌ | اختار رقم صحيح.", threadID, messageID);
    }

    const selectedVideo = Reply.videoList[choice - 1];

    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);
      api.unsendMessage(Reply.messageID); // حذف قائمة الصور
      
      api.sendMessage(`⏳ | جاري التحميل: **${selectedVideo.title}**...`, threadID, messageID);

      const dlApiUrl = `https://api.joshweb.click/api/yt-dlp?url=${encodeURIComponent(selectedVideo.url)}`;
      const res = await axios.get(dlApiUrl);
      const videoUrl = res.data.result.video;

      const vidPath = path.join(__dirname, "cache", `yot_vid_${senderID}.mp4`);
      const vidRes = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(vidPath, Buffer.from(vidRes.data));

      global.GoatBot.onReply.delete(Reply.messageID);
      api.setMessageReaction("✅", messageID, () => {}, true);

      api.sendMessage({
        body: `🎥 | تفضل الفيديو ديالك!\n👤 المطور: Amin`,
        attachment: fs.createReadStream(vidPath)
      }, threadID, () => fs.unlinkSync(vidPath), messageID);

    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage("❌ | فشل التحميل.", threadID, messageID);
    }
  }
};
