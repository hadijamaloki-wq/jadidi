const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "help",
    version: "5.0.0",
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
    
    // --- زخرفة الأرقام الغليظة ---
    const boldNumbers = ["⓪", "➊", "➋", "➌", "➍", "➎", "➏", "➐", "➑", "➒", "➓"];
    const getBoldNum = (n) => n.toString().split('').map(digit => boldNumbers[parseInt(digit)] || digit).join('');

    // --- 1. إذا طلب شرح أمر معين ---
    if (args[0] && isNaN(args[0])) {
      let input = args[0].toLowerCase();
      let cmdName = input.startsWith(prefix) ? input.slice(prefix.length) : input;
      let cmd = commands.get(cmdName) || commands.get(global.GoatBot.aliases.get(cmdName));

      if (!cmd) return message.reply(`❌ | لامر "${cmdName}" مكاينش يا Maestro!`);

      const { config } = cmd;
      let detail = `╔══════════════════════╗\n`;
      detail += `      𝐃𝐄𝐓𝐀𝐈𝐋𝐒 𝐎𝐅 [ ${config.name.toUpperCase()} ]\n`;
      detail += `╚══════════════════════╝\n\n`;
      detail += `💠 **الوصف:** ${translateCommand(config.name)}\n`;
      detail += `💠 **الصلاحية:** ${config.role === 1 ? "المشرفين" : config.role === 2 ? "المطور" : "الكل"}\n`;
      detail += `💠 **الانتظار:** ${config.countDown || 5} ثواني\n`;
      detail += `💠 **طريقة الاستخدام:**\n ➥ ${prefix}${config.name} ${config.guide?.en || ""}\n\n`;
      detail += `『 𝐘𝐔𝐀𝐍 𝐒𝐘𝐒𝐓𝐄𝐌 𝐕𝟓 』`;
      return message.reply(detail);
    }

    // --- 2. نظام الصفحات الذكي ---
    const page = parseInt(args[0]) || 1;
    const cmdsPerPage = 15;
    const totalPages = Math.ceil(allCmds.length / cmdsPerPage);

    if (page < 1 || page > totalPages) return message.reply(`❌ | مكايناش الصفحة رقم ${page} يا Alen!`);

    let menu = `╔════════════════════════╗\n`;
    menu += `      𝐀𝐋𝐄𝐍 𝐁𝐎𝐓 - 𝐘𝐔𝐀𝐍 𝐒𝐘𝐒𝐓𝐄𝐌\n`;
    menu += `╚════════════════════════╝\n\n`;

    const start = (page - 1) * cmdsPerPage;
    const paginated = allCmds.slice(start, start + cmdsPerPage);

    paginated.forEach((cmd, index) => {
      const num = getBoldNum(start + index + 1);
      const name = cmd.config.name;
      const desc = translateCommand(name);
      menu += `【${num}】 ${prefix}${name.padEnd(10)} ➪ ${desc}\n`;
    });

    menu += `\n✨ **الصفحة:** 【 ${page} / ${totalPages} 】\n`;
    menu += `📊 **إجمالي الأوامر:** [ ${allCmds.length} ]\n`;
    menu += `👤 **المطور:** 𝐀𝐋𝐄𝐍 (𝐌𝐀𝐄𝐒𝐓𝐑𝐎)\n`;
    menu += `━━━━━━━━━━━━━━━━━━━━\n`;
    menu += `💡 **للتالي اكتب:** ${prefix}help ${page + 1}\n`;
    menu += `💡 **للشرح اكتب:** ${prefix}help [اسم الأمر]`;

    return message.reply(menu);
  }
};

// وظيفة الترجمة السريعة للأوامر (تقدر تزيد فيها)
function translateCommand(name) {
  const dict = {
    "yot": "يوتيوب سريع", "tik": "تيك توك", "anisearch": "بحث أنمي فيديو",
    "rank": "رتبة التفاعل", "info": "معلومات البوت", "profile": "بروفايلك",
    "avatar": "توليد أفاتار", "kiss": "قبلة", "hug": "حضن", "slap": "صفعة",
    "say": "تحدث البوت", "play": "شغل أغنية", "lyrics": "كلمات الأغاني",
    "daily": "مكافأة", "balance": "رصيدك", "uptime": "وقت التشغيل",
    "kick": "طرد", "warn": "إنذار", "ban": "حظر"
  };
  return dict[name.toLowerCase()] || "أمر نظام يوان";
}
