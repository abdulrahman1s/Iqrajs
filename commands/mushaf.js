const {
	MessageEmbed
} = require("discord.js");

const ONE_HOUR = 60000 * 60 * 1;
const PAGE_LIMIT = 604;
const EMOJIS = ["⬅", "⏹️", "➡️", "❌"];

module.exports = class extends require("../structures/Command") {
	constructor(client) {
		super(client, {
			__filename,
			help: "Browse Quran pages.",
			cooldown: 5,
			aliases: ["مصحف", "قران", "quran"],
			botPermissions: ["EMBED_LINKS", "ADD_REACTIONS", "READ_MESSAGE_HISTORY"]
		});
	}
	async run(message, args) {
		let page = 1;

		if (!isNaN(args[0])) {
			const number = Number(args[0]);
			if (!(number > PAGE_LIMIT || number <= 0)) page = number;
		}

		const embed = new MessageEmbed()
			.setTitle("Mushaf / مصحف")
			.setAuthor(`Page: ${page}/${PAGE_LIMIT}`)
			.setColor(message.client.config.brand_color)
			.setImage(this.get_page_link(page))
			.setFooter("type page number to quick move.");

		const m = await message.channel.send(embed);

		for (const emoji of EMOJIS) await m.react(emoji);

		const message_collector = message.channel.createMessageCollector((m) => m.author.id == message.author.id && /^\d{1,3}$/.test(m.content), {
				time: ONE_HOUR / 2
			}),
			reaction_collector = m.createReactionCollector((reaction, user) => user.id == message.author.id && EMOJIS.includes(reaction.emoji.name), {
				time: ONE_HOUR / 2
			});

		reaction_collector
			.on("end", () => m.reactions.removeAll().catch(() => null))
			.on("collect", ({
				emoji,
				users
			}) => {
				users.remove(message.author).catch(() => null);
				switch (emoji.name) {
					case "⬅":
						if (page === 0) return;
						page--;
						break;
					case "⏹️":
					case "❌":
						if (emoji.name == "❌") m.delete().catch(() => null);
						reaction_collector.stop();
						message_collector.stop();
						return;
					case "➡️":
						if (page === PAGE_LIMIT) return;
						page++;
						break;
				}
				m.edit(embed
					.setAuthor(`Page: ${page}/${PAGE_LIMIT}`)
					.setImage(this.get_page_link(page))
					.setFooter("type page number to quick move.")).catch(() => reaction_collector.stop());
			});

		message_collector.on("collect", msg => {
			msg.delete().catch(() => null);
			
			const number = parseInt(msg.content);

			if (number > PAGE_LIMIT || number <= 0) return;
			
			page = number;
			
			m.edit(embed
				.setAuthor(`Page: ${page}/${PAGE_LIMIT}`)
				.setImage(this.get_page_link(page))
				.setFooter("type page number to quick move.")).catch(() => message_collector.stop());
		});
	}
	get_page_link(page) {
		return `https://surahquran.com/img/pages-quran/page${String(page).padStart(3, 0)}.png`;
	}
};