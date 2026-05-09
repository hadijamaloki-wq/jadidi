const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "welcome",
    version: "2.0.0",
    author: "Alen (Maestro)"
  },

  onStart: async function ({ api, event, threadsData, usersData }) {
    const { threadID, logMessageData, author } = event;
    const { threadName, participantIDs } = await threadsData.get(threadID);

    // --- 🛠️ دالة الزخرفة الغليظة (نسخة Maestro) ---
    function masterBold(text) {
      const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const bold = [
        "𝗔","𝗕","𝗖","𝗗","𝗘","𝗙","𝗚","𝗛","𝗜","𝗝","𝗞","𝗟","𝗠","𝗡","𝗢","𝗣","𝗤","𝗥","𝗦","𝗧","𝗨","𝗩","𝗪","𝗫","𝗬","𝗭",
        "𝗮","𝗯","𝗰","𝗱","𝗲","𝗳","𝗴","𝗵","𝗶","𝗷","𝗸","𝗹","𝗺","𝗻","𝗼","𝗽","𝗾","𝗿","𝘀","𝘁","𝘂","𝘃","𝘄","𝘅","𝘆","𝘇",
        "𝟬","𝟭","𝟮","𝟯","𝟰","𝟱","𝟲","𝟳","𝟴","𝟵"
      ];
      return text.split('').map(char => {
        const index = normal.indexOf(char);
        return index > -1 ? bold[index] : char;
      }).join('');
    }

    if (logMessageData.addedParticipants.some(i => i.userNumber == api.getCurrentUserID())) return;

    const addedParticipants = logMessageData.addedParticipants;
    for (const participant of addedParticipants) {
      const { userID, fullName } = participant;
      
      // جلب اسم اللي ضاف الشخص (Inviter)
      const inviterName = (await usersData.get(author)).name;

      // إعداد الرسالة الفخمة
      let msg = `╔════════════════════════════╗\n`;
      msg += `     ${masterBold("WELCOME TO OUR GROUP")}\n`;
      msg += `╚════════════════════════════╝\n\n`;
      msg += `👤 **${masterBold("Member")}:** ${fullName}\n`;
      msg += `📥 **${masterBold("Added By")}:** ${inviterName}\n`;
      msg += `🏰 **${masterBold("Group")}:** ${threadName}\n`;
      msg += `📊 **${masterBold("Count")}:** ${masterBold(participantIDs.length.toString())}\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `✨ **${masterBold("System")}:** ${masterBold("YUAN SYSTEM V8")}\n`;
      msg += `👑 **${masterBold("Maestro")}:** ${masterBold("ALEN")}`;

      // رابط الصورة (تقدر تبدلو بأي رابط صورة ترحيبية بغيتي)
      const imageUrl = `https://api.popcat.xyz/welcomecard?background=https://i.imgur.com/8M7Xf9b.jpg&text1=${encodeURIComponent(fullName)}&text2=${encodeURIComponent(threadName)}&text3=Welcome+to+Yuan+System`;

      try {
        const imagePath = path.join(__dirname, "cache", `welcome_${userID}.png`);
        const { downloadFile } = global.utils;
        await downloadFile(imageUrl, imagePath);

        await api.sendMessage({
          body: msg,
          attachment: fs.createReadStream(imagePath)
        }, threadID, () => fs.unlinkSync(imagePath));
      } catch (err) {
        // في حالة فشل الصورة يرسل فقط النص
        await api.sendMessage(msg, threadID);
      }
    }
  }
};
