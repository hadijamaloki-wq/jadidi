const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "2.0.0",
    author: "Amine (𝐀𝐥𝐞𝐧)",
    countDown: 5,
    role: 0,
    shortDescription: { en: "عرض قائمة الأوامر الأنيقة" },
    longDescription: { en: "عرض قائمة كافة الأوامر المتوفرة في البوت بتنسيق عصري" },
    category: "info",
    guide: { en: "{pn} | {pn} <اسم الأمر>" },
  },

  onStart: async function ({ message, args, event, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    // إذا لم يكتب المستخدم شيئاً بعد أمر help
    if (args.length === 0) {
      const categories = {};

      // تجميع الأوامر حسب الفئات مع مراعاة الصلاحيات
      for (const [name, cmd] of commands) {
        // تخطي الأوامر التي لا يملك المستخدم صلاحيتها
        if (cmd.config.role > role) continue;

        const category = cmd.config.category || "General";
        if (!categories[category]) categories[category] = [];
        categories[category].push(name);
      }

      let msg = `─── ⋆⭐ **𝕮𝖍𝖔𝖈𝖔𝖑𝖆𝖙𝖊 𝕼𝖚𝖊𝖊𝖓** ⭐ ⋆ ───\n\n`;

      for (const category in categories) {
        const categoryUpper = category.toUpperCase();
        const icon = getCategoryIcon(categoryUpper);

        msg += `╭───────────━━━━━━━───╮\n`;
        msg += `  ┃ ${icon} **${categoryUpper}**\n`;
        msg += `  ┃ ───────────\n`;

        const sortedCmds = categories[category].sort();
        // عرض الأوامر في أعمدة (3 لكل سطر) لتحسين التنسيق
        for (let i = 0; i < sortedCmds.length; i += 3) {
          const chunk = sortedCmds.slice(i, i + 3).map(c => `\`${c}\``).join(" • ");
          msg += `  ┃ ◈ ${chunk}\n`;
        }
        msg += `╰───────────━━━━━━━───╯\n\n`;
      }

      msg += `┌─── ⋆ 👤 **𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥 𝗜𝗡𝗙𝗢** ⋆ ───┐\n`;
      msg += `      **Name:** Amine (𝐀𝐥𝐞𝐧)\n`;
      msg += `      **Commands:** ${commands.size} Total\n`;
      msg += `      **FB:** m.me/Sh4n.Dev1\n`;
      msg += `└───────────────────────────┘\n\n`;
      msg += `> 💡 اكتب \`${prefix}help [اسم الأمر]\` للتفاصيل.`;

      return message.reply({ body: msg });
    }

    // مساعدة أمر محدد
    const commandName = args[0].toLowerCase();
    const cmd = commands.get(commandName) || commands.get(aliases.get(commandName));

    if (!cmd) {
      return message.reply(`❌ | لم أجد أمراً بهذا الاسم: "${commandName}"`);
    }

    // التحقق من صلاحية المستخدم للأمر قبل عرض التفاصيل
    if (cmd.config.role > role) {
      return message.reply(`⛔ | هذا الأمر مخصص لـ ${cmd.config.role === 1 ? "إداريي المجموعة" : "المطور"} فقط.`);
    }

    const config = cmd.config;
    const roleText = config.role === 0 ? "الجميع" : config.role === 1 ? "إداريي المجموعة" : "المطور فقط";
    const guideText = config.guide?.en ? config.guide.en.replace(/\{pn\}/g, config.name) : "";

    const helpDetail = `╭── ⟨ 📋 **DETAILS** ⟩ ───⭓\n` +
      `│ 💠 **الاسم:** ${config.name}\n` +
      `│ 💠 **الفئة:** ${config.category}\n` +
      `│ 💠 **الوصف:** ${config.longDescription?.en || "لا يوجد وصف"}\n` +
      `│ 💠 **الصلاحية:** ${roleText}\n` +
      `│ 💠 **الانتظار:** ${config.countDown || 1} ثانية\n` +
      `├── ⟨ 🚀 **USAGE** ⟩\n` +
      `│ 💡 \`${prefix}${config.name} ${guideText}\`\n` +
      `╰━━━━━━━━━━━━━━❖`;

    await message.reply(helpDetail);
  },
};

// دالة لإضافة أيقونات تلقائية حسب الفئة
function getCategoryIcon(category) {
  const icons = {
    "INFO": "ℹ️",
    "BOX CHAT": "👥",
    "OWNER": "🛡️",
    "ADMIN": "👑",
    "GAME": "🎮",
    "FUN": "🎡",
    "IMAGE": "🎨",
    "ECONOMY": "💰",
    "UTILITY": "🛠️",
    "MEDIA": "🎬",
    "GENERAL": "📁"
  };
  return icons[category] || "💠";
                                                          }
