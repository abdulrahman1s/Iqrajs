module.exports = class extends require('../structures/Command') {
	constructor(client) {
		super(client, {
			__filename,
			help: 'Pauses the bot.',
			aliases: ['ايقاف'],
			cooldown: 3,
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true
		})
	}
	run(message) {
		const {
			dispatcher
		} = message.guild.me.voice.connection

		const isPaused = dispatcher.paused

		isPaused ? dispatcher.resume() : dispatcher.pause(true)

		return isPaused ? ':arrow_forward: **Resumed**.' : ':pause_button: **Paused**.'
	}
}