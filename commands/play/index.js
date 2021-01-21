const ayahCommand = require("./commands/ayah");
const pageCommand = require("./commands/page");
const surahCommand = require("./commands/surah");

module.exports = class extends require("../../structures/Command") {
	constructor(client) {
		super(client, {
			__filename,
			aliases: ["p", "شغل"],
			help: {
				content: "Plays a surah, ayah or page from the mushaf in a voice channel.",
				usage: "<ayah|page|surah>",
				fields: [{
					name: "Playing a surah",
					value: "`q!play surah <surah number> <reciter>`\n\nExample: `q!play surah 1 Mishary Alafasi`\n\n__**OR**__ `q!play surah <surah name> <reciter>`\n\nExample: `q!play surah al-fatiha Mishary Alafasi`"
				}, {
					name: "Playing an ayah",
					value: "`q!play ayah <surah>:<ayah> <reciter>`\n\nExample: `q!play ayah 1:6 hani al-rifai`"
				}, {
					name: "Playing a page from the mushaf",
					value: "`q!play page <page number> <reciter>`\n\nExample: `q!play page 342 hani al-rifai`"
				}, {
					name: "Reciters",
					value: "Type `q!reciters` for a list of reciters."
				}]
			},
			cooldown: 5,
			inVoiceChannel: true,
			joinable: true,
			speakable: true
		});
		this.name = "play";
	}
	async run(message, args) {
		if (!args[0]) throw `You typed the command wrongly. Type \`${message.prefix}help play\` for help.`;

		const newArgs = args.slice(1);

		switch (args[0].toLowerCase()) {
			case "ayah":
			case "اية":
				return await ayahCommand(message, newArgs);
			case "page":
			case "صفحة":
				return await pageCommand(message, newArgs);
			case "surah":
			case "سورة":
				return await surahCommand(message, newArgs);
			default:
				throw `**Invalid arguments**. For help, type \`${message.prefix}help play\`.`;
		}
	}
};