module.exports = {
  config: {
    name: "x",
    version: "1.1.0",
    author: "Amin",
    role: 2, // ليك بوحدك يا أمين
    category: "system",
    guide: {
      en: ".x [الاسم الجديد] | .x off"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, senderID } = event;
    const myUID = "61578796876651"; // آيدي الحساب ديالك

    // حماية الأمر: أنت فقط من يستطيع استخدامه
    if (senderID !== myUID) return;

    if (!global.xSystem) global.xSystem = {};

    // 1. إيقاف الحماية: .x off
    if (args[0] === "off") {
      global.xSystem[threadID] = { status: false, name: "" };
      return api.sendMessage("🔓 | تم إيقاف حماية اسم المجموعة، دابا يقدر أي واحد يبدلو.", threadID);
    }

    // 2. تفعيل الحماية وتغيير الاسم: .x [الاسم]
    const newName = args.join(" ");
    if (!newName) {
      return api.sendMessage("⚠️ | اكتب الاسم اللي بغيتي تتبتو: .x [الاسم]", threadID);
    }

    // حفظ الاسم وحالته في الذاكرة
    global.xSystem[threadID] = { status: true, name: newName };

    // تغيير الاسم فوراً
    return api.setTitle(newName, threadID, (err) => {
      if (err) return api.sendMessage("❌ | فشل تغيير اسم المجموعة، تأكد أن البوت مسؤول (Admin).", threadID);
      return api.sendMessage(`🛡️ | تم تثبيت اسم المجموعة: **${newName}**\n(أي محاولة تغيير سيتم ردعها تلقائياً).`, threadID);
    });
  },

  onEvent: async function ({ api, event }) {
    const { threadID, logMessageType, logMessageData } = event;

    // التأكد أن النظام مفعل لهذا الكروب
    if (!global.xSystem || !global.xSystem[threadID] || !global.xSystem[threadID].status) return;

    // مراقبة حدث تغيير اسم المجموعة
    if (logMessageType === "log:thread-name") {
      const lockedName = global.xSystem[threadID].name;
      const changedName = logMessageData.name;

      // إذا كان الاسم الجديد لا يطابق الاسم الذي قمت بتثبيته
      if (changedName !== lockedName) {
        // إعادة الاسم الأصلي بزز
        return api.setTitle(lockedName, threadID);
      }
    }
  }
};
