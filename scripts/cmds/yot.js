const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const yts = require("yt-search");

module.exports = {
  config: {
    name: "yot",
    aliases: ["يوت"],
    version: "2.1.0",
    author: "Amin",
    role: 0,
    description: "تحميل يوتيوب سريع جداً (مثل تيك توك)",
    category: "media",
    guide: { en: ".yot [اسم الفيديو]" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const query = args.join(" ");

    if (!query) return api.sendMessage("⚠️ | يا **Maestro**، اكتب شنو بغيتي نقلب ليك!", threadID, messageID);

    try {
      api.sendMessage("🔍 | جاري البحث السريع...", threadID, messageID);

      const search = await yts(query);
      // كنجيبو فقط الفيديوهات اللي قل من 6 دقايق لضمان السرعة
      const videos = search.videos.filter(v => v.seconds <= 360).slice(0, 6);

      if (videos.length === 0) return api.sendMessage("❌ | مالقيت حتى فيديو قصير.", threadID, messageID);

      const dir = path.join(__dirname, "cache");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      let msg = "[ 𝐘𝐮𝐚𝐧 𝐒𝐲𝐬𝐭𝐞𝐦 - 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 ]\n━━━━━━━━━━━━━━━\n";
      let attachments = [];
      let videoData = [];

      for (let i = 0; i < videos.length; i++) {
        const v = videos[i];
        msg += `${i + 1}. 🎬 ${v.title}\n⏱️ ${v.timestamp}\n━━━━━━━━━━━━━━━\n`;
        
        const imgPath = path.join(dir, `yot_${i}_${senderID}.jpg`);
        const res = await axios.get(v.thumbnail, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, Buffer.from(res.data));
        attachments.push(fs.createReadStream(imgPath));
        
        videoData.push({ title: v.title, url: v.url });
      }

      api.sendMessage({ body: msg + "📌 | رد برقم الفيديو!", attachment: attachments }, threadID, (err, info) => {
        // مسح الصور فوراً لتجنب الثقل
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
      api.sendMessage("🥹 | خطأ في البحث، جرب مرة أخرى.", threadID, messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, messageID, senderID, body } = event;
    if (senderID !== Reply.author) return;

    const choice = parseInt(body);
    if (isNaN(choice) || choice < 1 || choice > Reply.videoList.length) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return;
    }

    const selected = Reply.videoList[choice - 1];

    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);
      api.unsendMessage(Reply.messageID); // حذف قائمة الصور فوراً
      
      api.sendMessage(`⏳ | جاري التحميل بنظام تيك توك السريع...`, threadID, messageID);

      // 🚀 سيرفر Abtas المباشر (الأفضل حالياً)
      const res = await axios.get(`https://api.abtas.my.id/api/ytmp4?url=${encodeURIComponent(selected.url)}`);
      const videoUrl = res.data.result.url;

      if (!videoUrl) throw new Error("No URL found");

      const vidPath = path.join(__dirname, "cache", `yot_${senderID}.mp4`);
      const vidBuffer = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(vidPath, Buffer.from(vidBuffer.data));

      global.GoatBot.onReply.delete(Reply.messageID);
      api.setMessageReaction("✅", messageID, () => {}, true);

      api.sendMessage({
        body: `🎥 | تفضل الفيديو ديالك يا Maestro!\n📌 ${selected.title}`,
        attachment: fs.createReadStream(vidPath)
      }, threadID, () => fs.unlinkSync(vidPath), messageID);

    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage("❌ | هاد الفيديو فيه حماية عالية، جرب فيديو آخر.", threadID, messageID);
    }
  }
};
