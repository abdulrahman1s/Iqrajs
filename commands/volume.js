module.exports = class extends require("../structures/Command") {
	constructor(client) {
		super(client, {
			__filename,
			help: "Changes the volume of the bot.",
			cooldown: 5,
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true
		});
	}
	async run(message, args) {
		const volume = parseInt(args[0]);

		if (isNaN(volume) || volume < 0 || volume > 120) throw "**The volume must be between 0 and 120.**";

		message.guild.me.voice.connection.dispatcher.setVolumeLogarithmic(volume / 120);

		return `Changed volume to **${volume}%**.`;
	}
};