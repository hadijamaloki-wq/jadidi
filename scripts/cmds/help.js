const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "2.1.0",
    author: "Amine (𝐀𝐥𝐞𝐧)",
    countDown: 5,
    role: 0,
    shortDescription: { en: "عرض قائمة الأوامر المقسمة لصفحات" },
    longDescription: { en: "عرض كافة الأوامر بتنسيق عصري ومقسم لسهولة التصفح" },
    category: "info",
    guide: { en: "{pn} | {pn} <رقم الصفحة> | {pn} <اسم الأمر>" },
  },

  onStart: async function ({ message, args, event, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);
    const commandsArray = Array.from(commands.values()).filter(cmd => cmd.config.role <= role);

    // --- إذا لم يكتب شيئاً أو كتب رقماً (عرض الصفحات) ---
    if (args.length === 0 || !isNaN(args[0])) {
      const cmdsPerPage = 15;
      const page = parseInt(args[0]) || 1;
      const totalPages = Math.ceil(commandsArray.length / cmdsPerPage);

      if (page < 1 || page > totalPages) {
        return message.reply(`❌ | اسف يا سيدي أمين، لا توجد صفحة رقم ${page}. الإجمالي هو ${totalPages} صفحة.`);
      }

      const start = (page - 1) * cmdsPerPage;
      const end = start + cmdsPerPage;
      const paginatedCmds = commandsArray.slice(start, end);

      // تجميع الأوامر حسب الفئات في الصفحة الحالية فقط
      const categories = {};
      for (const cmd of paginatedCmds) {
        const category = (cmd.config.category || "General").toUpperCase();
        if (!categories[category]) categories[category] = [];
        categories[category].push(cmd.config.name);
      }

      let msg = `─── ⋆⭐ **𝕮𝖍𝖔𝖈𝖔𝖑𝖆𝖙𝖊 𝕼𝖚𝖊𝖊𝖓** ⭐ ⋆ ───\n\n`;
      
      for (const category in categories) {
        const icon = getCategoryIcon(category);
        msg += `╭───────────━━━━━━━───╮\n`;
        msg += `  ┃ ${icon} **${category}**\n`;
        msg += `  ┃ ───────────\n`;
        const sortedCmds = categories[category].sort();
        for (let i = 0; i < sortedCmds.length; i += 3) {
          const chunk = sortedCmds.slice(i, i + 3).map(c => `\`${c}\``).join(" • ");
          msg += `  ┃ ◈ ${chunk}\n`;
        }
        msg += `╰───────────━━━━━━━───╯\n\n`;
      }

      msg += `✨ **الصفحة:** [ ${page} / ${totalPages} ]\n`;
      msg += `👤 **المطور:** Amine (𝐀𝐥𝐞𝐧)\n`;
      msg += `📊 **إجمالي الأوامر:** ${commands.size}\n`;
      msg += `━━━━━━━━━━━━━━━━━━\n`;
      msg += `> 💡 اكتب \`${prefix}help ${page + 1}\` للصفحة التالية\n`;
      msg += `> 💡 اكتب \`${prefix}help [الأمر]\` للتفاصيل`;

      return message.reply({ body: msg });
    }

    // --- عرض تفاصيل أمر معين ---
    let input = args[0].toLowerCase();
    let commandName = input.startsWith(prefix) ? input.slice(prefix.length) : input;
    let cmd = commands.get(commandName) || commands.get(aliases.get(commandName));

    if (!cmd) {
      return message.reply(`❌ | اسف سيدي امين الجبار لم أجد أمراً باسم: "${commandName}"`);
    }

    const config = cmd.config;
    const roleText = config.role === 0 ? "الجميع" : config.role === 1 ? "إداريي المجموعة" : "المطور فقط (𝐀𝐥𝐞𝐧)";
    const guideText = config.guide?.en ? config.guide.en.replace(/\{pn\}/g, config.name) : "لا يوجد دليل استخدام.";
    
    const helpDetail = `╭── ⟨ 📋 **تفاصيل الأمر** ⟩ ───⭓\n` +
      `│ 💠 **الاسم:** ${config.name}\n` +
      `│ 💠 **الفئة:** ${(config.category || "General").toUpperCase()}\n` +
      `│ 💠 **الوصف:** ${config.shortDescription?.ar || config.shortDescription?.en || "لا يوجد شرح"}\n` +
      `│ 💠 **الصلاحية:** ${roleText}\n` +
      `│ 💠 **وقت الانتظار:** ${config.countDown || 1} ثوانٍ\n` +
      `├── ⟨ 🚀 **طريقة الاستخدام** ⟩\n` +
      `│ 💡 \`${prefix}${guideText}\`\n` +
      `╰━━━━━━━━━━━━━━❖\n` +
      `✍️ بـقـلـم: **${config.author || "𝐀𝐥𝐞𝐧عمك"}**`;

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
