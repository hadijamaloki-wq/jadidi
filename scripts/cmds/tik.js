const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "tik",
    aliases: ["tiktok", "تيك"],
    version: "1.3.5",
    author: "Amin",
    role: 0,
    description: "البحث في تيك توك مع حذف القائمة وتفاعلات",
    category: "media",
    guide: { en: ".tik [الكلمة]" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const query = args.join(" ");

    if (!query) return api.sendMessage("⚠️ | اكتب شنو نقلب ليك!", threadID, messageID);

    try {
      api.sendMessage("🔍 | جاري البحث في تيك توك...", threadID, messageID);

      const searchUrl = `https://tikwm.com/api/feed/search?keywords=${encodeURIComponent(query)}&count=6`;
      const response = await axios.get(searchUrl);
      const videos = response.data.data.videos;

      if (!videos || videos.length === 0) return api.sendMessage("❌ | مالقيت حتى نتيجة.", threadID, messageID);

      const dir = path.join(__dirname, "cache");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      let msg = "[ 𝐘𝐮𝐚𝐧 𝐒𝐲𝐬𝐭𝐞𝐦 - 𝐓𝐢𝐤𝐓𝐨𝐤 ]\n━━━━━━━━━━━━━━━\n";
      let attachments = [];
      let videoData = [];

      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        msg += `${i + 1}. 👤 ${video.author.nickname}\n📝 ${video.title.substring(0, 30)}...\n━━━━━━━━━━━━━━━\n`;
        const imgPath = path.join(dir, `tik_${i}_${senderID}.jpg`);
        const imgRes = await axios.get(video.cover, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, Buffer.from(imgRes.data));
        attachments.push(fs.createReadStream(imgPath));
        videoData.push({ title: video.title, playUrl: video.play });
      }

      msg += "📌 | **رد برقم الفيديو!**";

      api.sendMessage({ body: msg, attachment: attachments }, threadID, (err, info) => {
        attachments.forEach((_, i) => {
            const p = path.join(dir, `tik_${i}_${senderID}.jpg`);
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
      api.sendMessage("🥹 | حدث خطأ، جرب مرة أخرى.", threadID, messageID);
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

      const vidPath = path.join(__dirname, "cache", `tik_vid_${senderID}.mp4`);
      const vidRes = await axios.get(selectedVideo.playUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(vidPath, Buffer.from(vidRes.data));

      global.GoatBot.onReply.delete(Reply.messageID);
      api.setMessageReaction("✅", messageID, () => {}, true);

      api.sendMessage({
        body: `🎬 | تيك توك جاهز!\n👤 المطور: Amin`,
        attachment: fs.createReadStream(vidPath)
      }, threadID, () => fs.unlinkSync(vidPath), messageID);

    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage("❌ | فشل التحميل.", threadID, messageID);
    }
  }
};
