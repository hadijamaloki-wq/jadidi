const { getStreamFromURL, uploadImgbb } = global.utils;

module.exports = {
	config: {
		name: "anti", // تغيير اسم الأمر إلى anti
		aliases: ["antichange", "ac"],
		version: "2.0",
		author: "𝗦𝗵𝗔𝗻 & Gemini",
		countDown: 5,
		role: 2,
		description: {
			en: "Anti change info box - Silent mode with 🥴 reaction"
		},
		category: "𝗕𝗢𝗫 𝗖𝗛𝗔𝗧",
		guide: {
			en: "   {pn} avt [on | off]\n   {pn} name [on | off]\n   {pn} nc [on | off]\n   {pn} theme [on | off]\n   {pn} emoji [on | off]"
		}
	},

	onStart: async function ({ message, event, args, threadsData, api }) {
		let option = args[0]?.toLowerCase();
		const status = args[1]?.toLowerCase();

		if (!["on", "off"].includes(status)) return;

		// دعم اختصار nc للكنيات
		if (option === "nc") option = "nickname";

		const { threadID, messageID } = event;
		const dataAntiChangeInfoBox = await threadsData.get(threadID, "data.antiChangeInfoBox", {});

		async function checkAndSaveData(key, data) {
			if (status === "off")
				delete dataAntiChangeInfoBox[key];
			else
				dataAntiChangeInfoBox[key] = data;

			await threadsData.set(threadID, dataAntiChangeInfoBox, "data.antiChangeInfoBox");
			// التفاعل بالإيموجي المطلوب عند التشغيل أو الإيقاف 🥴
			api.setMessageReaction("🥴", messageID, () => {}, true);
		}

		switch (option) {
			case "avt":
			case "avatar": {
				const { imageSrc } = await threadsData.get(threadID);
				if (!imageSrc && status === "on") return;
				const newImageSrc = status === "on" ? await uploadImgbb(imageSrc) : null;
				await checkAndSaveData("avatar", newImageSrc ? newImageSrc.image.url : null);
				break;
			}
			case "name": {
				const { threadName } = await threadsData.get(threadID);
				await checkAndSaveData("name", threadName);
				break;
			}
			case "nickname": {
				const { members } = await threadsData.get(threadID);
				await checkAndSaveData("nickname", members.map(user => ({ [user.userID]: user.nickname })).reduce((a, b) => ({ ...a, ...b }), {}));
				break;
			}
			case "theme": {
				const { threadThemeID } = await threadsData.get(threadID);
				await checkAndSaveData("theme", threadThemeID);
				break;
			}
			case "emoji": {
				const { emoji } = await threadsData.get(threadID);
				await checkAndSaveData("emoji", emoji);
				break;
			}
			default: return;
		}
	},

	onEvent: async function ({ event, threadsData, role, api }) {
		const { threadID, logMessageType, logMessageData, author } = event;
		const botID = api.getCurrentUserID();

		// العمل بصمت تام (حذف جميع الردود النصية message.reply)
		switch (logMessageType) {
			case "log:thread-image": {
				const dataAntiChange = await threadsData.get(threadID, "data.antiChangeInfoBox", {});
				if (!dataAntiChange.avatar) return;
				return async function () {
					if (role < 1 && botID !== author) {
						api.changeGroupImage(await getStreamFromURL(dataAntiChange.avatar), threadID);
					} else {
						const imageSrc = logMessageData.url;
						if (!imageSrc) return await threadsData.set(threadID, "REMOVE", "data.antiChangeInfoBox.avatar");
						const newImageSrc = await uploadImgbb(imageSrc);
						await threadsData.set(threadID, newImageSrc.image.url, "data.antiChangeInfoBox.avatar");
					}
				};
			}
			case "log:thread-name": {
				const dataAntiChange = await threadsData.get(threadID, "data.antiChangeInfoBox", {});
				if (!dataAntiChange.hasOwnProperty("name")) return;
				return async function () {
					if (role < 1 && botID !== author) {
						api.setTitle(dataAntiChange.name, threadID);
					} else {
						await threadsData.set(threadID, logMessageData.name, "data.antiChangeInfoBox.name");
					}
				};
			}
			case "log:user-nickname": {
				const dataAntiChange = await threadsData.get(threadID, "data.antiChangeInfoBox", {});
				if (!dataAntiChange.hasOwnProperty("nickname")) return;
				return async function () {
					const { nickname, participant_id } = logMessageData;
					if (role < 1 && botID !== author) {
						api.changeNickname(dataAntiChange.nickname[participant_id] || "", threadID, participant_id);
					} else {
						await threadsData.set(threadID, nickname, `data.antiChangeInfoBox.nickname.${participant_id}`);
					}
				};
			}
			case "log:thread-color": {
				const dataAntiChange = await threadsData.get(threadID, "data.antiChangeInfoBox", {});
				if (!dataAntiChange.hasOwnProperty("theme")) return;
				return async function () {
					if (role < 1 && botID !== author) {
						api.changeThreadColor(dataAntiChange.theme || "196241301102133", threadID);
					} else {
						await threadsData.set(threadID, logMessageData.theme_id, "data.antiChangeInfoBox.theme");
					}
				};
			}
			case "log:thread-icon": {
				const dataAntiChange = await threadsData.get(threadID, "data.antiChangeInfoBox", {});
				if (!dataAntiChange.hasOwnProperty("emoji")) return;
				return async function () {
					if (role < 1 && botID !== author) {
						api.changeThreadEmoji(dataAntiChange.emoji, threadID);
					} else {
						await threadsData.set(threadID, logMessageData.thread_icon, "data.antiChangeInfoBox.emoji");
					}
				};
			}
		}
	}
};
