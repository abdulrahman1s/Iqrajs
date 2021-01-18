module.exports = class extends require("../structures/Command") {
	constructor(client) {
		super(client, {
			__filename,
			help: "Resumes the bot.",
			cooldown: 2,
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true
		});
	}
	async run(message, args) {
		const {
			dispatcher
		} = message.guild.me.voice.connection;

		const isPaused = dispatcher.paused;

		isPaused ? dispatcher.resume() : dispatcher.pause(true);
		
		return isPaused ? ":arrow_forward: **Resumed**." : ":pause_button: **Paused**.";
	}
};