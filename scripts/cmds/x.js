const axios = require("axios");

module.exports = {
  config: {
    name: "x",
    version: "3.0.0",
    author: "Amine (Alen) & Custom Build",
    countDown: 2,
    role: 2,
    shortDescription: { en: "حماية شاملة للاسم والصورة مع إمكانية تعيين اسم" },
    category: "حماية",
    guide: { en: ".x on [الاسم الجديد] | .x off" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID } = event;

    if (args[0] === "on") {
      const customName = args.slice(1).join(" ");
      if (!customName) return message.reply("💍 اكتب الاسم الجديد اللي تبيه ينحفظ، مثال:\n.x on جروب الأساطير");

      try {
        // تغيير اسم الجروب للاسم اللي كتبته
        await api.setTitle(customName, threadID);

        // حفظ الصورة الحالية كمخزن (buffer)
        let imageBuffer = null;
        try {
          const info = await api.getThreadInfo(threadID);
          if (info.imageSrc) {
            const res = await axios.get(info.imageSrc, { responseType: "arraybuffer", timeout: 10000 });
            imageBuffer = Buffer.from(res.data);
          }
        } catch (e) {
          // إذا ما قدرنا نجيب الصورة، نخلي buffer فاضي
        }

        global.GoatBot.x_protect = global.GoatBot.x_protect || {};
        global.GoatBot.x_protect[threadID] = {
          name: customName,
          imageBuffer: imageBuffer,
          imageSrc: null // اختياري
        };

        return message.reply(`✅ تم تعيين اسم الجروب المحمي: ${customName}\n🔒 الاسم والصورة مقفولين الآن.\nالمطور فقط يقدر يغيرهم.`);
      } catch (error) {
        return message.reply("❌ فشل تفعيل الحماية: " + error.message);
      }
    }

    if (args[0] === "off") {
      if (global.GoatBot.x_protect?.[threadID]) delete global.GoatBot.x_protect[threadID];
      return message.reply("✅ تم إيقاف حماية الجروب.");
    }

    return message.reply("يرجى استخدام: .x on <الاسم> | .x off");
  },

  onEvent: async function ({ api, event }) {
    const { threadID, logMessageType, logMessageData, author } = event;
    const protect = global.GoatBot.x_protect?.[threadID];
    if (!protect) return;

    const botID = api.getCurrentUserID();
    if (author === botID) return;

    const isBotAdmin = global.config.adminBot?.includes(author);

    // ================== حماية الاسم ==================
    if (logMessageType === "thread_name" || logMessageType === "log:thread-name") {
      if (isBotAdmin) {
        // المطور غير الاسم => نحدث المحفوظ
        protect.name = logMessageData?.name || logMessageData?.threadName || protect.name;
      } else {
        // غير المطور => نرجع الاسم المحفوظ فوراً
        api.setTitle(protect.name, threadID).catch(() => {});
      }
    }

    // ================== حماية الصورة ==================
    if (logMessageType === "thread_icon" || logMessageType === "log:thread-icon") {
      if (isBotAdmin) {
        // المطور غير الصورة => نجيب الصورة الجديدة ونحفظها
        try {
          const info = await api.getThreadInfo(threadID);
          if (info.imageSrc) {
            const res = await axios.get(info.imageSrc, { responseType: "arraybuffer", timeout: 10000 });
            protect.imageBuffer = Buffer.from(res.data);
          } else {
            protect.imageBuffer = null;
          }
        } catch (e) {}
      } else {
        // غير المطور => نرجع الصورة المحفوظة فوراً
        if (protect.imageBuffer) {
          // نستخدم المخزن مباشرة (أسرع وأضمن)
          for (let i = 0; i < 3; i++) {
            try {
              await api.changeGroupImage(protect.imageBuffer, threadID);
              break;
            } catch (e) {
              await new Promise(r => setTimeout(r, 600));
            }
          }
        } else {
          // لو الصورة فاضية نحذف أي صورة موجودة (نرجّع بدون صورة)
          try {
            await api.removeGroupImage(threadID);
          } catch (e) {}
        }
      }
    }
  }
};
