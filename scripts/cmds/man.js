const axios = require('axios');

module.exports = {
  config: {
    name: "man",
    version: "2.2.0",
    role: 0,
    author: "Maestro",
    description: "قراءة المانغا والمانهوا (20 صفحة لفيسبوك لايت)",
    category: "media",
    guide: "{pn} [الاسم] [رقم الفصل]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    
    const chapterNum = args.pop(); 
    const mangaName = args.join(" ");

    if (!mangaName || isNaN(chapterNum)) {
      return api.sendMessage("❌ الطريقة: .man lookism 400", threadID, messageID);
    }

    try {
      api.sendMessage(`📖 كنقلب على ${mangaName} فصل ${chapterNum}...`, threadID, messageID);

      // البحث عن المانغا
      const searchRes = await axios.get(`https://api.mangadex.org/manga`, {
        params: { title: mangaName, limit: 1 }
      });

      if (searchRes.data.data.length === 0) return api.sendMessage("❌ ملقيتش هاد المانغا.", threadID, messageID);
      const mangaId = searchRes.data.data[0].id;

      // البحث عن الفصل
      const feedRes = await axios.get(`https://api.mangadex.org/manga/${mangaId}/feed`, {
        params: { translatedLanguage: ['en'], limit: 500 }
      });

      const chapter = feedRes.data.data.find(ch => ch.attributes.chapter === chapterNum);
      if (!chapter) return api.sendMessage(`❌ ملقيتش الفصل ${chapterNum}.`, threadID, messageID);

      // جلب الصور
      const server = await axios.get(`https://api.mangadex.org/at-home/server/${chapter.id}`);
      const hash = server.data.chapter.hash;
      const images = server.data.chapter.data.slice(0, 20); // ليميت 20 لفيسبوك لايت

      const attachments = [];
      for (const img of images) {
        const url = `https://uploads.mangadex.org/data/${hash}/${img}`;
        const imgStream = (await axios.get(url, { responseType: 'stream' })).data;
        attachments.push(imgStream);
      }

      const readLink = `https://mangadex.org/chapter/${chapter.id}`;
      
      return api.sendMessage({
        body: `✅ ${mangaName} | الفصل ${chapterNum}\n🖼️ عرض 20 صفحة (حماية الفيسبوك)\n🔗 كمل القراية هنا: ${readLink}`,
        attachment: attachments
      }, threadID, messageID);

    } catch (err) {
      return api.sendMessage("⚠️ وقع مشكل، جرب مرة أخرى من بعد.", threadID, messageID);
    }
  }
};
