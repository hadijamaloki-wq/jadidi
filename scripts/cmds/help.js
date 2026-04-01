const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "2.0.2",
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

    if (args.length === 0) {
      const categories = {};
      for (const [name, cmd] of commands) {
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

    // --- تعديل ذكي لمنع الخطأ الذي ظهر لك ---
    let input = args[0].toLowerCase();
    // إذا بدأ المستخدم البحث بنقطة مثل (.help .rank) سنبحث عن (rank)
    // وإذا بحث بدون نقطة (.help rank) سنبحث أيضاً عن (rank)
    let commandName = input.startsWith(prefix) ? input.slice(prefix.length) : input;

    let cmd = commands.get(commandName) || commands.get(aliases.get(commandName));

    if (!cmd) {
      return message.reply(`❌ | العفو يا أمين، لم أجد أمراً باسم: "${commandName}"`);
    }
    // ----------------------------------------

    if (cmd.config.role > role) {
      return message.reply(`⛔ | هذا الأمر مخصص لـ ${cmd.config.role === 1 ? "إداريي المجموعة" : "المطور"} فقط.`);
    }

    const config = cmd.config;
    const roleText = config.role === 0 ? "الجميع" : config.role === 1 ? "إداريي المجموعة" : "المطور فقط (𝐀𝐥𝐞𝐧)";

    let description = "لا يوجد شرح متوفر لهذا الأمر حالياً.";
    if (config.longDescription && config.longDescription.ar) {
      description = config.longDescription.ar;
    } else if (config.longDescription && config.longDescription.en) {
      description = config.longDescription.en;
    } else if (config.shortDescription && config.shortDescription.ar) {
      description = config.shortDescription.ar;
    } else if (config.shortDescription && config.shortDescription.en) {
      description = config.shortDescription.en;
    }

    const guideText = config.guide?.en ? config.guide.en.replace(/\{pn\}/g, config.name) : "لا يوجد دليل استخدام.";
    
    const helpDetail = `╭── ⟨ 📋 **تفاصيل الأمر** ⟩ ───⭓\n` +
      `│ 💠 **الاسم:** ${config.name}\n` +
      `│ 💠 **الفئة:** ${(config.category || "General").toUpperCase()}\n` +
      `│ 💠 **الوصف:** ${description}\n` +
      `│ 💠 **الصلاحية:** ${roleText}\n` +
      `│ 💠 **وقت الانتظار:** ${config.countDown || 1} ثوانٍ\n` +
      `├── ⟨ 🚀 **طريقة الاستخدام** ⟩\n` +
      `│ 💡 \`${prefix}${guideText}\`\n` +
      `╰━━━━━━━━━━━━━━❖\n` +
      `✍️ بـقـلـم: **${config.author || "𝐀𝐥𝐞𝐧"}**`;

    await message.reply(helpDetail);
  },
};

function getCategoryIcon(category) {
  const icons = {
    "INFO": "ℹ️", "BOX CHAT": "👥", "OWNER": "🛡️", "ADMIN": "👑",
    "GAME": "🎮", "FUN": "🎡", "IMAGE": "🎨", "ECONOMY": "💰",
    "UTILITY": "🛠️", "MEDIA": "🎬", "GENERAL": "📁"
  };
  return icons[category] || "💠";
}
