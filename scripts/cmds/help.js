const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "help",
    version: "3.5.0",
    author: "Amine (𝐀𝐥𝐞𝐧)",
    countDown: 5,
    role: 0,
    shortDescription: { en: "قائمة الأوامر الصافية" },
    longDescription: { en: "عرض قائمة الأوامر بتنسيق صافي مع شرح ذكي" },
    category: "info",
    guide: { en: "{pn} | {pn} <رقم الصفحة> | {pn} <اسم الأمر>" }
  },

  onStart: async function ({ message, args, event }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);
    const { commands } = global.GoatBot;
    const allCmds = Array.from(commands.values());

    // --- عرض القائمة الرئيسية (الصفحات) ---
    if (args.length === 0 || !isNaN(args[0])) {
      const page = parseInt(args[0]) || 1;
      const cmdsPerPage = 15;
      const totalPages = Math.ceil(allCmds.length / cmdsPerPage);

      if (page < 1 || page > totalPages) return message.reply(`❌ لا توجد صفحة رقم ${page}`);

      let msg = `👑 **𝕮𝖍𝖔𝖈𝖔𝖑𝖆𝖙𝖊 𝕼𝖚𝖊𝖊𝖓** 🍫\n\n`;
      const start = (page - 1) * cmdsPerPage;
      const paginated = allCmds.slice(start, start + cmdsPerPage);

      paginated.forEach((cmd, index) => {
        const num = start + index + 1;
        const translated = translateCommandName(cmd.config.name);
        msg += `【${num}】 ${cmd.config.name} ➪ ${translated}\n\n`;
      });

      msg += `✨ الصفحة ${page} من ${totalPages}\n`;
      msg += `👤 المطور: Amine (Alen)\n`;
      msg += `🔗 https://www.facebook.com/profile.php?id=61578796876651\n\n`;
      msg += `💡 اطلب الصفحة التالية: ${prefix}help ${page + 1}`;

      return message.reply(msg);
    }

    // --- عرض تفاصيل الأمر (تعديل ذكي وتلقائي لكل الأوامر) ---
    let input = args[0].toLowerCase();
    let commandName = input.startsWith(prefix) ? input.slice(prefix.length) : input;
    let cmd = commands.get(commandName) || commands.get(global.GoatBot.aliases.get(commandName));

    if (!cmd) return message.reply(`❌ هاد لامر "${commandName}" مكاينش.`);

    const { config } = cmd;
    
    // إصلاح مشكلة الـ undefined في الوقت
    const waitTime = config.countDown || config.wait || 5;
    
    // تحويل الصلاحية للعربي
    const access = config.role === 1 ? "إداريي المجموعة" : config.role === 2 ? "مطور البوت" : "جميع الأعضاء";
    
    // تبسيط طريقة الاستخدام تلقائياً
    let usage = config.guide?.en || config.guide || "اكتب اسم الأمر فقط";
    usage = usage.replace(/\{pn\}/g, prefix + config.name)
                 .replace(/\{p\}/g, prefix)
                 .split("\n")[0]; // نأخذ أول سطر فقط للتبسيط

    let detail = `📋 تفاصيل: ${config.name}\n\n`;
    detail += `💠 الوصف: ${translateCommandName(config.name)}\n`;
    detail += `💠 الصلاحية: ${access}\n`;
    detail += `💠 الانتظار: ${waitTime} ثواني\n\n`;
    detail += `🚀 الاستخدام المبسط:\n${usage}`;

    return message.reply(detail);
  }
};

// وظيفة الترجمة الذكية
function translateCommandName(name) {
  const translations = {
    "wp": "بحث عن خلفيات بجودة عالية",
    "help": "إظهار قائمة الأوامر والمساعدة",
    "tik": "تحميل فيديوهات تيك توك بدون علامة مائية",
    "rank": "عرض رتبتك ومستوى تفاعلك",
    "kick": "طرد عضو من المجموعة",
    "ban": "حظر عضو من استخدام البوت",
    // سأضيف لك أهم الأوامر هنا والباقي سيظهر كـ "أمر البوت"
    "accept": "قبول", "activemember": "الأعضاء النشطين", "adduser": "إضافة عضو", "all": "تاغ للجميع",
    "anti": "مضاد السبام", "onlyadminbox": "الأدمن فقط", "addo": "إضافة أونر", "file": "ملف",
    "adminonly": "للأدمن فقط", "admins": "قائمة الأدمن", "admin": "الأدمن", "ads": "إعلانات",
    "kiss": "بوسة", "affect": "تأثير", "akinator": "أكيناتور", "album": "ألبوم", "amv": "فيديو أنمي",
    "autodl": "تحميل تلقائي", "apimarket": "متجر API", "appstore": "متجر التطبيقات", "arrest": "اعتقال",
    "avatar": "صورة بروفايل", "bed": "سرير", "colorize": "تلوين", "moon": "قمر", "profile": "بروفايل",
    "searchimage": "بحث صور", "slap": "كف", "trash": "زبالة", "trigger": "غاضب",
    "art": "فن", "autosetname": "تغيير اسم تلقائي", "badwords": "كلمات ممنوعة",
    "boxinfo": "معلومات المجموعة", "busy": "مشغول", "count": "عدد الرسائل", "filteruser": "فلترة",
    "gay": "نسبة المثلية", "refresh": "تحديث", "rules": "القوانين", "sendnoti": "إشعار",
    "setname": "تغيير اسم", "unsend": "حذف رسالة", "warn": "تحذير", "audio": "صوت", "restart": "إعادة تشغيل",
    "update": "تحديث", "balance": "الرصيد", "bank": "البنك", "top": "الأوائل", "work": "عمل",
    "daily": "يومي", "ball": "كرة 8", "joke": "نكتة", "meme": "ميمز", "rps": "حجرة مقص",
    "ship": "توفيق", "hug": "حضن", "dice": "نرد", "quiz": "اختبار", "ttt": "إكس أو", "slot": "قمار",
    "imagine": "تخيل صورة", "gen": "توليد", "midjourney": "ميدجورني", "translate": "ترجمة",
    "qr": "رمز QR", "say": "تكلم", "song": "أغنية", "lyrics": "كلمات أغنية",
    "uptime": "مدة التشغيل", "uid": "آيدي العضو", "tid": "آيدي المجموعة", "prefix": "البادئة"
  };
  return translations[name.toLowerCase()] || "أمر خاص بالبوت";
}
