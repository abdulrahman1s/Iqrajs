const { MessageEmbed } = require('discord.js')
const {
	get_surah_info,
	get_verse_count,
	get_ayah_reciters
} = require('../utils')

module.exports = async (message, args) => {
	let reciter = (args[1] ? args.slice(1).join(' ') : 'Mishary Alafasi').toLowerCase()

	const [surah, ayah] = (args[0] || '').split(':').map((value) => Number(value))

	if (!args[0] || [surah, ayah].some((value) => isNaN(value))) throw `Invalid arguments. Commands: \`${message.prefix}play ayah <surah>:<ayah> <reciter>\`.\n\nExample: \`${message.prefix}play ayah 2:255 abdul rahman al-sudais\``

	reciter = (await get_ayah_reciters()).find((obj) => obj.name.toLowerCase() === reciter)

	if (!reciter)
		throw `**Couldn't find reciter!** Type \`${message.prefix}reciters\` for a list of available reciters.`
	if (surah < 0 || surah > 114)
		throw `**Surah not found.** Use the surah's name or number. Examples: \n\n\`${message.prefix}play surah al-fatihah\`\n\n\`${message.prefix}play surah 1\``

	const verse_count = await get_verse_count(surah)
	if (ayah > verse_count) throw `**There are only ${verse_count} verses in this surah.**`

	const url = `${reciter.ayah_url}/${String(surah).padStart(3, 0)}${String(ayah).padStart(3, 0)}.mp3`

	const {
		name,
		arabic_name
	} = await get_surah_info(surah)

	const connection = await message.member.voice.channel.join()
	await connection.voice.setSelfDeaf(true)
	connection.play(url).on('finish', () => message.guild.me.voice.channel.leave())

	const embed = new MessageEmbed()
		.setTitle('Qurʼān')
		.setColor(message.client.config.brand_color)
		.setImage(`https://everyayah.com/data/QuranText_jpg/${surah}_${ayah}.jpg`)
		.setDescription(`**Playing**: Surah ${name} (${arabic_name}), Ayah ${ayah}.\n**Reciter**: ${reciter.name} *(${reciter.mushaf_type})*\n**Riwayah**: *${reciter.riwayah}*`)
	return embed
}