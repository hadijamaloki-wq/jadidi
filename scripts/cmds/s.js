// مخزن عالمي لإدارة الفواصل الزمنية لكل مجموعة
if (!global.s_loops) global.s_loops = {};

module.exports = {
  config: {
    name: "s",
    aliases: ["سبام"], // قمت بتغيير الاختصار ليكون احترافياً
    version: "2.5.0",
    author: "Amin", // اسمك يا بطل
    link: "https://www.facebook.com/profile.php?id=61578796876651",
    role: 2, // مخصص للمطور فقط
    description: "إرسال رسالة متكررة بفاصل زمني محدد مع تفاعل صامت",
    category: "system",
    guide: {
      en: ".s [المدة بالثواني] [الرسالة] - لبدء الإرسال\n.s off - لإيقاف الإرسال"
    },
    countDown: 0
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const myUID = "61578796876651"; // آيدي الخاص بك

    // حماية الحقوق الخاصة بك (Amin)
    const obfuscatedAuthor = String.fromCharCode(65, 109, 105, 110); 
    if (module.exports.config.author.trim() !== obfuscatedAuthor) {
      return api.sendMessage("❌ | لا يمكنك تغيير حقوق المطور أمين.", threadID, messageID);
    }

    // حماية إضافية: أنت فقط من يستطيع استخدام هذا الأمر
    if (senderID !== myUID) return;

    // 1. خيار الإيقاف (.s off)
    if (args[0] === "off") {
      if (global.s_loops[threadID]) {
        clearInterval(global.s_loops[threadID]);
        delete global.s_loops[threadID];
        // تفاعل الصح عند الإيقاف بنجاح
        return api.setMessageReaction("✅", messageID, () => {}, true);
      }
      return; // إذا لم يكن هناك سبام شغال، لا تفعل شيئاً
    }

    // 2. تحليل الوقت والرسالة
    let delayInSeconds = parseInt(args[0]);
    let messageText;

    // إذا لم يكتب رقماً، نجعل الوقت الافتراضي 15 ثانية
    if (isNaN(delayInSeconds)) {
      delayInSeconds = 15;
      messageText = args.join(" ").trim();
    } else {
      messageText = args.slice(1).join(" ").trim();
    }

    // التحقق من وجود نص للسبام
    if (!messageText) return;

    // تحويل الثواني إلى ميلي ثانية
    const delayMs = delayInSeconds * 1000;

    // 🛡️ حماية الكوكيز: منع الإرسال بأقل من ثانية
    if (delayMs < 1000) {
      return api.sendMessage("⚠️ | يا **Maestro**، خلي الوقت على الأقل ثانية وحدة (1) باش فيسبوك ما يحظرش البوت.", threadID);
    }

    // 3. مسح أي حلقة قديمة تعمل في نفس المجموعة حتى لا تتداخل
    if (global.s_loops[threadID]) clearInterval(global.s_loops[threadID]);

    // التفاعل بعلامة الصح ✅ كدليل على بدء العملية (بدون إرسال رسالة تفضح البوت)
    api.setMessageReaction("✅", messageID, () => {}, true);

    // 4. بدء حلقة الإرسال (Loop)
    global.s_loops[threadID] = setInterval(() => {
      api.sendMessage(messageText, threadID, (err) => {
        if (err) {
          // إذا حدث خطأ (مثل حظر البوت أو خروجه)، يتم إيقاف الحلقة تلقائياً
          clearInterval(global.s_loops[threadID]);
          delete global.s_loops[threadID];
        }
      });
    }, delayMs);
  }
};
