module.exports = {
  config: {
    name: "test",
    version: "1.0.0",
    author: "Amine",
    countDown: 2,
    role: 0,
    shortDescription: { en: "اختبار البوت" },
    category: "info"
  },

  onStart: async function ({ message }) {
    return message.reply("💍 البوت شغال يا أمين، الأوامر جاهزة!");
  }
};
