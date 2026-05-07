module.exports = {
  config: {
    name: "v",
    version: "3.0.0",
    author: "Amine (Alen) & Custom Build",
    countDown: 2,
    role: 2,
    shortDescription: { en: "قفل الكنيات بسرعة وقوة رهيبة" },
    category: "حماية",
    guide: { en: ".v vv on [كنية] | .v vv off | .v cc on | .v cc off | .v t [كنيتك]" }
  },

  // خاصية تشغيل المهام بالتوازي مع حد أقصى لتفادي الحظر
  async runConcurrent(tasks, limit = 8, delayMs = 200) {
    const results = [];
    const executing = [];
    for (const task of tasks) {
      const p = task().then(r => {
        executing.splice(executing.indexOf(p), 1);
        return r;
      });
      results.push(p);
      executing.push(p);
      if (executing.length >= limit) await Promise.race(executing);
      if (results.length % limit === 0) await new Promise(r => setTimeout(r, delayMs));
    }
    return Promise.all(results);
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, senderID } = event;
    const action = args[0];
    const subAction = args[1];

    // تغيير كنية المطور (/v t)
    if (action === "t") {
      const nick = args.slice(1).join(" ");
      if (!nick) return message.reply("💍 اكتب الكنية الجديدة.");
      await api.changeNickname(nick, threadID, senderID);
      return message.reply("💍 تم تحديث كنيتك يا غالي.");
    }

    // ================== توحيد الكنيات ==================
    if (action === "vv") {
      if (subAction === "on") {
        const nick = args.slice(2).join(" ");
        if (!nick) return message.reply("💍 اكتب الكنية اللي تبي تفرضها على الكل.");

        // حفظ القفل
        global.GoatBot.vv_lock = global.GoatBot.vv_lock || {};
        global.GoatBot.vv_lock[threadID] = nick;
        // إطفاء قفل المسح إن شغال
        if (global.GoatBot.cc_lock?.[threadID]) delete global.GoatBot.cc_lock[threadID];

        const info = await api.getThreadInfo(threadID);
        if (!info.participantIDs) return message.reply("❌ فشل تحميل الأعضاء.");

        message.reply("⏳ يتم توحيد الكنيات بسرعة الصاروخ...");

        const tasks = info.participantIDs.map(id => () =>
          api.changeNickname(nick, threadID, id).catch(() => {})
        );

        await this.runConcurrent(tasks, 8, 250);
        // تشغيل الفحص الاحتياطي الدوري
        this._startNickInterval(api, threadID);
        return message.reply(`✅ تم فرض الكنية: ${nick}\n🔒 القفل نشط، أي تغيير يرجع فوراً.`);
      }

      if (subAction === "off") {
        if (global.GoatBot.vv_lock?.[threadID]) {
          delete global.GoatBot.vv_lock[threadID];
          this._stopNickInterval(threadID);
        }
        return message.reply("✅ تم إيقاف توحيد الكنيات.");
      }
    }

    // ================== مسح جميع الكنيات ==================
    if (action === "cc") {
      if (subAction === "on") {
        global.GoatBot.cc_lock = global.GoatBot.cc_lock || {};
        global.GoatBot.cc_lock[threadID] = true;
        if (global.GoatBot.vv_lock?.[threadID]) delete global.GoatBot.vv_lock[threadID];

        const info = await api.getThreadInfo(threadID);
        if (!info.participantIDs) return message.reply("❌ فشل تحميل الأعضاء.");

        message.reply("⏳ جاري مسح جميع الكنيات...");

        const tasks = info.participantIDs.map(id => () =>
          api.changeNickname("", threadID, id).catch(() => {})
        );

        await this.runConcurrent(tasks, 8, 250);
        this._startNickInterval(api, threadID);
        return message.reply("✅ تم مسح الكنيات وقفلها.\n🔒 أي كنية جديدة تنمسح فوراً.");
      }

      if (subAction === "off") {
        if (global.GoatBot.cc_lock?.[threadID]) {
          delete global.GoatBot.cc_lock[threadID];
          this._stopNickInterval(threadID);
        }
        return message.reply("✅ تم إيقاف قفل المسح.");
      }
    }
  },

  // ================== مراقب احتياطي كل 7 ثوان ==================
  _nickIntervals: {},

  _startNickInterval(api, threadID) {
    if (this._nickIntervals[threadID]) return;
    this._nickIntervals[threadID] = setInterval(async () => {
      const vvNick = global.GoatBot.vv_lock?.[threadID];
      const ccActive = global.GoatBot.cc_lock?.[threadID];
      if (!vvNick && !ccActive) {
        this._stopNickInterval(threadID);
        return;
      }
      try {
        const info = await api.getThreadInfo(threadID);
        if (!info.participantIDs) return;
        const botID = api.getCurrentUserID();
        const promises = info.participantIDs
          .filter(id => id !== botID && !global.config.adminBot.includes(id))
          .map(id => {
            (async () => {
              try {
                if (vvNick) await api.changeNickname(vvNick, threadID, id);
                else if (ccActive) await api.changeNickname("", threadID, id);
              } catch (e) {}
            })();
          });
        // نرسل عدد محدود كل دفعة لتخفيف الضغط
        await Promise.allSettled(promises.slice(0, 5));
      } catch (e) {}
    }, 7000);
  },

  _stopNickInterval(threadID) {
    if (this._nickIntervals[threadID]) {
      clearInterval(this._nickIntervals[threadID]);
      delete this._nickIntervals[threadID];
    }
  },

  // ================== حدث تغيير الكنية (يرد فوراً) ==================
  onEvent: async function ({ api, event }) {
    const { threadID, logMessageType, logMessageData, author } = event;
    const botID = api.getCurrentUserID();
    if (author === botID) return;
    if (global.config.adminBot?.includes(author)) return;

    if (logMessageType !== "log:nickname") return;

    const participantID = logMessageData.participant_id;
    const vvNick = global.GoatBot.vv_lock?.[threadID];
    const ccActive = global.GoatBot.cc_lock?.[threadID];

    // استرجاع فوري مع محاولة مرتين إذا فشل
    const revert = async (nickToSet) => {
      for (let i = 0; i < 2; i++) {
        try {
          await api.changeNickname(nickToSet, threadID, participantID);
          break;
        } catch (e) {
          await new Promise(r => setTimeout(r, 250));
        }
      }
    };

    if (vvNick) revert(vvNick);
    else if (ccActive) revert("");
  }
};
