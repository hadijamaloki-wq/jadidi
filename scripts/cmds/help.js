const { getPrefix } = global.utils;
const { commands } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.2",
    author: "Amin",
    countDown: 5,
    role: 0,
    shortDescription: { en: "عرض قائمة الأوامر" },
    longDescription: { en: "عرض قائمة الأوامر أو تفاصيل أمر معين" },
    category: "info",
    guide: { en: "{pn} أو {pn} [اسم الأمر]" },
  },

  onStart: async function ({ message, args, event, threadsData }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      let msg = `╭───────────────────────⭓\n`;
      msg += `         قائمة الأوامر\n`;
      msg += `╰───────────────────────⭓\n\n`;

      // 1. الأوامر العامة
      msg += `   𝟭. الأوامر العامة\n`;
      msg += `1. accept     2. all       3. boxinfo    4. help\n`;
      msg += `5. menu       6. ping      7. prefix     8. rules\n`;
      msg += `9. time       10. uptime\n\n`;

      // 2. إدارة المجموعة
      msg += `   𝟮. إدارة المجموعة\n`;
      msg += `11. adduser   12. anti     13. antiout   14. ban\n`;
      msg += `15. kick      16. onlyadminbox  17. setname   18. unsend\n`;
      msg += `19. warn      20. filteruser\n\n`;

      // 3. الترفيه والألعاب
      msg += `   𝟯. الترفيه والألعاب\n`;
      msg += `21. akinator  22. ball     23. beauty    24. choose\n`;
      msg += `25. daily     26. dhbc     27. dice      28. hug\n`;
      msg += `29. kiss      30. pair     31. rps       32. slot\n`;
      msg += `33. ttt\n\n`;

      // 4. الصور والوسائط
      msg += `   𝟰. الصور والوسائط\n`;
      msg += `34. affect    35. avatar   36. coverphoto  37. fbcover\n`;
      msg += `38. gen       39. imagine  40. logo      41. meme\n`;
      msg += `42. profile   43. searchimage  44. slap   45. trigger\n\n`;

      msg += `╰───────────────────────⭓\n`;
      msg += `الإجمالي: ${commands.size} أمر متاح\n\n`;
      msg += `أرسل ${prefix}help [اسم الأمر] لعرض التفاصيل\n`;
      msg += `مثال: ${prefix}help pair\n\n`;

      // ────── معلومات البوت والمالك (كما طلبت) ──────
      msg += `🫧 البوت • هه✌🏿✌🏿\n`;
      msg += `🔹 المالك • Aɭɩɳꜞx ゅ\n`;
      msg += `🔗 الحساب: https://www.facebook.com/profile.php?id=61578796876651`;

      await message.reply({ body: msg });
      return;
    }

    // عرض تفاصيل أمر معين
    const commandName = args[0].toLowerCase();
    const command = commands.get(commandName) || commands.get(global.GoatBot.aliases.get(commandName));

    if (!command) {
      return message.reply(`لم يتم العثور على الأمر "${commandName}"`);
    }

    const config = command.config;
    const roleText = config.role === 0 ? "الجميع" : config.role === 1 ? "إداريي المجموعة" : "مالك البوت";

    const response = `╭── اسم الأمر ───⭓\n` +
      `│ ${config.name}\n` +
      `├── المعلومات\n` +
      `│ الوصف: ${config.longDescription?.en || config.shortDescription?.en || "لا يوجد وصف"}\n` +
      `│ الإصدار: ${config.version || "1.0"}\n` +
      `│ الصلاحية: ${roleText}\n` +
      `│ المؤلف: ${config.author || "غير معروف"}\n` +
      `├── الاستخدام\n` +
      `│ \( {prefix} \){config.name}\n` +
      `╰━━━━━━━━━━━━━━❖`;

    await message.reply(response);
  },
};
