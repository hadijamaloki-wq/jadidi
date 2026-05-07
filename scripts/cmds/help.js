const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "help",
    version: "3.3.0",
    author: "Amine (𝐀𝐥𝐞𝐧)",
    countDown: 5,
    role: 0,
    shortDescription: { en: "قائمة الأوامر الصافية" },
    longDescription: { en: "عرض قائمة الأوامر بدون خطوط أو زخارف" },
    category: "info",
    guide: { en: "{pn} | {pn} <رقم الصفحة>" }
  },

  onStart: async function ({ message, args, event, Commands }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);
    
    // محاولة ذكية: إذا لم يجد Commands يذهب لـ global.GoatBot
    const allCommands = Commands || (global.GoatBot && global.GoatBot.commands);
    
    if (!allCommands) {
        return message.reply("❌ عذراً، لم أتمكن من الوصول لمكتبة الأوامر حالياً.");
    }

    const allCmds = Array.from(allCommands.values());

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

    // تفاصيل أمر معين
    let input = args[0].toLowerCase();
    let commandName = input.startsWith(prefix) ? input.slice(prefix.length) : input;
    let cmd = allCommands.get(commandName);

    if (!cmd) return message.reply(`❌ لم أجد هذا الأمر`);

    const { config } = cmd;
    let detail = `📋 تفاصيل: ${config.name}\n\n`;
    detail += `💠 الوصف: ${translateCommandName(config.name)}\n`;
    detail += `💠 الصلاحية: ${config.role === 1 ? "الأدمن" : "الكل"}\n`;
    detail += `💠 الانتظار: ${config.countDown} ثانية\n\n`;
    detail += `🚀 الاستخدام: ${prefix}${config.name} ${config.guide?.en || ""}`;

    return message.reply(detail);
  }
};

function translateCommandName(name) {
  const translations = {
    "accept": "قبول", "activemember": "الأعضاء النشطين", "adduser": "إضافة عضو", "all": "تاغ للجميع",
    "anti": "مضاد السبام", "onlyadminbox": "الأدمن فقط", "addo": "إضافة أونر", "file": "ملف",
    "adminonly": "للأدمن فقط", "admins": "قائمة الأدمن", "admin": "الأدمن", "ads": "إعلانات",
    "kiss": "بوسة", "affect": "تأثير", "akinator": "أكيناتور", "album": "ألبوم", "amv": "فيديو أنمي",
    "autodl": "تحميل تلقائي", "apimarket": "متجر API", "appstore": "متجر التطبيقات", "arrest": "اعتقال",
    "avatar": "صورة بروفايل", "bed": "سرير", "colorize": "تلوين", "moon": "قمر", "profile": "بروفايل",
    "searchimage": "بحث صور", "slap": "كف", "trash": "زبالة", "trigger": "غاضب", "wp": "خلفية",
    "art": "فن", "autosetname": "تغيير اسم تلقائي", "badwords": "كلمات ممنوعة", "ban": "حظر",
    "boxinfo": "معلومات المجموعة", "busy": "مشغول", "count": "عدد الرسائل", "filteruser": "فلترة",
    "gay": "نسبة المثلية", "kick": "طرد", "refresh": "تحديث", "rules": "القوانين", "sendnoti": "إشعار",
    "setname": "تغيير اسم", "unsend": "حذف رسالة", "warn": "تحذير", "audio": "صوت", "restart": "إعادة تشغيل",
    "update": "تحديث", "balance": "الرصيد", "bank": "البنك", "top": "الأوائل", "work": "عمل",
    "daily": "يومي", "ball": "كرة 8", "joke": "نكتة", "meme": "ميمز", "rps": "حجرة مقص",
    "ship": "توفيق", "hug": "حضن", "dice": "نرد", "quiz": "اختبار", "ttt": "إكس أو", "slot": "قمار",
    "imagine": "تخيل صورة", "gen": "توليد", "midjourney": "ميدجورني", "translate": "ترجمة",
    "qr": "رمز QR", "say": "تكلم", "song": "أغنية", "lyrics": "كلمات أغنية", "help": "مساعدة",
    "uptime": "التشغيل", "uid": "آيدي العضو", "tid": "آيدي المجموعة", "prefix": "البادئة"
  };
  return translations[name.toLowerCase()] || "أمر البوت";
}
