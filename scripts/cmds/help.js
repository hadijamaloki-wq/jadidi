function translateCommand(name) {
  const dict = {
    // --- [ MEDIA & DOWNLOAD - ميديا وتحميل ] ---
    "yot": "تحميل من يوتيوب ➪ YouTube Download",
    "tik": "تحميل تيك توك ➪ TikTok Download",
    "fb": "تحميل من فيسبوك ➪ Facebook Download",
    "ig": "تحميل من إنستغرام ➪ Instagram Download",
    "sing": "بحث وتحميل أغاني ➪ Search Songs",
    "video": "بحث وتحميل فيديوهات ➪ Search Videos",
    "lyrics": "كلمات الأغاني ➪ Music Lyrics",
    "anisearch": "بحث عن الأنمي ➪ Anime Search",

    // --- [ ENTERTAINMENT - ترفيه وضحك ] ---
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

    // --- [ GAMES - ألعاب ] ---
    "ttt": "لعبة إكس أو ➪ Tic Tac Toe",
    "rps": "حجرة ورقة مقص ➪ Rock Paper Scissors",
    "dice": "نرد الحظ ➪ Roll Dice",
    "slot": "آلة القمار ➪ Slot Machine",
    "quiz": "مسابقة ثقافية ➪ Cultural Quiz",
    "akinator": "المارد الأزرق ➪ Akinator",

    // --- [ TOOLS & INFO - أدوات ومعلومات ] ---
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

    // --- [ ECONOMY - النظام المالي ] ---
    "daily": "هدية يومية ➪ Daily Reward",
    "work": "العمل لجمع المال ➪ Work for Money",
    "balance": "رصيدك الحالي ➪ Your Balance",
    "pay": "تحويل أموال ➪ Transfer Money",
    "top": "قائمة الأوائل ➪ Top Wealthy",
    "bank": "البنك المركزي ➪ Central Bank",

    // --- [ ADMIN & SYSTEM - الإدارة والسيستيم ] ---
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

    // --- [ AI & ART - ذكاء اصطناعي وفن ] ---
    "gpt": "ذكاء اصطناعي ➪ ChatGPT AI",
    "imagine": "توليد صور ➪ Image Generator",
    "gemini": "ذكاء جوجل ➪ Gemini AI",
    "draw": "رسم لوحات ➪ Draw Art"
  };

  const cleanName = name.toLowerCase();
  return dict[cleanName] || "أمر نظام يوان المطور ➪ Yuan System Command";
}
