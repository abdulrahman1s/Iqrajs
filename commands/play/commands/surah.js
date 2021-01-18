const {
	MessageEmbed
} = require("discord.js");
const {
	get_surah_id_from_name,
	get_surah_info,
	get_surah_reciters
} = require("../utils");


module.exports = async (message, args) => {
	let reciter = (args[1] ? args.slice(1).join(" ") : "Mishary Alafasi").toLowerCase();

	let surah = parseInt(args[0]);

	if (isNaN(surah)) {
		surah = await get_surah_id_from_name((args[0] || "").toLowerCase());
	}

	if (!surah || isNaN(surah)) throw `**Surah not found.** Use the surah's name or number. Examples: \n\n\`${message.prefix}play surah al-fatihah\`\n\n\`${message.prefix}play surah 1\``;


	const reciter_list = await get_surah_reciters();

	reciter = reciter_list.find((obj) => obj.name.toLowerCase() == reciter);

	if (!reciter) throw `**Couldn't find reciter!** Type \`${message.prefix}reciters\` for a list of available reciters.`;

	if (surah < 0 || surah > 114) throw `**Surah not found.** Use the surah's name or number. Examples: \n\n\`${message.prefix}play surah al-fatihah\`\n\n\`${message.prefix}play surah 1\``;


	const url = `${reciter.server}/${String(surah).padStart(3,0)}.mp3`;

	const {
		name,
		arabic_name
	} = await get_surah_info(surah);

	try {
		const connection = await message.member.voice.channel.join();
		await connection.voice.setSelfDeaf(true);
		connection.play(url).on("finish", () => message.guild.me.voice.channel.leave());

		const embed = new MessageEmbed()
			.setTitle("Qurʼān")
			.setColor(message.client.config.brand_color)
			.setDescription(`**Playing**: Surah ${name} (${arabic_name})\n**Reciter**: ${reciter.name}\n**Riwayah**: *${reciter.riwayah}*`);
		return embed;
	} catch (error) {
		throw error;
	}
};