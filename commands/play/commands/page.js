const everyayah_reciters = require("../../../JSON/reciters.json");
const {
	MessageEmbed
} = require("discord.js");


module.exports = async (message, args) => {

	const page = parseInt(args[0]);
	const reciter = (args[1] ? args.slice(1).join(" ") : "mishary al-afasy").toLowerCase();


	if (!page || isNaN(page)) throw `Invalid arguments. Commands: \`${message.prefix}play page <page>:<ayah> <reciter>\`.\n\nExample: \`${message.prefix}play ayah 604 abdul rahman al-sudais\`.`;

	if (!(reciter in everyayah_reciters)) throw `**Couldn't find reciter!** Type \`${message.prefix}reciters\` for a list of available reciters.`;

	if (page < 0 || page > 604) throw "**Sorry, the page must be between 1 and 604.**";


	const url_page = String(page).padStart(3, 0);
	const url = `https://everyayah.com/data/${everyayah_reciters[reciter]}/PageMp3s/Page${url_page}.mp3`;

	const readable_reciter = reciter.split(" ").map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(" ");

	try {
		const connection = await message.member.voice.channel.join();
		connection.play(url).on("finish", () => message.guild.me.voice.channel.leave());

		const embed = new MessageEmbed()
			.setTitle("Qurʼān")
			.setColor(message.client.config.brand_color)
			.setImage(`https://www.searchtruth.org/quran/images2/large/page-${url_page}.jpeg`)
			.setDescription(`**Playing**: Page ${page}.\n**Reciter**: ${readable_reciter}.`);
		return embed;
	} catch (error) {
		throw error;
	}
};