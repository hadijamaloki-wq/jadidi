const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "tik",
    aliases: ["tiktok", "تيك", "تيكتوك"],
    version: "1.1.0",
    author: "Amin",
    link: "https://www.facebook.com/profile.php?id=61578796876651",
    role: 0,
    description: "البحث في تيك توك واختيار فيديو لتحميله (6 نتائج)",
    category: "media",
    guide: {
      en: ".tik [كلمة البحث]"
    },
    countDown: 5
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const query = args.join(" ");

    if (!query) {
      return api.sendMessage("⚠️ | يا **Maestro**، اكتب شنو بغيتي نقلب ليك في تيك توك!\nمثال: .tik Lookism edit", threadID, messageID);
    }

    try {
      api.sendMessage("🔍 | جاري البحث في تيك توك، تسنى شوية...", threadID, messageID);

      // البحث عن الفيديوهات باستخدام API
      const searchUrl = `https://api.tiklydown.eu.org/api/main/search?q=${encodeURIComponent(query)}`;
      const response = await axios.get(searchUrl);
      const videos = response.data.result.slice(0, 6); // أخذ أول 6 نتائج

      if (!videos || videos.length === 0) {
        return api.sendMessage("❌ | مالقيت حتى نتيجة في تيك توك، جرب تبدل الكلمات.", threadID, messageID);
      }

      const dir = path.join(__dirname, "cache");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      let msg = "[ 𝐘𝐮𝐚𝐧 𝐒𝐲𝐬𝐭𝐞𝐦 - 𝐓𝐢𝐤𝐓𝐨𝐤 𝐒𝐞𝐚𝐫𝐜𝐡 ]\n━━━━━━━━━━━━━━━\n";
      let attachments = [];
      let videoData = [];

      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        msg += `${i + 1}. 👤 ${video.author.nickname}\n📝 ${video.title.substring(0, 50)}...\n━━━━━━━━━━━━━━━\n`;
        
        const imgPath = path.join(dir, `tik_thumb_${i}.jpg`);
        const imgRes = await axios.get(video.cover, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, Buffer.from(imgRes.data));
        attachments.push(fs.createReadStream(imgPath));
        
        videoData.push({
          title: video.title,
          url: video.url 
        });
      }

      msg += "📌 | **رد على هاد الرسالة برقم الفيديو باش نحملو ليك بلا علامة مائية!**";

      api.sendMessage(
        { body: msg, attachment: attachments },
        threadID,
        (err, info) => {
          // تنظيف الصور من الكاش
          attachments.forEach((_, i) => {
             const p = path.join(dir, `tik_thumb_${i}.jpg`);
             if (fs.existsSync(p)) fs.unlinkSync(p);
          });

          if (!err) {
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: senderID,
              videoList: videoData
            });
          }
        },
        messageID
      );

    } catch (error) {
      console.error(error);
      api.sendMessage("🥹 | حدث خطأ أثناء البحث، جرب لاحقاً.", threadID, messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, messageID, senderID, body } = event;

    if (senderID !== Reply.author) {
      return api.sendMessage("⚠️ | هاد القائمة ماشي ديالك يا بطل!", threadID, messageID);
    }

    const choice = parseInt(body);
    if (isNaN(choice) || choice < 1 || choice > Reply.videoList.length) {
      return api.sendMessage("❌ | اختار رقم صحيح من 1 لـ " + Reply.videoList.length, threadID, messageID);
    }

    const selectedVideo = Reply.videoList[choice - 1];

    try {
      api.sendMessage(`⏳ | جاري تحميل فيديو تيك توك بدون علامة مائية...`, threadID, messageID);

      const dlUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(selectedVideo.url)}`;
      const dlRes = await axios.get(dlUrl);
      const videoDirectUrl = dlRes.data.result.video.noWatermark; 

      const vidPath = path.join(__dirname, "cache", `tik_video_${senderID}.mp4`);
      const vidRes = await axios.get(videoDirectUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(vidPath, Buffer.from(vidRes.data));

      // مسح من قائمة الردود بعد الاختيار
      const index = global.client.handleReply.findIndex(e => e.messageID === Reply.messageID);
      if (index !== -1) global.client.handleReply.splice(index, 1);

      api.sendMessage(
        {
          body: `🎬 | تيك توك جاهز!\n👤 المطور: Amin\n🔗 حسابي: ${module.exports.config.link}`,
          attachment: fs.createReadStream(vidPath)
        },
        threadID,
        () => {
            if (fs.existsSync(vidPath)) fs.unlinkSync(vidPath);
        },
        messageID
      );

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ | فشل تحميل الفيديو من تيك توك، جرب فيديو آخر.", threadID, messageID);
    }
  }
};
