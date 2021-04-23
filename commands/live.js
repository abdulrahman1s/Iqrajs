module.exports = class extends require('../structures/Command') {
	constructor(client) {
		super(client, {
			__filename,
			aliases: ['stream', 'radio', 'راديو'],
			help: 'Plays live audio either from Makkah or online Qur\'an radio.',
			cooldown: 5,
			inVoiceChannel: true
		})
	}
	async run(message) {
		const connection = await message.member.voice.channel.join()
		await connection.voice.setSelfDeaf(true)
		await connection.play('https://qurango.net/radio/tarateel')
		return 'Now playing **mp3quran.net radio**: *short recitations* (الإذاعة العامة - اذاعة متنوعة لمختلف القراء).'
	}
}