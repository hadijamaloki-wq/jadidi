const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "help",
    version: "9.0.0",
    author: "Alen (Maestro)",
    countDown: 5,
    role: 0,
    category: "info",
    guide: { en: "{pn} | {pn} [page] | {pn} [command]" }
  },

  onStart: async function ({ message, args, event }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);
    const { commands } = global.GoatBot;
    const allCmds = Array.from(commands.values());

    function masterBold(text) {
      const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const bold = [
        "𝗔","𝗕","𝗖","𝗗","𝗘","𝗙","𝗚","𝗛","𝗜","𝗝","𝗞","𝗟","𝗠","𝗡","𝗢","𝗣","𝗤","𝗥","𝗦","𝗧","𝗨","𝗩","𝗪","𝗫","𝗬","𝗭",
        "𝗮","𝗯","𝗰","𝗱","𝗲","𝗳","𝗴","𝗵","𝗶","𝗷","𝗸","𝗹","𝗺","𝗻","𝗼","𝗽","𝗾","𝗿","𝘀","𝘁","𝘂","𝘃","𝘄","𝘅","ي","𝘇",
        "𝟬","𝟭","𝟮","𝟯","𝟰","𝟱","𝟲","𝟳","𝟴","𝟵"
      ];
      return text.split('').map(char => {
        const index = normal.indexOf(char);
        return index > -1 ? bold[index] : char;
      }).join('');
    }

    if (args[0] && isNaN(args[0])) {
      let input = args[0].toLowerCase();
      let cmdName = input.startsWith(prefix) ? input.slice(prefix.length) : input;
      let cmd = commands.get(cmdName) || commands.get(global.GoatBot.aliases.get(cmdName));
      if (!cmd) return message.reply(`❌ | ${masterBold("COMMAND")} "${cmdName}" ${masterBold("NOT FOUND")}!`);

      const { config } = cmd;
      let detail = `╔══════════════════════╗\n`;
      detail += `   ${masterBold("DETAILS OF")} [ ${masterBold(config.name.toUpperCase())} ]\n`;
      detail += `╚══════════════════════╝\n\n`;
      detail += `💠 **الشرح:** ${translateCommand(config.name)}\n`;
      detail += `💠 **الصلاحية:** ${config.role === 1 ? "المشرفين" : config.role === 2 ? "المطور" : "الكل"}\n`;
      detail += `💠 **الانتظار:** ${config.countDown || 5} ثواني\n`;
      detail += `💠 **الاستخدام:**\n ➥ ${prefix}${config.name} ${config.guide?.en || ""}\n\n`;
      detail += `『 ${masterBold("YUAN SYSTEM V9")} 』`;
      return message.reply(detail);
    }

    const page = parseInt(args[0]) || 1;
    const cmdsPerPage = 15;
    const totalPages = Math.ceil(allCmds.length / cmdsPerPage);
    if (page < 1 || page > totalPages) return message.reply(`❌ | ${masterBold("PAGE")} ${page} ${masterBold("NOT FOUND")}!`);

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

function translateCommand(name) {
  const dict = {
    // Media & Download
    "yot": "تحميل يوتيوب ➪ 𝗬𝗼𝘂𝗧𝘂𝗯𝗲",
    "tik": "تحميل تيك توك ➪ 𝗧𝗶𝗸𝗧𝗼𝗸",
    "fb": "تحميل فيسبوك ➪ 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸",
    "ig": "تحميل انستغرام ➪ 𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺",
    "sing": "بحث أغاني ➪ 𝗠𝘂𝘀𝗶𝗰",
    "video": "بحث فيديو ➪ 𝗩𝗶𝗱𝗲𝗼",
    "lyrics": "كلمات الأغاني ➪ 𝗟𝘆𝗿𝗶𝗰𝘀",
    "anisearch": "بحث أنمي ➪ 𝗔𝗻𝗶𝗺𝗲",
    "img": "بحث صور ➪ 𝗜𝗺𝗮𝗴𝗲",
    "pin": "بحث بنترست ➪ 𝗣𝗶𝗻𝘁𝗲𝗿𝗲𝘀𝘁",
    
    // Fun & Interaction
    "kiss": "قبلة ➪ 𝗞𝗶𝘀𝘀",
    "slap": "صفعة ➪ 𝗦𝗹𝗮𝗽",
    "hug": "حضن ➪ 𝗛𝘂𝗴",
    "punch": "لكمة ➪ 𝗣𝘂𝗻𝗰𝗵",
    "kill": "قتل ➪ 𝗞𝗶𝗹𝗹",
    "jail": "سجن ➪ 𝗝𝗮𝗶𝗹",
    "meme": "ميمز ➪ 𝗠𝗲𝗺𝗲𝘀",
    "joke": "نكتة ➪ 𝗝𝗼𝗸𝗲",
    "ship": "توافق ➪ 𝗦𝗵𝗶𝗽",
    "gay": "نسبة المثلية ➪ 𝗚𝗮𝘆",
    "rank": "رتبة التفاعل ➪ 𝗥𝗮𝗻𝗸",
    "top": "قائمة الأوائل ➪ 𝗧𝗼𝗽",
    
    // Info & Utility
    "info": "معلومات البوت ➪ 𝗜𝗻𝗳𝗼",
    "profile": "بروفايلك ➪ 𝗣𝗿𝗼𝗳𝗶𝗹𝗲",
    "avatar": "توليد أفاتار ➪ 𝗔𝘃𝗮𝘁𝗮𝗿",
    "uptime": "وقت التشغيل ➪ 𝗨𝗽𝘁𝗶𝗺𝗲",
    "ping": "سرعة البوت ➪ 𝗣𝗶𝗻𝗴",
    "weather": "حالة الطقس ➪ 𝗪𝗲𝗮𝘁𝗵𝗲𝗿",
    "translate": "ترجمة ➪ 𝗧𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗲",
    "say": "نطق النص ➪ 𝗦𝗮𝘆",
    "qr": "رمز الاستجابة ➪ 𝗤𝗥 𝗖𝗼𝗱𝗲",
    "uid": "معرف الحساب ➪ 𝗨𝗜𝗗",
    "tid": "معرف المجموعة ➪ 𝗧𝗜𝗗",
    
    // Economy
    "daily": "مكافأة يومية ➪ 𝗗𝗮𝗶𝗹𝘆",
    "balance": "رصيدك ➪ 𝗕𝗮𝗹𝗮𝗻𝗰𝗲",
    "work": "العمل ➪ 𝗪𝗼𝗿𝗸",
    "pay": "تحويل مال ➪ 𝗣𝗮𝘆",
    "bank": "البنك ➪ 𝗕𝗮𝗻𝗸",
    "gamble": "قمار ➪ 𝗚𝗮𝗺𝗯𝗹𝗲",
    "slot": "آلة الحظ ➪ 𝗦𝗹𝗼𝘁",
    
    // Games
    "ttt": "إكس أو ➪ 𝗧𝗧𝗧",
    "rps": "حجرة ورقة ➪ 𝗥𝗣𝗦",
    "chess": "شطرنج ➪ 𝗖𝗵𝗲𝘀𝘀",
    "quiz": "مسابقات ➪ 𝗤𝘂𝗶𝘇",
    
    // Admin & System
    "kick": "طرد ➪ 𝗞𝗶𝗰𝗸",
    "ban": "حظر ➪ 𝗕𝗮𝗻",
    "warn": "تحذير ➪ 𝗪𝗮𝗿𝗻",
    "unsend": "سحب الرسالة ➪ 𝗨𝗻𝘀𝗲𝗻𝗱",
    "prefix": "البادئة ➪ 𝗣𝗿𝗲𝗳𝗶𝘅",
    "setname": "تغيير اللقب ➪ 𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲",
    "admin": "الإدارة ➪ 𝗔𝗱𝗺𝗶𝗻",
    "out": "خروج البوت ➪ 𝗟𝗲𝗮𝘃𝗲",
    "restart": "إعادة تشغيل ➪ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁",
    "help": "مساعدة ➪ 𝗛𝗲𝗹𝗽",
    "welcome": "الترحيب ➪ 𝗪𝗲𝗹𝗰𝗼𝗺𝗲",
    "leave": "الوداع ➪ 𝗟𝗲𝗮𝘃𝗲 𝗡𝗼𝘁𝗶",
    
    // AI
    "gpt": "ذكاء صناعي ➪ 𝗖𝗵𝗮𝘁𝗚𝗣𝗧",
    "gemini": "ذكاء جوجل ➪ 𝗚𝗲𝗺𝗶𝗻𝗶",
    "imagine": "توليد صور ➪ 𝗜𝗺𝗮𝗴𝗶𝗻𝗲"
  };

  const cleanName = name.toLowerCase();
  return dict[cleanName] || "غير معروف ➪ 𝗨𝗻𝗸𝗻𝗼𝘄𝗻";
}
