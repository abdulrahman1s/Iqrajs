const { MessageEmbed } = require('discord.js')
const ICON_URL = 'https://cdn.discordapp.com/app-icons/706134327200841870/e6bb860daa7702ea70e6d6e29c3d36f6.png'


module.exports = class extends require('../structures/Command') {
	constructor(client) {
		super(client, {
			__filename,
			help: {
				content: 'Lists all commands and how to use them.',
				usage: '[command]'
			},
			aliases: ['مساعدة', 'اوامر'],
			cooldown: 2
		})
	}
	run(message, args) {
		if (!args[0]) return this.generateHelpMenu(message)

		const commandName = args[0].toLowerCase()
		const command = this.client.commands.get(commandName) || this.client.commands.get(this.client.aliases.get(commandName))

		if (!command) return this.generateHelpMenu(message)

		const {
			name,
			aliases
		} = command

		const {
			fields,
			content: description,
			usage
		} = command.help


		const embed = new MessageEmbed()
			.setThumbnail(ICON_URL)
			.setTitle(name)
			.setColor(message.client.config.brand_color)

		embed.addField('Description: ', description)
		embed.addField('Usage: ', `\`${message.prefix}${name} ${usage}\``)

		if (aliases.length > 0) embed.addField('Aliases: ', aliases.map((alias) => `\`${message.prefix + alias}\``).join(', '))

		for (const field of fields) embed.addField(field.name, field.value, true)

		return embed
	}
	generateHelpMenu(message) {
		const commands = message.client.commands.map((cmd) => `• \`${message.prefix}${cmd.name}\` - ${cmd.help.content}`).join('\n')

		const embed = new MessageEmbed()
			.setColor(message.client.config.brand_color)
			.setThumbnail(ICON_URL)
			.setDescription(`**Use \`${message.prefix}help <command>\` for more information about a command.**\nExample: \`${message.prefix}help play\`\n\n`)
			.addField('Overview', commands)

		return embed
	}
}