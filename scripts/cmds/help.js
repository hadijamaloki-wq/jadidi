const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "help",
    version: "7.0.0",
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
      const bold = ["𝗔","𝗕","𝗖","𝗗","𝗘","𝗙","𝗚","𝗛","𝗜","𝗝","𝗞","𝗟","𝗠","𝗡","𝗢","𝗣","𝗤","𝗥","𝗦","𝗧","𝗨","𝗩","𝗪","𝗫","𝗬","𝗭","𝗮","𝗯","𝗰","𝗱","𝗲","𝗳","𝗴","𝗵","𝗶","𝗷","𝗸","𝗹","𝗺","𝗻","𝗼","𝗽","𝗾","𝗿","𝘀","𝘁","𝘂","𝘃","𝘄","𝘅","𝘆","𝘇","𝟬","𝟭","𝟮","𝟯","𝟰","𝟱","𝟲","𝟳","𝟴","𝟵"];
      return text.split('').map(char => {
        const index = normal.indexOf(char);
        return index > -1 ? bold[index] : char;
      }).join('');
    }

    // شرح بسيط بالعربية فقط
    function translateCommand(name) {
      const dict = {
        "yot": "تحميل فيديو من يوتيوب",
        "tik": "تحميل فيديو تيك توك بدون علامة",
        "fb": "تحميل فيديو أو صورة من فيسبوك",
        "ig": "تحميل من إنستغرام",
        "sing": "بحث وتحميل أغاني",
        "video": "بحث وتحميل فيديوهات",
        "lyrics": "جلب كلمات الأغنية",
        "anisearch": "البحث عن أنمي بالصورة",

        "kiss": "إرسال قبلة لشخص",
        "slap": "صفع شخص",
        "hug": "إرسال حضن لشخص",
        "punch": "لكم شخص",
        "kill": "قتل شخص (مزح)",
        "jail": "وضع شخص في السجن",
        "meme": "إرسال ميم مضحك",
        "joke": "إرسال نكتة",
        "gay": "نسبة المثلية",
        "ship": "توفيق بين شخصين",
        "rank": "رتبة التفاعل في المجموعة",

        "ttt": "لعبة إكس أو",
        "rps": "حجر ورقة مقص",
        "dice": "رمي النرد",
        "slot": "آلة القمار",
        "quiz": "مسابقة أسئلة",
        "akinator": "لعبة أكيناتور",

        "info": "معلومات عن البوت",
        "profile": "عرض بروفايلك",
        "avatar": "توليد أفاتار",
        "weather": "حالة الطقس",
        "translate": "ترجمة نص",
        "say": "البوت يكرر كلامك",
        "qr": "إنشاء رمز QR",
        "uid": "إظهار معرف حسابك",
        "tid": "إظهار معرف المجموعة",
        "uptime": "مدة تشغيل البوت",
        "ping": "سرعة استجابة البوت",

        "daily": "المكافأة اليومية",
        "work": "العمل وجمع فلوس",
        "balance": "عرض رصيدك",
        "pay": "تحويل فلوس لشخص",
        "top": "أغنى 10 أشخاص",
        "bank": "البنك",

        "kick": "طرد عضو من المجموعة",
        "ban": "حظر عضو",
        "warn": "تحذير عضو",
        "unsend": "حذف رسالة البوت",
        "setname": "تغيير لقب عضو",
        "admin": "إعدادات الأدمن",
        "out": "إخراج البوت من المجموعة",
        "restart": "إعادة تشغيل البوت",
        "update": "تحديث الأوامر",
        "prefix": "تغيير بادئة الأوامر",
        "setwelcome": "إعداد رسالة الترحيب",
        "setleave": "إعداد رسالة الوداع",

        "x": "تفعيل حماية المجموعة",
        "z": "حماية الكنيات والحسابات",

        "gpt": "الدردشة مع ChatGPT",
        "imagine": "توليد صور بالذكاء الاصطناعي",
        "gemini": "الدردشة مع Gemini",
        "draw": "رسم صور",

        "menu": "عرض قائمة الأوامر",
        "owner": "معلومات صاحب البوت",
        "help": "عرض قائمة الأوامر"
      };

      const cleanName = name.toLowerCase();
      return dict[cleanName] || "أمر من نظام يوان";
    }

    // شرح أمر واحد
    if (args[0] && isNaN(args[0])) {
      let input = args[0].toLowerCase();
      let cmdName = input.startsWith(prefix) ? input.slice(prefix.length) : input;
      let cmd = commands.get(cmdName) || commands.get(global.GoatBot.aliases.get(cmdName));

      if (!cmd) return message.reply(`❌ | \( {masterBold("COMMAND")} " \){cmdName}" ${masterBold("NOT FOUND")}!`);

      const { config } = cmd;
      let detail = `╔══════════════════════╗\n`;
      detail += `   ${masterBold("DETAILS OF")} [ ${masterBold(config.name.toUpperCase())} ]\n`;
      detail += `╚══════════════════════╝\n\n`;
      detail += `💠 **الوصف:** ${translateCommand(config.name)}\n`;
      detail += `💠 **الصلاحية:** ${config.role === 1 ? "المشرفين فقط" : config.role === 2 ? "المطور فقط" : "الجميع"}\n`;
      detail += `💠 **الانتظار:** ${config.countDown || 5} ثواني\n`;
      detail += `💠 **الاستخدام:** \( {prefix} \){config.name} ${config.guide?.en || ""}\n\n`;
      detail += `『 ${masterBold("YUAN SYSTEM V7")} 』`;

      return message.reply(detail);
    }

    // قائمة الأوامر
    const page = parseInt(args[0]) || 1;
    const cmdsPerPage = 15;
    const totalPages = Math.ceil(allCmds.length / cmdsPerPage);

    if (page < 1 || page > totalPages) 
      return message.reply(`❌ | ${masterBold("PAGE")} ${page} ${masterBold("NOT FOUND")}!`);

    let menu = `╔════════════════════════════╗\n`;
    menu += `     ${masterBold("ALEN BOT COMMANDS")}\n`;
    menu += `╚════════════════════════════╝\n\n`;

    const start = (page - 1) * cmdsPerPage;
    const paginated = allCmds.slice(start, start + cmdsPerPage);

    paginated.forEach((cmd, index) => {
      const num = masterBold((start + index + 1).toString());
      const name = cmd.config.name;
      const desc = translateCommand(name);
      menu += `【${num}】 \( {masterBold(prefix)} \){masterBold(name)} ➪ ${desc}\n`;
    });

    menu += `\n✨ **${masterBold("PAGE")}:** 【 ${masterBold(page.toString())} / ${masterBold(totalPages.toString())} 】\n`;
    menu += `📊 **${masterBold("TOTAL")}:** [ ${masterBold(allCmds.length.toString())} ]\n`;
    menu += `👤 **${masterBold("OWNER")}:** ${masterBold("ALEN MAESTRO")}\n`;
    menu += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    menu += `💡 **${masterBold("NEXT")}:** ${prefix}help ${page + 1}\n`;
    menu += `💡 **${masterBold("INFO")}:** \( {prefix}help [ \){masterBold("command")}]`;

    return message.reply(menu);
  }
};
