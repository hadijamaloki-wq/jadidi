// مخزن عالمي لإدارة الفواصل الزمنية لكل مجموعة
if (!global.s_loops) global.s_loops = {};

module.exports.config = {
  name: "s",
  aliases: ["s", "نيڪمو"],
  version: "2.0.0",
  author: "Hanji & Gemini",
  role: 2, // للمسؤولين فقط لتجنب الحظر
  description: { en: "إرسال رسالة متكررة بفاصل زمني محدد" },
  category: "tools",
  guide: {
    en: "{pn} [المدة بالثواني] [الرسالة] - لبدء الإرسال\n{pn} off - لإيقاف الإرسال"
  },
  countDown: 0
};

module.exports.onStart = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  // 1. خيار الإيقاف
  if (args[0] === "off") {
    if (global.s_loops[threadID]) {
      clearInterval(global.s_loops[threadID]);
      delete global.s_loops[threadID];
      return api.sendMessage("تم الإيقاف 『༗』", threadID, messageID);
    }
    return api.sendMessage("『♔︎』", threadID, messageID);
  }

  // 2. تحليل الوقت والرسالة
  let delayInSeconds = parseInt(args[0]);
  let messageText;

  if (isNaN(delayInSeconds)) {
    // إذا لم يكتب رقماً، نستخدم الافتراضي (15 ثانية) ونعتبر كل الكلام هو الرسالة
    delayInSeconds = 15;
    messageText = args.join(" ").trim();
  } else {
    // إذا كتب رقماً، نأخذ باقي الأجزاء كرسالة
    messageText = args.slice(1).join(" ").trim();
  }

  // التحقق من وجود نص
  if (!messageText) {
    return api.sendMessage("❌ يرجى كتابة الرسالة التي تريد تكرارها بعد تحديد الوقت.\nمثال: .s 10 هلا بالشباب", threadID, messageID);
  }

  // تحويل الثواني إلى ميلي ثانية
  const delayMs = delayInSeconds * 1000;

  // منع السبام السريع جداً لحماية الحساب (أقل من ثانية واحدة غير مسموح)
  if (delayMs < 1000) {
    return api.sendMessage("🌚.", threadID, messageID);
  }

  // 3. مسح أي حلقة قديمة تعمل في نفس المجموعة
  if (global.s_loops[threadID]) clearInterval(global.s_loops[threadID]);

  api.sendMessage(`✅ تم بدء الإرسال التلقائي كل ${delayInSeconds} ثانية.\n📝 الرسالة: "${messageText}"\n\nللإيقاف أرسل: .s off`, threadID);

  // 4. بدء حلقة الإرسال
  global.s_loops[threadID] = setInterval(() => {
    api.sendMessage(messageText, threadID, (err) => {
      if (err) {
        // إذا حدث خطأ (مثل حظر مؤقت)، يتم إيقاف الحلقة تلقائياً
        clearInterval(global.s_loops[threadID]);
        delete global.s_loops[threadID];
      }
    });
  }, delayMs);
};

