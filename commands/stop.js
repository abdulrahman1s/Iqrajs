module.exports = class extends require("../structures/Command") {
	constructor(client) {
		super(client, {
			__filename,
			aliases: ["leave", "توقف"],
			help: "Disconnects the bot from voice chat.",
			cooldown: 3,
			inVoiceChannel: true,
			sameVoiceChannel: true
		});
	}
	async run(message, args) {
		message.guild.me.voice.channel.leave();
		return ":white_check_mark: **Successfully disconnected.**";
	}
};