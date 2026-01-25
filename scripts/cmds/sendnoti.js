const { getStreamsFromAttachment, getTime } = global.utils;

module.exports = {
	config: {
		name: "sendnoti",
		version: "1.6",
		author: "NTKhang & Gemini",
		countDown: 5,
		role: 2, // للمطورين والمالكين فقط
		description: {
			en: "إرسال إشعارات لمجموعات مخصصة بدون قيود الرتبة"
		},
		category: "box chat",
		guide: {
			en: "   {pn} create [اسم_القائمة]: إنشاء قائمة جديدة\n   {pn} add [اسم_القائمة]: إضافة المجموعة الحالية للقائمة\n   {pn} list: عرض القوائم\n   {pn} send [اسم_القائمة] | [الرسالة]: إرسال الإشعار"
		}
	},

	onStart: async function ({ message, event, args, usersData, threadsData, api, role }) {
		const { threadID, senderID } = event;
		const groupsSendNotiData = await usersData.get(senderID, 'data.groupsSendNoti', []);

		switch (args[0]) {
			case "create": {
				const groupName = args.slice(1).join(' ');
				const groupID = Date.now();
				if (!groupName) return message.reply("يرجى إدخال اسم للقائمة.");

				if (groupsSendNotiData.some(item => item.groupName === groupName))
					return message.reply(`القائمة "${groupName}" موجودة بالفعل.`);

				groupsSendNotiData.push({ groupName, groupID, threadIDs: [] });
				await usersData.set(senderID, groupsSendNotiData, 'data.groupsSendNoti');
				message.reply(`✅ تم إنشاء القائمة: ${groupName}`);
				break;
			}
			case "add": {
				const groupName = args.slice(1).join(' ');
				if (!groupName) return message.reply("أدخل اسم القائمة لإضافة هذه المجموعة.");
				const getGroup = groupsSendNotiData.find(item => item.groupName == groupName);

				if (!getGroup) return message.reply("هذه القائمة غير موجودة.");

				if (getGroup.threadIDs.includes(threadID)) return message.reply("هذه المجموعة مضافة بالفعل.");

				getGroup.threadIDs.push(threadID);
				await usersData.set(senderID, groupsSendNotiData, 'data.groupsSendNoti');
				message.reply(`✅ تمت إضافة المجموعة بنجاح إلى قائمة: ${groupName}`);
				break;
			}
			case "list": {
				if (!groupsSendNotiData.length) return message.reply("ليس لديك أي قوائم حالياً.");
				const msg = groupsSendNotiData.reduce((acc, item) => {
					acc += `• ${item.groupName} (${item.threadIDs.length} مجموعة)\n`;
					return acc;
				}, 'قوائمك الحالية:\n');
				message.reply(msg);
				break;
			}
			case "send": {
				const groupName = args.slice(1).join(' ').split('|')[0].trim();
				if (!groupName) return message.reply("أدخل اسم القائمة للإرسال.");

				const getGroup = groupsSendNotiData.find(item => item.groupName == groupName);
				if (!getGroup || getGroup.threadIDs.length == 0) return message.reply("القائمة فارغة أو غير موجودة.");

				const messageSend = args.slice(1).join(' ').split('|').slice(1).join(' ').trim();
				if (!messageSend && !event.attachments.length) return message.reply("يرجى كتابة رسالة للإرسال.");

				const formSend = { body: messageSend };
				if (event.attachments.length || (event.messageReply && event.messageReply.attachments.length)) {
					formSend.attachment = await getStreamsFromAttachment([...event.attachments, ...(event.messageReply?.attachments || [])].filter(item => ["photo", 'png', "animated_image", "video", "audio"].includes(item.type)));
				}

				const success = [], failed = [];
				const { threadIDs } = getGroup;
				const msgStatus = await message.reply(`⏳ جاري الإرسال إلى ${threadIDs.length} مجموعة...`);

				for (const tid of threadIDs) {
					await new Promise(r => setTimeout(r, 1000)); // تأخير ثانية لمنع الحظر
					try {
						await new Promise((resolve, reject) => {
							api.sendMessage(formSend, tid, (err) => err ? reject(err) : resolve());
						});
						success.push(tid);
					} catch (err) {
						failed.push(tid);
					}
				}

				api.unsendMessage(msgStatus.messageID);
				message.reply(`✅ تم الإرسال بنجاح إلى: ${success.length}\n❌ فشل الإرسال إلى: ${failed.length}`);
				break;
			}
			case "remove": {
				const groupName = args.slice(1).join(' ');
				const findIndex = groupsSendNotiData.findIndex(item => item.groupName == groupName);
				if (findIndex == -1) return message.reply("القائمة غير موجودة.");
				groupsSendNotiData.splice(findIndex, 1);
				await usersData.set(senderID, groupsSendNotiData, 'data.groupsSendNoti');
				message.reply(`🗑️ تم حذف القائمة: ${groupName}`);
				break;
			}
			default: return message.reply("استخدم: create, add, list, send, remove");
		}
	}
};

