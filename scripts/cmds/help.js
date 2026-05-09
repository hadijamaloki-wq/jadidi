const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "help",
    version: "6.0.0",
    author: "Alen (Maestro)",
    countDown: 5,
    role: 0,
    category: "info",
    guide: { en: "{pn} | {pn} [رقم الصفحة] | {pn} [اسم الأمر]" }
  },

  onStart: async function ({ message, args, event }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);
    const { commands } = global.GoatBot;
    const allCmds = Array.from(commands.values());

    // --- 🛠️ محول الزخرفة الغليظة (Sans-serif Bold) اللي طلبتي ---
    function masterBold(text) {
      const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const bold = "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵";
      return text.split('').map(char => {
        const index = normal.indexOf(char);
        return index > -1 ? bold.split('')[index] : char;
      }).join('');
    }

    // --- 1. حالة شرح أمر معين (.help kiss) ---
    if (args[0] && isNaN(args[0])) {
      let input = args[0].toLowerCase();
      let cmdName = input.startsWith(prefix) ? input.slice(prefix.length) : input;
      let cmd = commands.get(cmdName) || commands.get(global.GoatBot.aliases.get(cmdName));

      if (!cmd) return message.reply(`❌ | ${masterBold("Command")} "${cmdName}" ${masterBold("not found")}!`);

      const { config } = cmd;
      let detail = `╔══════════════════════╗\n`;
      detail += `   ${masterBold("DETAILS OF")} [ ${masterBold(config.name.toUpperCase())} ]\n`;
      detail += `╚══════════════════════╝\n\n`;
      detail += `💠 **الوصف:** ${translateCommand(config.name)}\n`;
      detail += `💠 **الصلاحية:** ${config.role === 1 ? "المشرفين" : config.role === 2 ? "المطور" : "الكل"}\n`;
      detail += `💠 **الانتظار:** ${config.countDown || 5} ثواني\n`;
      detail += `💠 **الاستخدام:**\n ➥ ${prefix}${config.name} ${config.guide?.en || ""}\n\n`;
      detail += `『 ${masterBold("YUAN SYSTEM V6")} 』`;
      return message.reply(detail);
    }

    // --- 2. حالة قائمة الصفحات (.help 1) ---
    const page = parseInt(args[0]) || 1;
    const cmdsPerPage = 15;
    const totalPages = Math.ceil(allCmds.length / cmdsPerPage);

    if (page < 1 || page > totalPages) return message.reply(`❌ | ${masterBold("Page")} ${page} ${masterBold("not found")}!`);

    let menu = `╔════════════════════════════╗\n`;
    menu += `     ${masterBold("ALEN BOT COMMANDS")}\n`;
    menu += `╚════════════════════════════╝\n\n`;

    const start = (page - 1) * cmdsPerPage;
    const paginated = allCmds.slice(start, start + cmdsPerPage);

    paginated.forEach((cmd, index) => {
      const num = masterBold((start + index + 1).toString());
      const name = cmd.config.name;
      const desc = translateCommand(name);
      menu += `【${num}】 ${masterBold(prefix)}${masterBold(name)} ➪ ${desc}\n`;
    });

    menu += `\n✨ **${masterBold("PAGE")}:** 【 ${masterBold(page.toString())} / ${masterBold(totalPages.toString())} 】\n`;
    menu += `📊 **${masterBold("TOTAL")}:** [ ${masterBold(allCmds.length.toString())} ]\n`;
    menu += `👤 **${masterBold("OWNER")}:** ${masterBold("ALEN MAESTRO")}\n`;
    menu += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    menu += `💡 **${masterBold("NEXT")}:** ${prefix}help ${page + 1}\n`;
    menu += `💡 **${masterBold("INFO")}:** ${prefix}help [${masterBold("command")}]`;

    return message.reply(menu);
  }
};

// وظيفة الترجمة الذكية (باش يجي داكشي "مزز")
function translateCommand(name) {
  const dict = {
    "yot": "تحميل يوتيوب سريع", "tik": "تيك توك بدون علامة", "anisearch": "بحث أنمي فيديو",
    "rank": "رتبة التفاعل", "info": "معلومات البوت", "profile": "بروفايلك",
    "avatar": "توليد أفاتار", "kiss": "إرسال قبلة", "hug": "إرسال حضن", "slap": "صفعة",
    "say": "تحدث البوت", "play": "تشغيل أغنية", "lyrics": "كلمات الأغاني",
    "daily": "مكافأة يومية", "balance": "رصيدك", "uptime": "وقت التشغيل"
  };
  return dict[name.toLowerCase()] || "أمر نظام يوان المطور";
}
