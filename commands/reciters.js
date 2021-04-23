const { MessageEmbed } = require('discord.js')

module.exports = class extends require('../structures/Command') {
	constructor(client) {
		super(client, {
			__filename,
			aliases: ['قراء'],
			cooldown: 5,
			help: 'Sends the lists of reciters for `q!play`.',
			botPermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS']
		})
	}
	async run(message, args) {

		if (!args[0] || !['surah', 'ayah', 'page'].includes(args[0].toLowerCase())) {
			return new MessageEmbed()
				.setTitle('Reciters')
				.setDescription('Please specify a reciter list: *surah*, *ayah* or *page*.\n\n**Example**: `q!reciters surah`')
				.setColor(0x006400)
		}

		const reciter_list = await eval(`utils.get_${args[0].toLowerCase()}_reciters();`)

		const max = Math.floor(Math.ceil(reciter_list.length / 10))
		const pages = []


		for (let i = 0; i < max; i++) pages.push({
			name: i,
			reciters: reciter_list.slice(i, i + 10)
		})


		let page = pages[0], i = 0


		const m = await message.channel.send(new MessageEmbed()
			.setTitle('Reciters')
			.setColor(message.client.config.brand_color)
			.setDescription(this.list_reciters(page))
			.setFooter(`Page 1/${pages.length}`))

		for (const emoji of ['⬅', '➡']) await m.react(emoji).catch(() => null)

		const filter = (reaction, user) => user.id === message.author.id && ['⬅', '➡'].includes(reaction.emoji.name)

		const collector = m.createReactionCollector(filter, {
			time: 60000 * 3
		})

		collector
			.on('end', () => m.reactions.removeAll().catch(() => null))
			.on('collect', ({
				emoji,
				users
			}) => {
				users.remove(message.author).catch(() => null)
				switch (emoji.name) {
					case '⬅':
						if (i === 0) return
						i--
						break
					case '➡':
						if (i === (max - 1)) return
						i++
						break
				}
				page = pages[i]
				if (!m.deleted) m.edit(new MessageEmbed()
					.setTitle('Reciters')
					.setColor(message.client.config.brand_color)
					.setDescription(this.list_reciters(page))
					.setFooter(`Page ${i + 1}/${max}`)).catch(() => null)
			})
	}
	list_reciters(page) {
		let list = ''
		for (const reciter of page.reciters) list += `• ${reciter.name}\n`
		return list
	}
}