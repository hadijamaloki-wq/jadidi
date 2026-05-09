const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const yts = require("yt-search");

module.exports = {
  config: {
    name: "yot",
    aliases: ["يوت", "yt"],
    version: "2.0.0",
    author: "Amin",
    role: 0,
    description: "تحميل يوتيوب بسيرفر سريع (أقل من 6 دقائق)",
    category: "media",
    guide: { en: ".yot [اسم الفيديو]" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const query = args.join(" ");

    if (!query) return api.sendMessage("⚠️ | يا **Maestro**، قولي شنو بغيتي نقلب ليك في يوتيوب!", threadID, messageID);

    try {
      api.sendMessage("🔍 | جاري البحث عن أفضل النتائج القصيره...", threadID, messageID);

      const search = await yts(query);
      // فلتر صارم: فيديوهات قل من 6 دقايق وماشي بث مباشر
      const videos = search.videos.filter(v => v.seconds <= 360 && v.type === 'video').slice(0, 6);

      if (videos.length === 0) return api.sendMessage("❌ | مالقيت حتى فيديو قصير بهاد السمية، جرب كلمات أخرى.", threadID, messageID);

      const dir = path.join(__dirname, "cache");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      let msg = "[ 𝐘𝐮𝐚𝐧 𝐒𝐲𝐬𝐭𝐞𝐦 - 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 ]\n━━━━━━━━━━━━━━━\n";
      let attachments = [];
      let videoData = [];

      for (let i = 0; i < videos.length; i++) {
        const v = videos[i];
        msg += `${i + 1}. 🎬 ${v.title}\n⏱️ المده: ${v.timestamp}\n━━━━━━━━━━━━━━━\n`;
        
        const imgPath = path.join(dir, `yot_${i}_${senderID}.jpg`);
        const res = await axios.get(v.thumbnail, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, Buffer.from(res.data));
        attachments.push(fs.createReadStream(imgPath));
        
        videoData.push({ title: v.title, url: v.url });
      }

      msg += "📌 | رد برقم الفيديو (1-6) باش نحملو ليك!";

      api.sendMessage({ body: msg, attachment: attachments }, threadID, (err, info) => {
        // حذف الصور فوراً بعد الإرسال لتوفير المساحة
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
      api.sendMessage("🥹 | كاين ضغط على البحث، جرب مرة أخرى.", threadID, messageID);
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
      api.unsendMessage(Reply.messageID); // مسح قائمة الـ 6 صور

      // 🚀 سيرفر جديد (Vaxer) معروف بالسرعة في يوتيوب
      const res = await axios.get(`https://api.vaxer.my.id/api/v1/ytmp4?url=${encodeURIComponent(selected.url)}`);
      
      // تأكد من جلب الرابط الصحيح من الـ API
      const videoLink = res.data.data.url || res.data.data.download; 

      if (!videoLink) throw new Error("Link not found");

      const vidPath = path.join(__dirname, "cache", `yot_v_${senderID}.mp4`);
      const vidRes = await axios.get(videoLink, { responseType: "arraybuffer" });
      fs.writeFileSync(vidPath, Buffer.from(vidRes.data));

      global.GoatBot.onReply.delete(Reply.messageID);
      api.setMessageReaction("✅", messageID, () => {}, true);

      api.sendMessage({
        body: `🎥 | هاهو الفيديو ديالك يا Maestro!\n📌 ${selected.title}`,
        attachment: fs.createReadStream(vidPath)
      }, threadID, () => {
          if (fs.existsSync(vidPath)) fs.unlinkSync(vidPath);
      }, messageID);

    } catch (error) {
      console.error(error);
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage("❌ | هاد السيرفر عيان دابا، غنجرب واحد آخر...\n(جرب تعاود الأمر مرة أخرى، غالباً غيخدم)", threadID, messageID);
    }
  }
};
