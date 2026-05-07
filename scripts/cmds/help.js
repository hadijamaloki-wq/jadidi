const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "2.5.0",
    author: "Amine (𝐀𝐥𝐞𝐧)",
    countDown: 5,
    role: 0,
    shortDescription: { en: "قائمة الأوامر الفاخرة" },
    longDescription: { en: "عرض قائمة الأوامر بشكل مرتب ومزخرف مع أرقام" },
    category: "info",
    guide: { en: "{pn} | {pn} <رقم الصفحة>" },
  },

  onStart: async function ({ message, args, event, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);
    const commandsArray = Array.from(commands.values()).filter(cmd => cmd.config.role <= role);

    if (args.length === 0 || !isNaN(args[0])) {
      const cmdsPerPage = 15;
      const page = parseInt(args[0]) || 1;
      const totalPages = Math.ceil(commandsArray.length / cmdsPerPage);

      if (page < 1 || page > totalPages) {
        return message.reply(`❌ | عذراً يا أمين، لا توجد صفحة رقم ${page}. الإجمالي هو ${totalPages}.`);
      }

      const start = (page - 1) * cmdsPerPage;
      const paginatedCmds = commandsArray.slice(start, start + cmdsPerPage);

      let msg = `─── ⋆ ⭐ **𝕮𝖍𝖔𝖈𝖔𝖑𝖆𝖙𝖊 𝕼𝖚𝖊𝖊𝖓** ⭐ ⋆ ───\n\n`;

      paginatedCmds.forEach((cmd, index) => {
        // إضافة الأرقام بالنمط المطلوب 【1】
        const number = 【${start + index + 1}】;
        msg += `${number} ◈ **${cmd.config.name}**\n`;
      });

      msg += `\n✨ **الشاشة:** [ ${page} من ${totalPages} ]\n`;
      msg += `👑 **المسؤول:** Amine (𝐀𝐥𝐞𝐧)\n`;
      msg += `📊 **الأوامر:** ${commands.size} أمر متاح\n`;
      msg += `━━━━━━━━━━━━━━\n`;
      msg += `💡 لـلـتـنـقـل: \`${prefix}help ${page + 1}\`\n`;
      msg += `💡 لـلـتـفـاصـيـل: \`${prefix}help [الأمر]\``;

      return message.reply({ body: msg });
    }

    // --- تفاصيل أمر معين (عندما يكتب المستخدم .help rank مثلاً) ---
    let input = args[0].toLowerCase();
    let commandName = input.startsWith(prefix) ? input.slice(prefix.length) : input;
    let cmd = commands.get(commandName) || commands.get(aliases.get(commandName));

    if (!cmd) return message.reply(`❌ | لم أجد أمراً بهذا الاسم.`);

    const config = cmd.config;
    const desc = config.shortDescription?.ar || config.shortDescription?.en || "لا يوجد وصف";
    
    let detail = `💎 **تفاصيل الأمر: ${config.name}**\n`;
    detail += `──────────────────\n`;
    detail += `📝 الوصف: ${desc}\n`;
    detail += `📖 الاستخدام: \`${prefix}${config.name} ${config.guide?.en || ""}\`\n`;
    detail += `⏳ الانتظار: ${config.countDown} ثانية\n`;
    detail += `👤 السلطة: ${config.role === 1 ? "المسؤولين" : "الكل"}\n`;
    detail += `──────────────────`;

    await message.reply(detail);
  },
};
