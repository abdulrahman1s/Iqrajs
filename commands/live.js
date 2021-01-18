module.exports = class extends require("../structures/Command") {
	constructor(client) {
		super(client, {
			__filename,
			help: "Plays live audio either from Makkah or online Qur'an radio.",
			cooldown: 5,
			inVoiceChannel: true
		});
	}
	async run(message, args) {
		try {
			const connection = await message.member.voice.channel.join();
			connection.play(message.client.radio);
			return "Now playing **mp3quran.net radio**: *short recitations* (الإذاعة العامة - اذاعة متنوعة لمختلف القراء).";
		} catch (error) {
			throw error;
		}
	}
};