module.exports = {
  config: {
    name: "v",
    version: "2.2.0",
    author: "Amine (Alen) & Improved",
    countDown: 2,
    role: 2,
    shortDescription: { en: "توحيد ومسح الكنيات بقوة وسرعة" },
    category: "حماية",
    guide: { en: ".v vv on [الكنية] | .v vv off | .v cc on | .v cc off | .v t [كنيتك]" }
  },

  // دالة لتوزيع المهام بشكل متوازي مع حد أقصى للطلبات المتزامنة
  async runWithConcurrency(tasks, concurrency = 7, delayMs = 250) {
    const results = [];
    const executing = [];
    for (const task of tasks) {
      const p = task().then(result => {
        executing.splice(executing.indexOf(p), 1);
        return result;
      });
      results.push(p);
      executing.push(p);
      if (executing.length >= concurrency) {
        await Promise.race(executing);
      }
      // تأخير صغير بين الدفعات
      if (results.length % concurrency === 0) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    }
    return Promise.all(results);
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, senderID } = event;
    const action = args[0];
    const subAction = args[1];

    // تغيير كنية المطور
    if (action === "t") {
      const myNick = args.slice(1).join(" ");
      if (!myNick) return message.reply("💍 اكتب الكنية");
      await api.changeNickname(myNick, threadID, senderID);
      return message.reply("💍 تم تحديث كنيتك يا كينج");
    }

    // =============== توحيد الكنيات ===============
    if (action === "vv") {
      if (subAction === "on") {
        const nick = args.slice(2).join(" ");
        if (!nick) return message.reply("💍 اكتب الكنية اللي تبي تفرضها");

        // تسجيل القفل
        global.GoatBot.vv_lock = global.GoatBot.vv_lock || {};
        global.GoatBot.vv_lock[threadID] = nick;
        if (global.GoatBot.cc_lock?.[threadID]) delete global.GoatBot.cc_lock[threadID];

        const info = await api.getThreadInfo(threadID);
        if (!info.participantIDs) return message.reply("❌ فشل تحميل الأعضاء");

        message.reply("⏳ جاري توحيد الكنيات بسرعة...");

        const tasks = info.participantIDs.map(id => async () => {
          try {
            await api.changeNickname(nick, threadID, id);
          } catch (e) {
            // تجاهل خطأ العضو اللي ما تقدر تغير نيكه
          }
        });

        await this.runWithConcurrency(tasks, 7, 350);
        return message.reply(`✅ تم توحيد الكنيات وإقفالها: ${nick}`);
      }
      if (subAction === "off") {
        if (global.GoatBot.vv_lock?.[threadID]) {
          delete global.GoatBot.vv_lock[threadID];
          // إيقاف الفحص الدوري لو موجود
          this._stopInterval(threadID);
        }
        return message.reply("✅ تم إيقاف توحيد الكنيات");
      }
    }

    // =============== مسح الكنيات ===============
    if (action === "cc") {
      if (subAction === "on") {
        global.GoatBot.cc_lock = global.GoatBot.cc_lock || {};
        global.GoatBot.cc_lock[threadID] = true;
        if (global.GoatBot.vv_lock?.[threadID]) delete global.GoatBot.vv_lock[threadID];

        const info = await api.getThreadInfo(threadID);
        if (!info.participantIDs) return message.reply("❌ فشل تحميل الأعضاء");

        message.reply("⏳ جاري مسح الكنيات...");

        const tasks = info.participantIDs.map(id => async () => {
          try {
            await api.changeNickname("", threadID, id);
          } catch (e) {}
        });

        await this.runWithConcurrency(tasks, 7, 350);
        return message.reply("✅ تم مسح الكنيات وقفلها");
      }
      if (subAction === "off") {
        if (global.GoatBot.cc_lock?.[threadID]) {
          delete global.GoatBot.cc_lock[threadID];
          this._stopInterval(threadID);
        }
        return message.reply("✅ تم إيقاف قفل المسح");
      }
    }

    // =============== تشغيل المراقب الاحتياطي ===============
    this._startIntervalForThread(api, threadID);
  },

  // فاصل زمني احتياطي (كل 12 ثانية) علشان يرجع أي نيك متغير إذا الحدث ما اشتغل
  _intervals: {},

  _startIntervalForThread(api, threadID) {
    if (this._intervals[threadID]) return;
    this._intervals[threadID] = setInterval(async () => {
      const vvNick = global.GoatBot.vv_lock?.[threadID];
      const ccActive = global.GoatBot.cc_lock?.[threadID];
      if (!vvNick && !ccActive) {
        this._stopInterval(threadID);
        return;
      }
      try {
        const info = await api.getThreadInfo(threadID);
        if (!info.participantIDs) return;
        const botID = api.getCurrentUserID();
        const promises = info.participantIDs.map(async (id) => {
          if (id === botID || global.config.adminBot.includes(id)) return;
          try {
            const user = info.userInfo?.find?.(u => u.id === id); // قد لا يدعم كل المكاتب
            // بديل: استعمل api.getUserInfo لو متوفر، لكن هنا نبسط
            // نفحص النيك الحالي عن طريق حدث سريع – صعب بدون API مناسب.
            // سنكتفي بإرسال تغيير عام (سيتم تجاهله لو مطابق)
            if (vvNick) {
              await api.changeNickname(vvNick, threadID, id);
            } else if (ccActive) {
              await api.changeNickname("", threadID, id);
            }
          } catch (e) {}
        });
        // تنفيذ بشكل متزامن ولكن بقلة طلبات
        await Promise.all(promises.slice(0, 8)); // عدد محدود كل مرة
      } catch (e) {}
    }, 12000);
  },

  _stopInterval(threadID) {
    if (this._intervals[threadID]) {
      clearInterval(this._intervals[threadID]);
      delete this._intervals[threadID];
    }
  },

  onEvent: async function ({ api, event }) {
    const { threadID, logMessageType, logMessageData, author } = event;
    const botID = api.getCurrentUserID();
    if (author === botID) return;
    if (global.config.adminBot.includes(author)) return;

    // أحداث تغيير النيك
    if (logMessageType !== "log:nickname") return;

    const participantID = logMessageData.participant_id;

    // أولوية vv ثم cc
    if (global.GoatBot.vv_lock?.[threadID]) {
      const nick = global.GoatBot.vv_lock[threadID];
      // محاولة فورية مع إعادة صغيرة
      for (let i = 0; i < 2; i++) {
        try {
          await api.changeNickname(nick, threadID, participantID);
          break;
        } catch (e) {
          await new Promise(r => setTimeout(r, 300));
        }
      }
    } else if (global.GoatBot.cc_lock?.[threadID]) {
      for (let i = 0; i < 2; i++) {
        try {
          await api.changeNickname("", threadID, participantID);
          break;
        } catch (e) {
          await new Promise(r => setTimeout(r, 300));
        }
      }
    }
  }
};
