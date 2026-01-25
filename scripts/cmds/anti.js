const { getStreamFromURL, uploadImgbb } = global.utils;

module.exports = {
	config: {
		name: "anti", // الاسم القصير الذي طلبته
		aliases: ["antichange", "ac"], // اختصارات إضافية
		version: "2.0",
		author: "𝗦𝗵𝗔𝗻",
		countDown: 2,
		role: 2,
		description: {
			en: "Anti change group info - Silent with 💀 reaction"
		},
		category: "𝗕𝗢𝗫 𝗖𝗛𝗔𝗧",
		guide: {
			en: "   {pn} name [on/off]: حماية الاسم\n   {pn} nc [on/off]: حماية الكنيات\n   {pn} avt [on/off]: حماية الصورة"
		}
	},

	onStart: async function ({ api, event, args, threadsData }) {
		const { threadID, messageID } = event;
		let option = args[0]?.toLowerCase();
		const status = args[1]?.toLowerCase();

		if (!["on", "off"].includes(status)) return;

		// تحويل الاختصار nc إلى nickname ليتوافق مع قاعدة البيانات دون تخريب الكود
		if (option === "nc") option = "nickname";
		if (option === "avt") option = "avatar";

		const dataAntiChange = await threadsData.get(threadID, "data.antiChangeInfoBox", {});

		async function saveAndReact() {
			await threadsData.set(threadID, dataAntiChange, "data.antiChangeInfoBox");
			return api.setMessageReaction("💀", messageID, () => {}, true);
		}

		if (status === "off") {
			delete dataAntiChange[option];
			await saveAndReact();
			return;
		}

		// تنفيذ الـ ON حسب النوع
		const threadInfo = await threadsData.get(threadID);
		switch (option) {
			case "avatar": {
				if (!threadInfo.imageSrc) return;
				const newImageSrc = await uploadImgbb(threadInfo.imageSrc);
				dataAntiChange.avatar = newImageSrc.image.url;
				break;
			}
			case "name": {
				dataAntiChange.name = threadInfo.threadName;
				break;
			}
			case "nickname": {
				dataAntiChange.nickname = threadInfo.members.map(user => ({ [user.userID]: user.nickname })).reduce((a, b) => ({ ...a, ...b }), {});
				break;
			}
			case "theme": {
				dataAntiChange.theme = threadInfo.threadThemeID;
				break;
			}
			case "emoji": {
				dataAntiChange.emoji = threadInfo.emoji;
				break;
			}
			default: return;
		}

		await saveAndReact();
	},

	onEvent: async function ({ event, threadsData, role, api }) {
		const { threadID, logMessageType, logMessageData, author } = event;
		const botID = api.getCurrentUserID();

		// العمل بصمت تام: إذا كان المغير هو البوت أو أدمن، يتم تحديث البيانات. إذا كان عضو عادي، يتم الترجيع بصمت.
		const dataAntiChange = await threadsData.get(threadID, "data.antiChangeInfoBox", {});

		switch (logMessageType) {
			case "log:thread-image": {
				if (!dataAntiChange.avatar) return;
				if (role < 1 && author !== botID) {
					api.changeGroupImage(await getStreamFromURL(dataAntiChange.avatar), threadID);
				} else {
					const newImg = await uploadImgbb(logMessageData.url);
					await threadsData.set(threadID, newImg.image.url, "data.antiChangeInfoBox.avatar");
				}
				break;
			}
			case "log:thread-name": {
				if (!dataAntiChange.hasOwnProperty("name")) return;
				if (role < 1 && author !== botID) {
					api.setTitle(dataAntiChange.name, threadID);
				} else {
					await threadsData.set(threadID, logMessageData.name, "data.antiChangeInfoBox.name");
				}
				break;
			}
			case "log:user-nickname": {
				if (!dataAntiChange.hasOwnProperty("nickname")) return;
				const { nickname, participant_id } = logMessageData;
				if (role < 1 && author !== botID) {
					api.changeNickname(dataAntiChange.nickname[participant_id] || "", threadID, participant_id);
				} else {
					await threadsData.set(threadID, nickname, `data.antiChangeInfoBox.nickname.${participant_id}`);
				}
				break;
			}
			// ... يمكن إضافة التيم والايموجي بنفس الطريقة إذا أردت
		}
	}
};

