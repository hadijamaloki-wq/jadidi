const { getPrefix } = global.utils;
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "help",
    version: "4.0.0",
    author: "Alen (Maestro)",
    countDown: 5,
    role: 0,
    shortDescription: { en: "قائمة الأوامر الذكية" },
    longDescription: { en: "عرض قائمة الأوامر بتنسيق Cyber احترافي" },
    category: "info",
    guide: { en: "{pn} | {pn} [اسم الأمر]" }
  },

  onStart: async function ({ message, args, event }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);
    const { commands } = global.GoatBot;
    const allCmds = Array.from(commands.values());

    // --- 1. حالة طلب شرح أمر معين (الذكاء الاصطناعي) ---
    if (args[0] && isNaN(args[0])) {
      let input = args[0].toLowerCase();
      let cmdName = input.startsWith(prefix) ? input.slice(prefix.length) : input;
      let cmd = commands.get(cmdName) || commands.get(global.GoatBot.aliases.get(cmdName));

      if (!cmd) return message.reply(`❌ | عذراً يا Maestro، لامر "${cmdName}" مكاينش في السيستيم.`);

      const { config } = cmd;
      const access = config.role === 1 ? "إداريي المجموعة 🛡️" : config.role === 2 ? "مطور البوت 👑" : "جميع الأعضاء 👥";
      
      let detail = `┏━━━༻ 🛠️ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ༺━━━┓\n`;
      detail += `┃ ◈ **الاسم:** ${config.name}\n`;
      detail += `┃ ◈ **الوصف:** ${translateCommandName(config.name)}\n`;
      detail += `┃ ◈ **الصلاحية:** ${access}\n`;
      detail += `┃ ◈ **الانتظار:** ${config.countDown || 5} ثواني\n`;
      detail += `┃ ◈ **الاستخدام:** ${prefix}${config.name} ${config.guide?.en || ""}\n`;
      detail += `┗━━━━━━━━━━━━━━━━┛`;
      return message.reply(detail);
    }

    // --- 2. حالة القائمة الرئيسية (التنظيم العصري بالأصناف) ---
    const categories = {};
    allCmds.forEach(cmd => {
      const cat = (cmd.config.category || "أخرى").toUpperCase();
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd.config.name);
    });

    let msg = `┏━━━━━━━┅┅┄┄⟞\n`;
    msg += `┃  ◈ 𝐘𝐔𝐀𝐍 𝐒𝐘𝐒𝐓𝐄𝐌 ◈  \n`;
    msg += `┗━━━━━━━┅┅┄┄⟞\n\n`;

    msg += `┏━━━༻ 👤 𝐈𝐍𝐅𝐎 ༺━━━┓\n`;
    msg += `┃ ✧ **المطور:** Alen (Maestro)\n`;
    msg += `┃ ✧ **الأوامر:** ${allCmds.length}\n`;
    msg += `┃ ✧ **البادئة:** [ ${prefix} ]\n`;
    msg += `┗━━━━━━━━━━━━━━━━┛\n\n`;

    for (let cat in categories) {
      msg += `┌───⊷ 【 ${cat} 】\n`;
      msg += `│ ✦ ${categories[cat].join(" • ")}\n`;
      msg += `└──────────────⦿\n\n`;
    }

    msg += `┏━━━━━━━━━━━━━━━━┓\n`;
    msg += `┃ 💡 اكتب [ ${prefix}help + اسم الأمر ] للشرح\n`;
    msg += `┃ ✨ 𝕮𝖍𝖔𝖈𝖔𝖑𝖆𝖙𝖊 𝕼𝖚𝖊𝖊𝖓 Edition\n`;
    msg += `┗━━━━━━━━━━━━━━━━┛`;

    return message.reply(msg);
  }
};

// وظيفة الترجمة الذكية (باش يبقا البوت ديالك مفهوم)
function translateCommandName(name) {
  const translations = {
    "yot": "تحميل من يوتيوب (سريع)",
    "tik": "تحميل من تيك توك",
    "anisearch": "بحث أنمي ومانهوا (فيديو)",
    "help": "قائمة المساعدة والتحكم",
    "rank": "مستوى التفاعل والترتيب",
    "restart": "إعادة تشغيل السيستيم",
    "uptime": "وقت تشغيل البوت",
    "work": "العمل لجمع العملات",
    "bank": "النظام المصرفي للجروب"
  };
  return translations[name.toLowerCase()] || "أمر مبرمج في نظام يوان";
}
