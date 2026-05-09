const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "tik",
    aliases: ["tiktok", "تيك"],
    version: "1.2.0",
    author: "Amin",
    role: 0,
    description: "البحث في تيك توك",
    category: "media",
    guide: { en: ".tik [الكلمة]" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const query = args.join(" ");

    if (!query) return api.sendMessage("⚠️ | اكتب شنو نقلب ليك!", threadID, messageID);

    try {
      api.sendMessage("🔍 | جاري البحث في تيك توك...", threadID, messageID);

      // استبدال الـ API الميت بـ API قوي (TikWM)
      const searchUrl = `https://tikwm.com/api/feed/search?keywords=${encodeURIComponent(query)}&count=6`;
      const response = await axios.get(searchUrl);
      
      const videos = response.data.data.videos;

      if (!videos || videos.length === 0) {
        return api.sendMessage("❌ | مالقيت حتى نتيجة.", threadID, messageID);
      }

      const dir = path.join(__dirname, "cache");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      let msg = "[ 𝐘𝐮𝐚𝐧 𝐒𝐲𝐬𝐭𝐞𝐦 - 𝐓𝐢𝐤𝐓𝐨𝐤 ]\n━━━━━━━━━━━━━━━\n";
      let attachments = [];
      let videoData = [];

      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        msg += `${i + 1}. 👤 ${video.author.nickname}\n📝 ${video.title.substring(0, 30)}...\n━━━━━━━━━━━━━━━\n`;
        
        const imgPath = path.join(dir, `tik_${i}.jpg`);
        const imgRes = await axios.get(video.cover, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, Buffer.from(imgRes.data));
        attachments.push(fs.createReadStream(imgPath));
        
        videoData.push({ title: video.title, playUrl: video.play });
      }

      msg += "📌 | **رد على هاد الرسالة برقم الفيديو!**";

      api.sendMessage({ body: msg, attachment: attachments }, threadID, (err, info) => {
        attachments.forEach((_, i) => fs.unlinkSync(path.join(dir, `tik_${i}.jpg`)));
        
        if (!err) {
          // تسجيل الرد بنظام Goat-Bot
          global.GoatBot.onReply.set(info.messageID, {
            commandName: module.exports.config.name,
            messageID: info.messageID,
            author: senderID,
            videoList: videoData
          });
        }
      }, messageID);

    } catch (error) {
      api.sendMessage("🥹 | حدث خطأ، تواصل مع المطور.", threadID, messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, messageID, senderID, body } = event;

    if (senderID !== Reply.author) return api.sendMessage("⚠️ | هاد القائمة ماشي ديالك!", threadID, messageID);

    const choice = parseInt(body);
    if (isNaN(choice) || choice < 1 || choice > Reply.videoList.length) {
      return api.sendMessage("❌ | اختار رقم صحيح.", threadID, messageID);
    }

    const selectedVideo = Reply.videoList[choice - 1];

    try {
      api.sendMessage(`⏳ | جاري التحميل بدون علامة مائية...`, threadID, messageID);

      const vidPath = path.join(__dirname, "cache", `tik_vid.mp4`);
      const vidRes = await axios.get(selectedVideo.playUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(vidPath, Buffer.from(vidRes.data));

      global.GoatBot.onReply.delete(Reply.messageID);

      api.sendMessage({
        body: `🎬 | تيك توك جاهز!\n👤 المطور: Amin`,
        attachment: fs.createReadStream(vidPath)
      }, threadID, () => fs.unlinkSync(vidPath), messageID);

    } catch (error) {
      api.sendMessage("❌ | فشل التحميل.", threadID, messageID);
    }
  }
};
