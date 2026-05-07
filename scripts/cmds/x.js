const axios = require("axios");

module.exports = {
  config: {
    name: "x",
    version: "2.2.0",
    author: "Amine (Alen) & Improved",
    countDown: 2,
    role: 2,
    shortDescription: { en: "حماية اسم وصورة الجروب بقوة" },
    category: "حماية",
    guide: { en: ".x on | .x off" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID } = event;

    if (args[0] === "on") {
      try {
        const info = await api.getThreadInfo(threadID);
        let imageBuffer = null;

        // إذا توجد صورة، حمّلها كمخزن
        if (info.imageSrc) {
          try {
            const res = await axios.get(info.imageSrc, { responseType: "arraybuffer" });
            imageBuffer = Buffer.from(res.data);
          } catch (e) {
            // فشل تحميل الصورة، سنخزن الرابط فقط كخيار ثانوي
          }
        }

        global.GoatBot.x_protect = global.GoatBot.x_protect || {};
        global.GoatBot.x_protect[threadID] = {
          name: info.threadName || "Unnamed Group",
          imageSrc: info.imageSrc || null,
          imageBuffer: imageBuffer,  // المخزن الاحتياطي
        };

        return message.reply("✅ تم تفعيل حماية الجروب الشاملة\n(الاسم والصورة)\nفقط المطور يقدر يغير.");
      } catch (error) {
        return message.reply("❌ فشل تفعيل الحماية: " + error.message);
      }
    }

    if (args[0] === "off") {
      if (global.GoatBot.x_protect?.[threadID]) {
        delete global.GoatBot.x_protect[threadID];
      }
      return message.reply("✅ تم إيقاف حماية الجروب الشاملة.");
    }
  },

  onEvent: async function ({ api, event }) {
    const { threadID, logMessageType, logMessageData, author } = event;
    const protect = global.GoatBot.x_protect?.[threadID];
    if (!protect) return;

    const botID = api.getCurrentUserID();
    if (author === botID) return;

    const isBotAdmin = global.config.adminBot.includes(author);

    // ==================== حماية اسم الجروب ====================
    // حدث تغيير الاسم (قد يختلف حسب المكتبة: thread_name أو log:thread-name)
    if (logMessageType === "thread_name" || logMessageType === "log:thread-name") {
      if (isBotAdmin) {
        // المطور غيره → حدث الحفظ
        protect.name = logMessageData?.name || logMessageData?.threadName || "Unknown";
      } else {
        // شخص آخر → استرجاع الاسم فوراً
        setTimeout(() => {
          api.setTitle(protect.name, threadID).catch(() => {});
        }, 300);
      }
    }

    // ==================== حماية صورة الجروب ====================
    // حدث تغيير الأيقونة (thread_icon أو log:thread-icon)
    if (logMessageType === "thread_icon" || logMessageType === "log:thread-icon") {
      if (isBotAdmin) {
        // محاولة تحديث الصورة الجديدة من الحدث
        const newSrc = logMessageData?.thread_icon_url || logMessageData?.image_src || null;
        if (newSrc) {
          protect.imageSrc = newSrc;
          // جلب الصورة كمخزن للاحتياط
          try {
            const res = await axios.get(newSrc, { responseType: "arraybuffer" });
            protect.imageBuffer = Buffer.from(res.data);
          } catch (e) {}
        }
      } else {
        // استرجاع الصورة القديمة
        if (protect.imageBuffer) {
          // نستخدم المخزن أولاً (أسرع وأضمن)
          for (let i = 0; i < 3; i++) {
            try {
              await api.changeGroupImage(protect.imageBuffer, threadID);
              break;
            } catch (e) {
              await new Promise(r => setTimeout(r, 800));
            }
          }
        } else if (protect.imageSrc) {
          // لو المخزن فشل، نجرب الرابط
          for (let i = 0; i < 2; i++) {
            try {
              const res = await axios.get(protect.imageSrc, { responseType: "stream", timeout: 10000 });
              await api.changeGroupImage(res.data, threadID);
              break;
            } catch (e) {
              await new Promise(r => setTimeout(r, 1000));
            }
          }
        }
      }
    }
  }
};
