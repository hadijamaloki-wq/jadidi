module.exports = {
    config: {
        name: "leave",
        version: "2.0.0",
        author: "Alen (Maestro)",
        category: "events"
    },

    onStart: async ({ api, event, usersData, threadsData }) => {
        if (event.logMessageType !== "log:unsubscribe") return;

        const { threadID, author } = event;
        const leftID = event.logMessageData.leftParticipantFbId;

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

        // لا ترسل رسالة إذا كان البوت هو الذي غادر
        if (leftID == api.getCurrentUserID()) return;

        try {
            const userName = await usersData.getName(leftID);
            const thread = await threadsData.get(threadID);
            const threadName = thread.threadName;
            const isSelfLeave = leftID === author;

            let msg = `╔════════════════════════════╗\n`;
            msg += `     ${masterBold("GOODBYE FROM GROUP")}\n`;
            msg += `╚════════════════════════════╝\n\n`;
            msg += `👤 **${masterBold("Member")}:** ${userName}\n`;
            msg += `🏰 **${masterBold("Group")}:** ${threadName}\n`;
            msg += `⚠️ **${masterBold("Status")}:** ${isSelfLeave ? "غادر المجموعة بنفسه 👋" : "تم طرده من قبل الإدارة 🛡️"}\n`;
            msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
            msg += `💔 ${masterBold("We wish you the best luck!")}\n\n`;
            msg += `✨ **${masterBold("System")}:** ${masterBold("YUAN SYSTEM V8")}\n`;
            msg += `👑 **${masterBold("Maestro")}:** ${masterBold("ALEN")}`;

            await api.sendMessage(msg, threadID);
        } catch (e) {
            console.log("خطأ في رسالة الوداع:", e);
        }
    }
};
