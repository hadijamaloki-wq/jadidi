module.exports = {
  config: {
    name: "z",
    version: "2.0.0",
    author: "Amin",
    role: 2, // للمطور أمين فقط
    category: "system",
    guide: {
      en: ".z [الواني] [الكنية] | .z off | .z me [الكنية] | .z me off"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const myUID = "61578796876651"; // آيدي الخاص بك يا أمين

    if (senderID !== myUID) return; // الحماية: أنت فقط من يتحكم

    if (!global.zData) global.zData = {};
    if (!global.zData[threadID]) global.zData[threadID] = { all: { status: false, name: "" }, me: { status: false, name: "" } };

    // 1. إيقاف حماية كنية أمين فقط: .z me off
    if (args[0] === "me" && args[1] === "off") {
      global.zData[threadID].me.status = false;
      return api.sendMessage("🔓 | تم إيقاف تثبيت كنيتك يا **𝐀𝐦𝐢𝐧**.", threadID);
    }

    // 2. تثبيت كنية أمين: .z me [الكنية]
    if (args[0] === "me" && args[1]) {
      const myName = args.slice(1).join(" ");
      global.zData[threadID].me = { status: true, name: myName };
      await api.changeNickname(myName, threadID, myUID);
      return api.sendMessage(`🛡️ | تم تثبيت كنيتك بنجاح: **${myName}**`, threadID);
    }

    // 3. إيقاف حماية الكل: .z off
    if (args[0] === "off") {
      global.zData[threadID].all.status = false;
      return api.sendMessage("🔓 | تم إيقاف تثبيت كنيات المجموعة.", threadID);
    }

    // 4. تغيير وتثبيت كنيات الكل: .z [ثواني] [الكنية]
    const delay = parseInt(args[0]);
    const allName = args.slice(1).join(" ");

    if (isNaN(delay) || !allName) {
      return api.sendMessage("⚠️ | الاستخدام: .z [الثواني] [الكنية]\nمثال: .z 5 𝐘𝐮𝐚𝐧 𝐒𝐲𝐬𝐭𝐞𝐦", threadID);
    }

    api.sendMessage(`🚀 | جاري تغيير الكنيات كل ${delay} ثوانٍ وتثبيتها...`, threadID);
    
    global.zData[threadID].all = { status: true, name: allName };

    const info = await api.getThreadInfo(threadID);
    const userIDs = info.participantIDs;

    for (let userID of userIDs) {
      if (!global.zData[threadID].all.status) break; // توقف إذا أرسلت .z off
      await api.changeNickname(allName, threadID, userID);
      await new Promise(resolve => setTimeout(resolve, delay * 1000));
    }

    return api.sendMessage("✅ | تم تغيير جميع الكنيات وتفعيل وضع التثبيت.", threadID);
  },

  onEvent: async function ({ api, event }) {
    const { threadID, logMessageType, logMessageData } = event;
    const myUID = "61578796876651";

    if (!global.zData || !global.zData[threadID]) return;

    // مراقبة تغيير الكنيات (log:nickname)
    if (logMessageType === "log:nickname") {
      const targetID = logMessageData.participant_id;
      const newNickname = logMessageData.nickname;

      // حماية كنية أمين (الأولوية)
      if (targetID === myUID && global.zData[threadID].me.status) {
        if (newNickname !== global.zData[threadID].me.name) {
          return api.changeNickname(global.zData[threadID].me.name, threadID, myUID);
        }
      }

      // حماية كنيات المجموعة
      if (global.zData[threadID].all.status) {
        if (newNickname !== global.zData[threadID].all.name) {
          return api.changeNickname(global.zData[threadID].all.name, threadID, targetID);
        }
      }
    }
  }
};
