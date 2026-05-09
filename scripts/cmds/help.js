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

    // زخرفة النص الغليظ
    function masterBold(text) {
      const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const bold = ["𝗔","𝗕","𝗖","𝗗","𝗘","𝗙","𝗚","𝗛","𝗜","𝗝","𝗞","𝗟","𝗠","𝗡","𝗢","𝗣","𝗤","𝗥","𝗦","𝗧","𝗨","𝗩","𝗪","𝗫","𝗬","𝗭","𝗮","𝗯","𝗰","𝗱","𝗲","𝗳","𝗴","𝗵","𝗶","𝗷","𝗸","𝗹","𝗺","𝗻","𝗼","𝗽","𝗾","𝗿","𝘀","𝘁","𝘂","𝘃","𝘄","𝘅","𝘆","𝘇","𝟬","𝟭","𝟮","𝟯","𝟰","𝟱","𝟲","𝟳","𝟴","𝟵"];
      return text.split('').map(char => {
        const index = normal.indexOf(char);
        return index > -1 ? bold[index] : char;
      }).join('');
    }

    // === ترجمة مزدوجة (عربي + إنجليزي) ===
    function translateCommand(name) {
      const dict = {
        // --- [ MEDIA & DOWNLOAD ] ---
        "yot": "تحميل من يوتيوب ➪ YouTube Download",
        "tik": "تحميل تيك توك ➪ TikTok Download",
        "fb": "تحميل من فيسبوك ➪ Facebook Download",
        "ig": "تحميل من إنستغرام ➪ Instagram Download",
        "sing": "بحث وتحميل أغاني ➪ Search Songs",
        "video": "بحث وتحميل فيديوهات ➪ Search Videos",
        "lyrics": "كلمات الأغاني ➪ Music Lyrics",
        "anisearch": "بحث عن الأنمي ➪ Anime Search",

        // --- [ ENTERTAINMENT ] ---
        "kiss": "قبلة رقيقة ➪ Kiss Someone",
        "slap": "صفعة قوية ➪ Slap Someone",
        "hug": "حضن دافئ ➪ Hug Someone",
        "punch": "لكمة ➪ Punch Someone",
        "kill": "قتل (مزح) ➪ Kill Someone",
        "jail": "وضع في السجن ➪ Put in Jail",
        "meme": "ميمز مضحكة ➪ Random Memes",
        "joke": "نكتة ➪ Tell a Joke",
        "gay": "نسبة المثلية ➪ Gay Percentage",
        "ship": "توفيق بين شخصين ➪ Matchmaking",
        "rank": "رتبة التفاعل ➪ Interaction Rank",

        // --- [ GAMES ] ---
        "ttt": "لعبة إكس أو ➪ Tic Tac Toe",
        "rps": "حجرة ورقة مقص ➪ Rock Paper Scissors",
        "dice": "نرد الحظ ➪ Roll Dice",
        "slot": "آلة القمار ➪ Slot Machine",
        "quiz": "مسابقة ثقافية ➪ Cultural Quiz",
        "akinator": "المارد الأزرق ➪ Akinator",

        // --- [ TOOLS & INFO ] ---
        "info": "معلومات البوت ➪ Bot Information",
        "profile": "بروفايلك ➪ Your Profile",
        "avatar": "توليد أفاتار ➪ Avatar Generator",
        "weather": "حالة الطقس ➪ Weather Forecast",
        "translate": "ترجمة النصوص ➪ Text Translate",
        "say": "نطق النصوص ➪ Text to Speech",
        "qr": "صنع رمز QR ➪ QR Code Maker",
        "uid": "معرف الحساب ➪ User ID",
        "tid": "معرف المجموعة ➪ Thread ID",
        "uptime": "وقت تشغيل البوت ➪ Bot Uptime",
        "ping": "سرعة الاستجابة ➪ Bot Speed",

        // --- [ ECONOMY ] ---
        "daily": "هدية يومية ➪ Daily Reward",
        "work": "العمل لجمع المال ➪ Work for Money",
        "balance": "رصيدك الحالي ➪ Your Balance",
        "pay": "تحويل أموال ➪ Transfer Money",
        "top": "قائمة الأوائل ➪ Top Wealthy",
        "bank": "البنك المركزي ➪ Central Bank",

        // --- [ ADMIN & SYSTEM ] ---
        "kick": "طرد عضو ➪ Kick Member",
        "ban": "حظر مستخدم ➪ Ban User",
        "warn": "تحذير عضو ➪ Warn Member",
        "unsend": "حذف رسالة البوت ➪ Unsend Message",
        "setname": "تغيير اللقب ➪ Change Nickname",
        "admin": "إعدادات الأدمن ➪ Admin Settings",
        "out": "خروج البوت ➪ Bot Leave Group",
        "restart": "إعادة تشغيل ➪ Restart System",
        "update": "تحديث الأوامر ➪ Update Commands",
        "prefix": "تغيير البادئة ➪ Change Prefix",
        "setwelcome": "إعداد الترحيب ➪ Set Welcome",
        "setleave": "إعداد الوداع ➪ Set Leave",

        // --- حماية ---
        "x": "حماية المجموعة ➪ Group Protection",
        "z": "حماية الحسابات والكنيات ➪ Accounts & Nicknames Protection",

        // --- [ AI & ART ] ---
        "gpt": "ذكاء اصطناعي ➪ ChatGPT AI",
        "imagine": "توليد صور ➪ Image Generator",
        "gemini": "ذكاء جوجل ➪ Gemini AI",
        "draw": "رسم لوحات ➪ Draw Art",

        // أوامر إضافية
        "menu": "عرض قائمة الأوامر ➪ Menu",
        "owner": "معلومات صاحب البوت ➪ Bot Owner",
        "help": "عرض قائمة الأوامر ➪ Help Command"
      };

      const cleanName = name.toLowerCase();
      return dict[cleanName] || `أمر ${cleanName.toUpperCase()} ➪ Unknown Command`;
    }

    // --- شرح أمر محدد ---
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
      detail += `💠 **الاستخدام:**\n ➥ \( {prefix} \){config.name} ${config.guide?.en || ""}\n\n`;
      detail += `『 ${masterBold("YUAN SYSTEM V7")} 』`;

      return message.reply(detail);
    }

    // --- قائمة الأوامر بالصفحات ---
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
