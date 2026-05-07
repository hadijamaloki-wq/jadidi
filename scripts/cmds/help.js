module.exports = {
  config: {
    name: "help",
    version: "3.1.0",
    author: "Amine (𝐀𝐥𝐞𝐧)",
    countDown: 5,
    role: 0,
    shortDescription: { en: "قائمة الأوامر الصافية" },
    longDescription: { en: "عرض قائمة الأوامر بدون خطوط أو زخارف" },
    category: "info",
    guide: { en: "{pn} | {pn} <رقم الصفحة>" }
  },

  onStart: async function ({ api, event, args, Commands }) {
    const { threadID, messageID } = event;
    const prefix = "."; // تأكد من البادئة الخاصة بك هنا
    const allCmds = Array.from(Commands.values());

    if (args.length === 0 || !isNaN(args[0])) {
      const page = parseInt(args[0]) || 1;
      const cmdsPerPage = 15;
      const totalPages = Math.ceil(allCmds.length / cmdsPerPage);

      if (page > totalPages) return api.sendMessage(`❌ لا توجد صفحة رقم ${page}`, threadID, messageID);

      let msg = `👑 **𝕮𝖍𝖔𝖈𝖔𝖑𝖆𝖙𝖊 𝕼𝖚𝖊𝖊𝖓** 🍫\n\n`;
      const start = (page - 1) * cmdsPerPage;
      const paginated = allCmds.slice(start, start + cmdsPerPage);

      paginated.forEach((cmd, index) => {
        msg += `【${start + index + 1}】 ${cmd.config.name}\n\n`;
      });

      msg += `✨ الصفحة ${page} من ${totalPages}\n`;
      msg += `👤 المطور: Amine (Alen)\n`;
      msg += `🔗 https://www.facebook.com/profile.php?id=61578796876651\n\n`;
      msg += `💡 الصفحة التالية: ${prefix}help ${page + 1}`;

      return api.sendMessage(msg, threadID, messageID);
    }

    const command = Commands.get(args[0].toLowerCase());
    if (!command) return api.sendMessage(`❌ لم أجد هذا الأمر`, threadID, messageID);

    const { config } = command;
    let detail = `📋 تفاصيل: ${config.name}\n\n`;
    detail += `💠 الصلاحية: ${config.role === 1 ? "الأدمن" : "الكل"}\n`;
    detail += `💠 الانتظار: ${config.countDown} ثانية\n\n`;
    detail += `🚀 الاستخدام: ${prefix}${config.name} ${config.guide?.en || ""}`;

    return api.sendMessage(detail, threadID, messageID);
  }
};
