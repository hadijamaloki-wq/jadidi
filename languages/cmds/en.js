module.exports = {
	// Custom language file by Alen (Maestro) - YUAN SYSTEM
	onlyadminbox: {
		description: "تشغيل/إيقاف استخدام البوت من قبل مشرفي المجموعة فقط",
		guide: "   {pn} [on | off]",
		text: {
			turnedOn: "✅ | تم تفعيل وضع استخدام البوت للمشرفين فقط",
			turnedOff: "✅ | تم إيقاف وضع استخدام البوت للمشرفين فقط",
			syntaxError: "❌ | خطأ في الصيغة، استخدم {pn} on أو {pn} off"
		}
	},
	adduser: {
		description: "إضافة عضو إلى مجموعتك",
		guide: "   {pn} [رابط الحساب | الأيدي UID]",
		text: {
			alreadyInGroup: "⚠️ | هذا العضو موجود بالفعل في المجموعة",
			successAdd: "✅ | تم إضافة %1 عضو إلى المجموعة بنجاح",
			failedAdd: "❌ | فشلت إضافة %1 عضو إلى المجموعة",
			approve: "✅ | تم إضافة %1 عضو إلى قائمة الموافقة (الانتظار)",
			invalidLink: "⚠️ | يرجى إدخال رابط فيسبوك صحيح",
			cannotGetUid: "❌ | لا يمكن استخراج الأيدي (UID) الخاص بهذا المستخدم",
			linkNotExist: "❌ | رابط الحساب هذا غير موجود",
			cannotAddUser: "❌ | لا يمكن إضافة العضو، البوت محظور أو المستخدم يمنع إضافته من الغرباء"
		}
	},
	admin: {
		description: "إضافة، إزالة، أو تعديل صلاحيات الأدمن",
		guide: "   {pn} [add | -a] <uid>: رفع المستخدم كأدمن\n\t  {pn} [remove | -r] <uid>: تنزيل المستخدم من قائمة الأدمن\n\t  {pn} [list | -l]: عرض قائمة الأدمن",
		text: {
			added: "✅ | تم رفع %1 مستخدم كأدمن:\n%2",
			alreadyAdmin: "\n⚠️ | %1 مستخدم لديهم صلاحية الأدمن مسبقاً:\n%2",
			missingIdAdd: "⚠️ | يرجى إدخال الأيدي أو عمل منشن للمستخدم لرفعه كأدمن",
			removed: "✅ | تم إزالة صلاحية الأدمن من %1 مستخدم:\n%2",
			notAdmin: "⚠️ | %1 مستخدم ليسوا أدمن في الأساس:\n%2",
			missingIdRemove: "⚠️ | يرجى إدخال الأيدي أو عمل منشن للمستخدم لإزالة صلاحيته",
			listAdmin: "👑 | قائمة مطوري ومشرفي نظام يوان:\n%1"
		}
	},
	adminonly: {
		description: "تشغيل/إيقاف استخدام البوت للمطور فقط",
		guide: "{pn} [on | off]",
		text: {
			turnedOn: "✅ | تم تفعيل وضع المطور فقط (لا أحد يمكنه استخدام البوت سواك)",
			turnedOff: "✅ | تم إيقاف وضع المطور فقط (الجميع يمكنهم الاستخدام)",
			syntaxError: "❌ | خطأ في الصيغة، استخدم {pn} on أو {pn} off"
		}
	},
	all: {
		description: "عمل منشن (تاغ) لجميع أعضاء المجموعة",
		guide: "{pn} [الرسالة | فارغ]"
	},
	anime: {
		description: "صور أنمي عشوائية",
		guide: "{pn} <النوع>\n   الأنواع المتاحة: neko, kitsune, hug, pat, waifu, cry, kiss, slap, smug, punch",
		text: {
			loading: "⏳ | جاري تجهيز الصورة، يرجى الانتظار...",
			error: "❌ | حدث خطأ، يرجى المحاولة لاحقاً"
		}
	},
	antichangeinfobox: {
		description: "حماية معلومات المجموعة من التغيير",
		guide: "   {pn} avt [on | off]: منع تغيير صورة المجموعة\n   {pn} name [on | off]: منع تغيير اسم المجموعة\n   {pn} theme [on | off]: منع تغيير السمة (اللون)\n   {pn} emoji [on | off]: منع تغيير الإيموجي",
		text: {
			antiChangeAvatarOn: "✅ | تم تفعيل حماية صورة المجموعة",
			antiChangeAvatarOff: "✅ | تم إيقاف حماية صورة المجموعة",
			missingAvt: "⚠️ | مجموعتك لا تمتلك صورة حالياً لحمايتها",
			antiChangeNameOn: "✅ | تم تفعيل حماية اسم المجموعة",
			antiChangeNameOff: "✅ | تم إيقاف حماية اسم المجموعة",
			antiChangeThemeOn: "✅ | تم تفعيل حماية سمة (لون) المجموعة",
			antiChangeThemeOff: "✅ | تم إيقاف حماية سمة (لون) المجموعة",
			antiChangeEmojiOn: "✅ | تم تفعيل حماية إيموجي المجموعة",
			antiChangeEmojiOff: "✅ | تم إيقاف حماية إيموجي المجموعة",
			antiChangeAvatarAlreadyOn: "⚠️ | حماية الصورة مفعلة مسبقاً",
			antiChangeNameAlreadyOn: "⚠️ | حماية الاسم مفعلة مسبقاً",
			antiChangeThemeAlreadyOn: "⚠️ | حماية السمة مفعلة مسبقاً",
			antiChangeEmojiAlreadyOn: "⚠️ | حماية الإيموجي مفعلة مسبقاً"
		}
	},
	appstore: {
		description: "البحث عن تطبيقات في متجر AppStore",
		text: {
			missingKeyword: "⚠️ | لم تقم بكتابة اسم التطبيق للبحث عنه",
			noResult: "❌ | لم يتم العثور على نتائج للتطبيق: %1"
		}
	},
	autosetname: {
		description: "تغيير اللقب التلقائي للأعضاء الجدد",
		guide: "   {pn} set <اللقب>: لضبط اللقب التلقائي، الاختصارات:\n   + {userName}: اسم العضو\n   + {userID}: أيدي العضو\n   مثال:\n    {pn} set {userName} 🚀\n\n   {pn} [on | off]: تشغيل/إيقاف الميزة\n\n   {pn} [view | info]: عرض الإعداد الحالي",
		text: {
			missingConfig: "⚠️ | يرجى إدخال الإعداد المطلوب",
			configSuccess: "✅ | تم ضبط إعداد اللقب التلقائي بنجاح",
			currentConfig: "📑 | الإعداد الحالي للقب التلقائي في مجموعتك هو:\n%1",
			notSetConfig: "⚠️ | مجموعتك لم تقم بضبط إعداد اللقب التلقائي",
			syntaxError: "❌ | خطأ في الصيغة، استخدم {pn} on أو {pn} off",
			turnOnSuccess: "✅ | تم تفعيل ميزة اللقب التلقائي",
			turnOffSuccess: "✅ | تم إيقاف ميزة اللقب التلقائي",
			error: "❌ | حدث خطأ، جرب إيقاف ميزة 'روابط الدعوة' وحاول مجدداً"
		}
	},
	thread: {
		description: "إدارة المجموعات في نظام البوت",
		guide: "   {pn} [find | -f | search | -s] <الاسم>: البحث عن مجموعة بالاسم\n   {pn} [ban | -b] [<tid> | فارغ] <السبب>: حظر مجموعة من استخدام البوت\n   {pn} unban [<tid> | فارغ]: فك الحظر عن المجموعة",
		text: {
			noPermission: "❌ | ليس لديك الصلاحية لاستخدام هذه الميزة (خاص بالمطور)",
			found: "🔎 | تم العثور على %1 مجموعة تطابق \"%3\":\n%3",
			notFound: "❌ | لم يتم العثور على مجموعة تطابق: \"%1\"",
			hasBanned: "⚠️ | المجموعة ذات الأيدي [%1 | %2] محظورة مسبقاً:\n» السبب: %3\n» الوقت: %4",
			banned: "✅ | تم حظر المجموعة [%1 | %2] من استخدام البوت.\n» السبب: %3\n» الوقت: %4",
			notBanned: "⚠️ | المجموعة [%1 | %2] غير محظورة",
			unbanned: "✅ | تم فك الحظر عن المجموعة [%1 | %2]",
			missingReason: "⚠️ | لا يمكن أن يكون سبب الحظر فارغاً",
			info: "» أيدي المجموعة: %1\n» الاسم: %2\n» تاريخ التسجيل: %3\n» الأعضاء: %4\n» ذكور: %5 | إناث: %6\n» إجمالي الرسائل: %7%8"
		}
	},
	tid: {
		description: "عرض أيدي (ID) مجموعتك الحالية",
		guide: "{pn}"
	},
	tik: {
		description: "تحميل فيديو أو صوت من تيك توك",
		guide: "   {pn} [video|-v|v] <الرابط>: تحميل فيديو/صور من تيك توك.\n   {pn} [audio|-a|a] <الرابط>: تحميل صوت من تيك توك",
		text: {
			invalidUrl: "⚠️ | يرجى إدخال رابط تيك توك صحيح",
			downloadingVideo: "⏳ | جاري تحميل الفيديو: %1...",
			downloadedSlide: "✅ | تم تحميل الصور: %1\n%2",
			downloadedVideo: "✅ | تم تحميل الفيديو: %1",
			downloadingAudio: "⏳ | جاري تحميل الصوت: %1...",
			downloadedAudio: "✅ | تم تحميل الصوت: %1"
		}
	},
	trigger: {
		description: "توليد صورة غاضبة",
		guide: "{pn} [@tag | فارغ]"
	},
	uid: {
		description: "عرض معرف الفيسبوك (UID) الخاص بك أو لشخص آخر",
		guide: "   {pn}: لعرض الأيدي الخاص بك\n   {pn} @tag: لعرض الأيدي للشخص المشار إليه\n   {pn} <رابط الحساب>: لعرض الأيدي من خلال رابط الحساب",
		text: {
			syntaxError: "⚠️ | يرجى عمل منشن للشخص أو ترك الأمر فارغاً لعرض الأيدي الخاص بك"
		}
	},
	avatar: {
		description: "تصميم أفاتار أنمي احترافي",
		guide: "{p}{n} <رقم أو اسم الشخصية> | <النص الخلفي> | <التوقيع> | <لون الخلفية>\n{p}{n} help: لمعرفة طريقة الاستخدام",
		text: {
			initImage: "⏳ | جاري رسم الأفاتار، يرجى الانتظار...",
			invalidCharacter: "⚠️ | يوجد حالياً %1 شخصية فقط، يرجى إدخال رقم أصغر",
			notFoundCharacter: "❌ | لم يتم العثور على شخصية باسم %1",
			errorGetCharacter: "❌ | حدث خطأ أثناء جلب الشخصية:\n%1: %2",
			success: "✅ | الأفاتار جاهز\nالشخصية: %1\nالأيدي: %2\nالنص: %3\nالتوقيع: %4\nاللون: %5",
			defaultColor: "افتراضي",
			error: "❌ | حدث خطأ:\n%1: %2"
		}
	},
	badwords: {
		description: "نظام تحذير الكلمات السيئة (يتم الطرد في المرة الثانية)",
		guide: "   {pn} add <الكلمات>: إضافة كلمات ممنوعة\n   {pn} delete <الكلمات>: حذف كلمات ممنوعة\n   {pn} list: عرض الكلمات\n   {pn} unwarn <@tag>: إزالة تحذير\n   {pn} on/off: تشغيل/إيقاف",
		text: {
			onText: "تشغيل",
			offText: "إيقاف",
			onlyAdmin: "⚠️ | المشرفون فقط يمكنهم إضافة الكلمات الممنوعة",
			missingWords: "⚠️ | لم تقم بكتابة الكلمات الممنوعة",
			addedSuccess: "✅ | تم إضافة %1 كلمات ممنوعة بنجاح",
			alreadyExist: "❌ | الكلمات %1 موجودة مسبقاً: %2",
			tooShort: "⚠️ | الكلمات %1 قصيرة جداً (أقل من حرفين): %2",
			onlyAdmin2: "⚠️ | المشرفون فقط يمكنهم الحذف",
			missingWords2: "⚠️ | لم تقم بكتابة الكلمات للحذف",
			deletedSuccess: "✅ | تم حذف %1 كلمات ممنوعة",
			notExist: "❌ | الكلمات %1 غير موجودة: %2",
			emptyList: "⚠️ | قائمة الكلمات الممنوعة فارغة",
			badWordsList: "📑 | قائمة الكلمات الممنوعة في مجموعتك: %1",
			onlyAdmin3: "⚠️ | المشرفون فقط يمكنهم %1 الميزة",
			turnedOnOrOff: "✅ | نظام الكلمات الممنوعة الآن %1",
			onlyAdmin4: "⚠️ | المشرفون فقط يمكنهم إزالة التحذيرات",
			missingTarget: "⚠️ | لم تقم بعمل منشن أو كتابة الأيدي",
			notWarned: "⚠️ | المستخدم %1 لم يتلق أي تحذير",
			removedWarn: "✅ | تم إزالة تحذير واحد من المستخدم %1 | %2",
			warned: "⚠️ | تم رصد كلمة سيئة \"%1\"، إذا تكرر الأمر سيتم طردك.",
			warned2: "⚠️ | تم رصد كلمة سيئة \"%1\"، لقد خالفت القوانين مرتين وسيتم طردك الآن.",
			needAdmin: "⚠️ | البوت يحتاج لصلاحية الأدمن ليتمكن من طرد المخالفين",
			unwarned: "✅ | تم مسح جميع تحذيرات المستخدم %1 | %2"
		}
	},
	balance: {
		description: "عرض رصيدك أو رصيد شخص آخر",
		guide: "   {pn}: عرض رصيدك\n   {pn} <@tag>: عرض رصيد شخص آخر",
		text: {
			money: "💰 | رصيدك الحالي هو: %1 دولار",
			moneyOf: "💰 | رصيد %1 هو: %2 دولار"
		}
	},
	batslap: {
		description: "صفعة باتمان (ميمز)",
		text: {
			noTag: "⚠️ | يجب عليك عمل منشن للشخص الذي تريد صفعه"
		}
	},
	busy: {
		description: "تفعيل وضع عدم الإزعاج (البوت سيرد نيابة عنك إذا تم عمل منشن لك)",
		guide: "   {pn} [فارغ | <السبب>]: تفعيل الوضع\n   {pn} off: إيقاف الوضع",
		text: {
			turnedOff: "✅ | تم إيقاف وضع عدم الإزعاج",
			turnedOn: "✅ | تم تفعيل وضع عدم الإزعاج",
			turnedOnWithReason: "✅ | تم تفعيل وضع عدم الإزعاج لسبب: %1",
			alreadyOn: "⚠️ | المستخدم %1 مشغول حالياً",
			alreadyOnWithReason: "⚠️ | المستخدم %1 مشغول حالياً بسبب: %2"
		}
	},
	callad: {
		description: "إرسال تقرير أو رسالة للمطور ألين",
		guide: "   {pn} <الرسالة>",
		text: {
			missingMessage: "⚠️ | يرجى كتابة الرسالة التي تريد إرسالها",
			sendByGroup: "\n- أرسلت من مجموعة: %1\n- أيدي المجموعة: %2",
			sendByUser: "\n- أرسلت من مستخدم",
			content: "\n\nالمحتوى:\n─────────────────\n%1\n─────────────────\nقم بالرد على هذه الرسالة للتواصل مع المستخدم",
			success: "✅ | تم إرسال رسالتك إلى المطور 𝗔𝗟𝗘𝗡 بنجاح!",
			replySuccess: "✅ | تم إرسال ردك بنجاح!",
			feedback: "📝 | رسالة من %1:\n- الأيدي: %2%3\n\nالمحتوى:\n─────────────────\n%4\n─────────────────\nقم بالرد للتواصل",
			replyUserSuccess: "✅ | تم إرسال ردك للمستخدم بنجاح!",
			reply: "📍 | رد من المطور 𝗔𝗟𝗘𝗡 %1:\n─────────────────\n%2\n─────────────────\nقم بالرد على هذه الرسالة للتواصل مجدداً"
		}
	},
	cmd: {
		description: "إدارة ملفات الأوامر (خاص بالمطور)",
		guide: "{pn} load <اسم الأمر>\n{pn} loadAll\n{pn} install <رابط> <اسم الملف>",
		text: {
			missingFileName: "⚠️ | يرجى إدخال اسم الأمر",
			loaded: "✅ | تم تحميل الأمر \"%1\" بنجاح",
			loadedError: "❌ | فشل تحميل الأمر \"%1\"\n%2: %3",
			loadedSuccess: "✅ | نجاح التحميل",
			loadedFail: "❌ | فشل التحميل",
			missingCommandNameUnload: "⚠️ | يرجى إدخال اسم الأمر للإيقاف",
			unloaded: "✅ | تم إيقاف الأمر \"%1\"",
			unloadedError: "❌ | فشل إيقاف الأمر \"%1\"",
			missingUrlCodeOrFileName: "⚠️ | معلومات ناقصة للتحميل",
			missingUrlOrCode: "⚠️ | الرابط مفقود",
			missingFileNameInstall: "⚠️ | يرجى إدخال اسم الملف بصيغة .js",
			invalidUrlOrCode: "⚠️ | رابط غير صالح",
			alreadExist: "⚠️ | الملف موجود مسبقاً، للتبديل تفاعل مع الرسالة",
			installed: "✅ | تم تثبيت الأمر \"%1\" بنجاح",
			installedError: "❌ | فشل التثبيت",
			missingFile: "⚠️ | الملف \"%1\" غير موجود",
			invalidFileName: "⚠️ | اسم ملف غير صالح",
			unloadedFile: "✅ | تم إيقاف الملف \"%1\""
		}
	},
	count: {
		description: "حساب عدد رسائلك أو رسائل المجموعة",
		guide: "   {pn}: عرض رسائلك\n   {pn} @tag: عرض رسائل شخص آخر\n   {pn} all: عرض رسائل جميع الأعضاء",
		text: {
			count: "📊 | إحصائيات الرسائل للأعضاء:",
			endMessage: "الأعضاء غير المذكورين لم يرسلوا أي رسالة.",
			page: "صفحة [%1/%2]",
			reply: "قم بالرد برقم الصفحة لرؤية المزيد",
			result: "المركز %1: %2 بـ %3 رسالة",
			yourResult: "أنت في المركز %1، وقد أرسلت %2 رسالة في هذه المجموعة",
			invalidPage: "⚠️ | رقم صفحة غير صالح"
		}
	},
	customrankcard: {
		description: "تصميم بطاقة المستوى (الرانك) الخاصة بك",
		guide: {
			body: "   {pn} [الخيارات] <القيمة>\nالخيارات:\n maincolor | subcolor | linecolor | expbarcolor | textcolor | reset",
			attachment: {}
		},
		text: {
			invalidImage: "⚠️ | رابط صورة غير صالح",
			invalidAttachment: "⚠️ | يرجى إرفاق صورة صالحة",
			invalidColor: "⚠️ | كود لون غير صالح",
			notSupportImage: "⚠️ | الصور غير مدعومة في الخيار \"%1\"",
			success: "✅ | تم حفظ التعديلات، إليك نظرة عامة",
			reseted: "✅ | تم إعادة ضبط كل شيء للافتراضي",
			invalidAlpha: "⚠️ | يرجى اختيار رقم بين 0 و 1 للشفافية"
		}
	},
	dhbc: {
		description: "لعبة خمن الكلمة",
		guide: "{pn}",
		text: {
			reply: "🎮 | يرجى الرد على هذه الرسالة بالجواب الصحيح:\n%1",
			isSong: "🎵 | هذا اسم أغنية للمغني %1",
			notPlayer: "⚠️ | أنت لست اللاعب في هذه الجولة!",
			correct: "🎉 | مبروك إجابة صحيحة! لقد ربحت %1$",
			wrong: "❌ | إجابة خاطئة، حاول مجدداً"
		}
	},
	emojimix: {
		description: "دمج إيموجي مع بعضها",
		guide: "   {pn} <إيموجي1> <إيموجي2>\n   مثال:  {pn} 🤣 🥰"
	},
	eval: {
		description: "اختبار أكواد برمجية (خاص بالمطور)",
		guide: "{pn} <الكود>",
		text: {
			error: "❌ | حدث خطأ برمجي:"
		}
	},
	event: {
		description: "إدارة أوامر الأحداث (Events)",
		guide: "{pn} load <اسم الملف>",
		text: {
			missingFileName: "⚠️ | يرجى إدخال اسم الأمر",
			loaded: "✅ | تم تحميل الحدث \"%1\" بنجاح",
			loadedError: "❌ | فشل التحميل\n%2: %3",
			loadedSuccess: "✅ | نجاح التحميل",
			loadedFail: "❌ | فشل التحميل",
			missingCommandNameUnload: "⚠️ | يرجى الإدخال",
			unloaded: "✅ | تم الإيقاف",
			unloadedError: "❌ | فشل الإيقاف",
			missingUrlCodeOrFileName: "⚠️ | معلومات التثبيت ناقصة",
			missingUrlOrCode: "⚠️ | الرابط ناقص",
			missingFileNameInstall: "⚠️ | اسم الملف ناقص",
			invalidUrlOrCode: "⚠️ | رابط غير صالح",
			alreadExist: "⚠️ | موجود مسبقاً",
			installed: "✅ | تم التثبيت بنجاح",
			installedError: "❌ | فشل التثبيت",
			missingFile: "⚠️ | غير موجود",
			invalidFileName: "⚠️ | اسم غير صالح",
			unloadedFile: "✅ | تم الإيقاف"
		}
	},
	filteruser: {
		description: "تصفية أعضاء المجموعة (طرد الحسابات المعطلة أو الأصنام)",
		guide: "   {pn} [<عدد الرسائل> | die]",
		text: {
			needAdmin: "⚠️ | يرجى رفع البوت كأدمن ليعمل الأمر",
			confirm: "⚠️ | هل أنت متأكد من طرد الأعضاء الذين رسائلهم أقل من %1؟\nتفاعل لتأكيد الطرد",
			kickByBlock: "✅ | تم طرد %1 حساب معطل/مغلق",
			kickByMsg: "✅ | تم طرد %1 عضو خامل",
			kickError: "❌ | حدث خطأ ولم نتمكن من طرد %1 عضو:\n%2",
			noBlock: "✅ | لا يوجد أي حساب معطل في المجموعة",
			noMsg: "✅ | لا يوجد أعضاء رسائلهم أقل من %1"
		}
	},
	getfbstate: {
		description: "استخراج fbstate الحالي (خاص بالمطور)",
		guide: "{pn}",
		text: {
			success: "✅ | تم إرسال ملفات الارتباط (fbstate) في الخاص، تفقد رسائل البوت"
		}
	},
	grouptag: {
		description: "صنع منشن جماعي مخصص لفريق معين",
		guide: "   {pn} add <اسم الفريق> <@المنشن>",
		text: {
			noGroupTagName: "⚠️ | يرجى كتابة اسم الفريق",
			noMention: "⚠️ | لم تقم بعمل منشن للأعضاء",
			addedSuccess: "✅ | تمت إضافة الأعضاء:\n%1\nإلى الفريق \"%2\"",
			addedSuccess2: "✅ | تم إنشاء الفريق \"%1\" بالأعضاء:\n%2",
			existedInGroupTag: "⚠️ | موجودين مسبقاً",
			notExistedInGroupTag: "⚠️ | غير موجودين",
			noExistedGroupTag: "❌ | هذا الفريق غير موجود",
			noExistedGroupTag2: "⚠️ | لا توجد فرق مسجلة",
			noMentionDel: "⚠️ | قم بمنشن الأعضاء لحذفهم",
			deletedSuccess: "✅ | تم الحذف",
			deletedSuccess2: "✅ | تم حذف الفريق \"%1\"",
			tagged: "📣 | نداء للفريق \"%1\":\n%2",
			noGroupTagName2: "⚠️ | أدخل الاسم القديم والجديد",
			renamedSuccess: "✅ | تم تغيير الاسم إلى \"%2\"",
			infoGroupTag: "📑 | اسم الفريق: \"%1\"\n👥 | الأعضاء: %2\n👨‍👩‍👧‍👦 | القائمة:\n %3"
		}
	},
	help: {
		description: "قائمة أوامر نظام يوان المطور",
		guide: "{pn} [فارغ | <صفحة> | <أمر>]",
		text: {
			help: "╔════════════════════════════╗\n     𝗔𝗟𝗘𝗡 𝗕𝗢𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦\n╚════════════════════════════╝\n%1\n━━━━━━━━━━━━━━━━━━━━━━\n✨ صفحة [ %2/%3 ]\n📊 إجمالي الأوامر: %4\n💡 اكتب %5help <الصفحة> للتنقل\n💡 اكتب %5help <الأمر> لشرح الأمر\n━━━━━━━━━━━━━━━━━━━━━━\n👑 𝗢𝗪𝗡𝗘𝗥: 𝗔𝗟𝗘𝗡 𝗠𝗔𝗘𝗦𝗧𝗥𝗢\n%6",
			help2: "%1\n━━━━━━━━━━━━━━━━━━━━━━\n📊 الأوامر المتاحة هنا: %2\n💡 اكتب %3help <الأمر> لشرح تفاصيله\n%4",
			commandNotFound: "❌ | الأمر \"%1\" غير موجود في نظام يوان",
			getInfoCommand: "╔══════════════════════╗\n   𝗗𝗘𝗧𝗔𝗜𝗟𝗦 𝗢𝗙 [ %1 ]\n╚══════════════════════╝\n💠 الوصف: %2\n💠 اختصارات: %3\n💠 بالمجموعة: %4\n💠 الإصدار: %5\n💠 الصلاحية: %6\n💠 الانتظار: %7 ثواني\n💠 المطور: %8\n\n💠 الاستخدام:\n%9\n\n『 𝗬𝗨𝗔𝗡 𝗦𝗬𝗦𝗧𝗘𝗠 𝗩𝟵 』",
			doNotHave: "لا يوجد",
			roleText0: "0 (للجميع)",
			roleText1: "1 (المشرفين فقط)",
			roleText2: "2 (المطور ألين فقط)",
			roleText0setRole: "0 (تغيير للجميع)",
			roleText1setRole: "1 (تغيير للمشرفين)",
			pageNotFound: "❌ | الصفحة %1 غير موجودة!"
		}
	},
	kick: {
		description: "طرد عضو من المجموعة",
		guide: "{pn} @tag: طرد الأشخاص المشار إليهم"
	},
	loadconfig: {
		description: "إعادة تحميل إعدادات البوت (Refresh Config)"
	},
	moon: {
		description: "رؤية شكل القمر في ليلة معينة",
		guide: "  {pn} <يوم/شهر/سنة>",
		text: {
			invalidDateFormat: "⚠️ | يرجى إدخال التاريخ بصيغة يوم/شهر/سنة",
			error: "❌ | خطأ في جلب بيانات القمر",
			invalidDate: "⚠️ | تاريخ غير صالح",
			caption: "🌒 | شكل القمر في يوم %1"
		}
	},
	notification: {
		description: "إرسال إشعار من المطور لجميع المجموعات",
		guide: "{pn} <الرسالة>",
		text: {
			missingMessage: "⚠️ | يرجى كتابة الرسالة المراد إرسالها",
			notification: "📢 | إشعار من نظام يوان المطور للجميع (لا ترد على هذه الرسالة)",
			sendingNotification: "⏳ | جاري إرسال الإشعار لـ %1 مجموعة...",
			sentNotification: "✅ | تم الإرسال بنجاح لـ %1 مجموعة",
			errorSendingNotification: "❌ | حدث خطأ أثناء الإرسال:\n %2"
		}
	},
	prefix: {
		description: "تغيير بادئة البوت (Prefix)",
		guide: "   {pn} <البادئة الجديدة>",
		text: {
			reset: "✅ | تم إعادة البادئة للافتراضية: %1",
			onlyAdmin: "⚠️ | المطور فقط من يمكنه تغيير البادئة العامة",
			confirmGlobal: "⚠️ | تفاعل للتأكيد على تغيير بادئة النظام",
			confirmThisThread: "⚠️ | تفاعل للتأكيد على تغيير بادئة هذه المجموعة",
			successGlobal: "✅ | تم تغيير بادئة النظام إلى: %1",
			successThisThread: "✅ | تم تغيير بادئة المجموعة إلى: %1",
			myPrefix: "🌐 | بادئة النظام: %1\n🛸 | بادئة مجموعتك: %2"
		}
	},
	rank: {
		description: "عرض مستواك (الرانك) في المجموعة"
	},
	rankup: {
		description: "تفعيل/إيقاف إشعار رفع المستوى",
		guide: "{pn} [on | off]",
		text: {
			syntaxError: "⚠️ | استخدم on أو off",
			turnedOn: "✅ | تم تفعيل إشعارات المستوى",
			turnedOff: "✅ | تم إيقاف إشعارات المستوى",
			notiMessage: "🎉🎉 | مبروك! لقد وصلت للمستوى %1"
		}
	},
	refresh: {
		description: "تحديث معلومات المجموعة أو المستخدم",
		guide: "   {pn} [thread | user]",
		text: {
			refreshMyThreadSuccess: "✅ | تم تحديث بيانات مجموعتك بنجاح!",
			refreshThreadTargetSuccess: "✅ | تم تحديث المجموعة %1 بنجاح!"
		}
	},
	rules: {
		description: "إدارة قوانين المجموعة",
		guide: "   {pn} add <القانون>: إضافة قانون\n   {pn}: عرض القوانين\n   {pn} remove: مسح كل القوانين"
	},
	sendnoti: {
		description: "إنشاء جروب إشعارات خاص بك",
		guide: "   {pn} create <اسم>",
		text: {
			missingGroupName: "⚠️ | اكتب اسم مجموعة الإشعارات",
			groupNameExists: "⚠️ | هذا الاسم موجود مسبقاً",
			createdGroup: "✅ | تم الإنشاء:\n- الاسم: %1\n- الأيدي: %2",
			missingGroupNameToAdd: "⚠️ | اكتب الاسم للإضافة",
			groupNameNotExists: "❌ | غير موجود",
			notAdmin: "⚠️ | أنت لست أدمن هنا",
			added: "✅ | تمت الإضافة",
			missingGroupNameToDelete: "⚠️ | اكتب الاسم للحذف",
			notInGroup: "⚠️ | غير موجود",
			deleted: "✅ | تم الحذف",
			failed: "❌ | فشل الإرسال: \n%2",
			missingGroupNameToRemove: "⚠️ | اكتب الاسم",
			removed: "✅ | تم الحذف بنجاح",
			missingGroupNameToSend: "⚠️ | اكتب الاسم للإرسال",
			groupIsEmpty: "⚠️ | المجموعة فارغة",
			sending: "⏳ | جاري الإرسال لـ %1...",
			success: "✅ | تم الإرسال بنجاح",
			notAdminOfGroup: "⚠️ | لست أدمن",
			missingGroupNameToView: "⚠️ | اكتب الاسم للبحث",
			groupInfo: "- الاسم: %1\n - الأيدي: %2\n - تم الإنشاء: %3\n%4 ",
			groupInfoHasGroup: "- المجموعات المشتركة: \n%1",
			noGroup: "⚠️ | ليس لديك مجموعات إشعارات"
		}
	},
	setalias: {
		description: "وضع اختصار (اسم بديل) للأوامر",
		guide: "   {pn} add <اختصار> <أمر>"
	},
	setavt: {
		description: "تغيير صورة البوت",
		text: {
			cannotGetImage: "❌ | حدث خطأ أثناء جلب الصورة",
			invalidImageFormat: "❌ | صيغة صورة غير صالحة",
			changedAvatar: "✅ | تم تغيير صورة نظام يوان بنجاح"
		}
	},
	setlang: {
		description: "تغيير لغة البوت الافتراضية",
		guide: "   {pn} <رمز اللغة>\n   مثال: ar أو en",
		text: {
			setLangForAll: "✅ | لغة النظام العامة الآن هي: %1",
			setLangForCurrent: "✅ | اللغة هنا الآن هي: %1",
			noPermission: "⚠️ | المطور فقط من يملك الصلاحية"
		}
	},
	setleave: {
		description: "تعديل رسالة المغادرة/الطرد",
		guide: {
			body: "   {pn} text <النص>: لتعديل الرسالة",
			attachment: {}
		},
		text: {
			missingContent: "⚠️ | يرجى كتابة الرسالة",
			edited: "✅ | تم التعديل إلى:\n%1",
			reseted: "✅ | تمت إعادة ضبط الرسالة",
			noFile: "⚠️ | لا توجد ملفات لمسحها",
			resetedFile: "✅ | تم مسح الملف بنجاح",
			missingFile: "⚠️ | يرجى الرد على صورة/فيديو",
			addedFile: "✅ | تمت إضافة %1 ملف لرسالة الوداع"
		}
	},
	setname: {
		description: "تغيير لقب جميع الأعضاء بطريقة معينة",
		guide: {
			body: "   {pn} all <اللقب>",
			attachment: {}
		},
		text: {
			error: "❌ | حدث خطأ، يرجى إغلاق روابط الدعوة والمحاولة مجدداً"
		}
	},
	setrole: {
		description: "تعديل صلاحيات الأوامر (تحديد من يمكنه استخدام الأمر)",
		guide: "   {pn} <الأمر> <الصلاحية 0/1>",
		text: {
			noEditedCommand: "✅ | مجموعتك ليس فيها أوامر معدلة",
			editedCommand: "⚠️ | أوامر معدلة:\n",
			noPermission: "❗ | للمشرفين فقط",
			commandNotFound: "❌ | الأمر \"%1\" غير موجود",
			noChangeRole: "❗ | لا يمكن تغيير صلاحية \"%1\"",
			resetRole: "✅ | تمت إعادته للافتراضي",
			changedRole: "✅ | تم تغيير صلاحية \"%1\" إلى %2"
		}
	},
	setwelcome: {
		description: "تعديل رسالة الترحيب الاحترافية",
		guide: {
			body: "   {pn} text <النص>: تعديل النص",
			attachment: {}
		},
		text: {
			missingContent: "⚠️ | يرجى كتابة الرسالة",
			edited: "✅ | تم التعديل إلى: %1",
			reseted: "✅ | تمت إعادة الضبط",
			noFile: "⚠️ | لا توجد ملفات لمسحها",
			resetedFile: "✅ | تم المسح",
			missingFile: "⚠️ | يرجى الرد على ملف",
			addedFile: "✅ | تمت إضافة %1 ملف لرسالة الترحيب"
		}
	},
	shortcut: {
		description: "ردود تلقائية / اختصارات للمجموعة",
		text: {
			missingContent: '⚠️ | يرجى كتابة الرسالة',
			shortcutExists: '⚠️ | الاختصار "%1" موجود، تفاعل لتغييره',
			shortcutExistsByOther: '⚠️ | الاختصار %1 مسجل لشخص آخر',
			added: '✅ | تمت الإضافة: %1 => %2',
			addedAttachment: ' مع %1 ملفات',
			missingKey: '⚠️ | اكتب الاختصار للحذف',
			notFound: '❌ | غير موجود',
			onlyAdmin: '⚠️ | المشرفون فقط يمكنهم حذف اختصارات غيرهم',
			deleted: '✅ | تم حذف %1',
			empty: '⚠️ | لا توجد اختصارات',
			message: 'الرسالة',
			attachment: 'مرفق',
			list: '📑 | قائمة اختصاراتك',
			onlyAdminRemoveAll: '⚠️ | المشرفون فقط',
			confirmRemoveAll: '⚠️ | متأكد من مسح الكل؟ تفاعل للتأكيد',
			removedAll: '✅ | تم مسح الكل'
		}
	},
	simsimi: {
		description: "محادثة مع الذكاء الاصطناعي (سمسمي)",
		guide: "   {pn} [on | off]: تفعيل/إيقاف",
		text: {
			turnedOn: "✅ | تم تفعيل سمسمي",
			turnedOff: "✅ | تم إيقاف سمسمي",
			chatting: "💬 | جاري المحادثة...",
			error: "❌ | سمسمي مشغول حالياً"
		}
	},
	sorthelp: {
		description: "ترتيب قائمة المساعدة",
		guide: "{pn} [name | category]",
		text: {
			savedName: "✅ | تم الترتيب حسب الاسم",
			savedCategory: "✅ | تم الترتيب حسب الفئة"
		}
	},
	unsend: {
		description: "مسح رسالة البوت",
		guide: "قم بالرد على رسالة البوت واكتب {pn}",
		text: {
			syntaxError: "⚠️ | يرجى الرد على الرسالة المراد مسحها"
		}
	},
	user: {
		description: "إدارة المستخدمين بالبوت",
		guide: "   {pn} ban <السبب>: حظر مستخدم",
		text: {
			noUserFound: "❌ | لم يتم العثور على: \"%1\"",
			userFound: "🔎 | وجدنا %1 تطابق \"%2\":\n%3",
			uidRequired: "⚠️ | الأيدي مطلوب",
			reasonRequired: "⚠️ | السبب مطلوب للحظر",
			userHasBanned: "⚠️ | محظور مسبقاً:\n» السبب: %3\n» التاريخ: %4",
			userBanned: "✅ | تم حظر [%1 | %2]:\n» السبب: %3\n» التاريخ: %4",
			uidRequiredUnban: "⚠️ | الأيدي مطلوب لفك الحظر",
			userNotBanned: "⚠️ | غير محظور أساساً",
			userUnbanned: "✅ | تم فك حظر [%1 | %2]"
		}
	},
	videofb: {
		description: "تحميل فيديو أو ستوري من فيسبوك",
		guide: "   {pn} <الرابط>",
		text: {
			missingUrl: "⚠️ | يرجى وضع رابط الفيديو/الستوري",
			error: "❌ | حدث خطأ أثناء التحميل",
			downloading: "⏳ | جاري التحميل...",
			tooLarge: "❌ | حجم الفيديو يتعدى الحد المسموح (83MB)"
		}
	},
	warn: {
		description: "تحذير عضو بالمجموعة (3 تحذيرات = طرد)",
		guide: "   {pn} @tag <السبب>",
		text: {
			list: "📑 | الأعضاء المحذرين:\n%1",
			listBan: "🚫 | الأعضاء المطرودين بسبب التحذيرات:\n%1",
			listEmpty: "✅ | لا يوجد أعضاء محذرين",
			listBanEmpty: "✅ | لا يوجد مطرودين",
			invalidUid: "⚠️ | أيدي غير صالح",
			noData: "⚠️ | لا توجد بيانات",
			noPermission: "❌ | المشرفون فقط من يمكنهم فك الحظر",
			invalidUid2: "⚠️ | أيدي غير صالح",
			notBanned: "⚠️ | غير محظور",
			unbanSuccess: "✅ | تم فك الحظر عن [%1 | %2]",
			noPermission2: "❌ | المشرفون فقط من يمكنهم إزالة التحذير",
			invalidUid3: "⚠️ | أيدي غير صالح",
			noData2: "⚠️ | لا يملك تحذيرات",
			notEnoughWarn: "❌ | يملك %2 تحذيرات فقط",
			unwarnSuccess: "✅ | تم مسح التحذير لـ [%2 | %3]",
			noPermission3: "❌ | للمشرفين فقط",
			resetWarnSuccess: "✅ | تم تصفير جميع التحذيرات",
			noPermission4: "❌ | للمشرفين فقط",
			invalidUid4: "⚠️ | قم بعمل منشن للمخالف",
			warnSuccess: "⚠️ | تم تحذير %1 (%2 مرات)\n- الأيدي: %3\n- السبب: %4\n- الوقت: %5\nلقد تم طرد هذا العضو.",
			noPermission5: "⚠️ | ارفع البوت كأدمن ليتمكن من طرد المخالفين!",
			warnSuccess2: "⚠️ | تم تحذير %1 (%2 مرات)\n- الأيدي: %3\n- السبب: %4\n- الوقت: %5\nباقي له %6 مخالفات ويتم طرده.",
			hasBanned: "⚠️ | أعضاء محظورين مسبقاً:\n%1",
			failedKick: "❌ | خطأ في طرد:\n%1"
		}
	},
	weather: {
		description: "حالة الطقس لـ 5 أيام قادمة",
		guide: "{pn} <المدينة>",
		text: {
			syntaxError: "⚠️ | يرجى كتابة اسم المدينة",
			notFound: "❌ | لم يتم العثور على: %1",
			error: "❌ | حدث خطأ: %1",
			today: "🌤️ | طقس اليوم في %1:\n🌡 الحرارة %2°C - %3°C\n🌅 الشروق: %6\n🌄 الغروب: %7"
		}
	},
	ytb: {
		description: "تحميل من يوتيوب",
		guide: "   {pn} [video|-v] <اسم/رابط>\n   {pn} [audio|-a] <اسم/رابط>",
		text: {
			error: "❌ | خطأ: %1",
			noResult: "❌ | لا يوجد نتائج لـ %1",
			choose: "🎧 | %1\nرد بالرقم للاختيار",
			downloading: "⏳ | جاري تحميل فيديو %1...",
			noVideo: "❌ | حجم الفيديو كبير جداً (أكبر من 83MB)",
			downloadingAudio: "⏳ | جاري تحميل صوت %1...",
			noAudio: "❌ | حجم الصوت كبير جداً (أكبر من 26MB)",
			info: "💠 العنوان: %1\n🏪 القناة: %2\n⏱ المدة: %4\n🔗 الرابط: %9",
			listChapter: "\n📖 الفصول: %1\n"
		}
	}
};
