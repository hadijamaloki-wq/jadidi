const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const yts = require("yt-search");

module.exports = {
  config: {
    name: "yot",
    aliases: ["يوت", "reels"],
    version: "1.0.0",
    author: "Amin",
    link: "https://www.facebook.com/profile.php?id=61578796876651",
    role: 0,
    description: "البحث عن فيديوهات/ريلز يوتيوب واختيار واحد لتحميله",
    category: "media",
    guide: {
      en: ".yot [اسم الفيديو أو الريلز]"
    },
    countDown: 5
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const query = args.join(" ");

    if (!query) {
      return api.sendMessage("⚠️ | يا **Maestro**، اكتب شنو بغيتي نقلب ليك!\nمثال: .yot Lookism shorts", threadID, messageID);
    }

    try {
      api.sendMessage("🔍 | جاري البحث في يوتيوب، تسنى شوية...", threadID, messageID);

      // البحث في يوتيوب (ضفنا كلمة shorts باش يجيب الفيديوهات القصيرة قدر الإمكان)
      const searchResults = await yts(query + " shorts");
      const videos = searchResults.videos.slice(0, 6); // أخذ أول 6 نتائج فقط

      if (videos.length === 0) {
        return api.sendMessage("❌ | مالقيت حتى نتيجة، جرب تبدل الكلمات.", threadID, messageID);
      }

      const dir = path.join(__dirname, "cache");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      let msg = "[ 𝐘𝐮𝐚𝐧 𝐒𝐲𝐬𝐭𝐞𝐦 - 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 𝐒𝐞𝐚𝐫𝐜𝐡 ]\n━━━━━━━━━━━━━━━\n";
      let attachments = [];
      let videoData = [];

      // جلب الصور المصغرة (Thumbnails) وترتيب القائمة
      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        msg += `${i + 1}. 🎬 ${video.title}\n⏱️ المدة: ${video.timestamp}\n━━━━━━━━━━━━━━━\n`;
        
        const imgPath = path.join(dir, `yot_thumb_${i}.jpg`);
        const response = await axios.get(video.thumbnail, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, Buffer.from(response.data));
        attachments.push(fs.createReadStream(imgPath));
        
        videoData.push({
          title: video.title,
          url: video.url
        });
      }

      msg += "📌 | **رد على هاد الرسالة برقم الفيديو (من 1 لـ 6) باش نحملو ليك!**";

      // إرسال الرسالة مع الصور وتفعيل نظام الرد
      api.sendMessage(
        { body: msg, attachment: attachments },
        threadID,
        (err, info) => {
          // مسح الصور من السيرفر بعد إرسالها لتوفير المساحة
          attachments.forEach((_, i) => fs.unlinkSync(path.join(dir, `yot_thumb_${i}.jpg`)));

          if (!err) {
            // تسجيل الرسالة لانتظار رد المستخدم
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: senderID, // باش يجاوب غير اللي طلب الأمر
              videoList: videoData
            });
          }
        },
        messageID
      );

    } catch (error) {
      console.error(error);
      api.sendMessage("🥹 | حدث خطأ أثناء البحث، تواصل مع أمين.", threadID, messageID);
    }
  },

  // هاد الجزء كيخدم ملي كترد على رسالة البوت برقم
  onReply: async function ({ api, event, Reply }) {
    const { threadID, messageID, senderID, body } = event;

    // التأكد أن الشخص اللي رد هو نفسه اللي طلب الأمر
    if (senderID !== Reply.author) {
      return api.sendMessage("⚠️ | هاد القائمة ماشي ديالك، دير أمر .yot باش تقلب لراسك.", threadID, messageID);
    }

    const choice = parseInt(body);

    // التحقق من أن الرد عبارة عن رقم صحيح بين 1 و 6
    if (isNaN(choice) || choice < 1 || choice > Reply.videoList.length) {
      return api.sendMessage("❌ | اختار رقم صحيح من 1 لـ " + Reply.videoList.length, threadID, messageID);
    }

    const selectedVideo = Reply.videoList[choice - 1];

    try {
      api.sendMessage(`⏳ | جاري تحميل: **${selectedVideo.title}**...`, threadID, messageID);

      // تنبيه: هنا كنستعملو API خارجي مجاني لتحميل الفيديو. 
      // إذا كان عندك API خاص بك، تقدر تبدل الرابط.
      const dlApiUrl = `https://api.joshweb.click/api/yt-dlp?url=${encodeURIComponent(selectedVideo.url)}`;
      const res = await axios.get(dlApiUrl);
      
      const videoUrl = res.data.result.video; // تأكد من استجابة الـ API

      if (!videoUrl) throw new Error("لا يوجد رابط تحميل مباشر");

      const vidPath = path.join(__dirname, "cache", `yot_video_${senderID}.mp4`);
      const vidRes = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(vidPath, Buffer.from(vidRes.data));

      // إزالة الرسالة من الانتظار باش ما يعاودش يرد عليها
      const index = global.client.handleReply.findIndex(e => e.messageID === Reply.messageID);
      if (index !== -1) global.client.handleReply.splice(index, 1);

      api.sendMessage(
        {
          body: `🎥 | تفضل الفيديو ديالك!\n👤 المطور: Amin\n🔗 حسابي: ${module.exports.config.link}`,
          attachment: fs.createReadStream(vidPath)
        },
        threadID,
        () => fs.unlinkSync(vidPath),
        messageID
      );

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ | ماقديتش نحمل هاد الفيديو، يقدر يكون طويل بزاف أو فيه حقوق طبع ونشر.", threadID, messageID);
    }
  }
};
