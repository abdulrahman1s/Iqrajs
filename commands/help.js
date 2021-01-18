const ICON = "https://cdn.discordapp.com/app-icons/706134327200841870/e6bb860daa7702ea70e6d6e29c3d36f6.png";
const {
	MessageEmbed
} = require("discord.js");


module.exports = class extends require("../structures/Command") {
	constructor(client) {
		super(client, {
			__filename,
			help: {
				content: "Lists all commands and how to use them.",
				usage: "[command]"
			},
			cooldown: 5,
			inVoiceChannel: true
		});
	}
	async run(message, args) {
		if (!args[0]) return this.generateHelpMenu(message);

		const commandName = args[0].toLowerCase();
		const command = this.client.commands.get(commandName) || this.client.commands.get(client.aliases.get(commandName));

		if (!command) return this.generateHelpMenu(message);

		const {
			name,
			aliases
		} = command;

		const {
			fields,
			content: description,
			usage
		} = command.help;


		const embed = new MessageEmbed()
			.setThumbnail(ICON)
			.setTitle(name)
			.setColor(message.client.config.brand_color);

		embed.addField("Description: ", description);
		embed.addField("Usage: ", `\`${message.prefix}${name} ${usage}\``);

		if (aliases.length > 0) embed.addField("Aliases: ", aliases.map((aliase) => `\`${message.prefix + aliase}\``).join(", "));

		for (const field of fields) embed.addField(field.name, field.value, true);

		return embed;
	}
	generateHelpMenu(message) {
		const commands = message.client.commands.map((cmd) => `• \`${message.prefix}${cmd.name}\` - ${cmd.help.content}`).join("\n");

		const embed = new MessageEmbed()
			.setColor(message.client.config.brand_color)
			.setThumbnail(ICON)
			.setDescription(`**Use \`${message.prefix}help <command>\` for more information about a command.**\nExample: \`${message.prefix}help play\`\n\n`)
			.addField("Overview", commands)
			.setFooter("Note: (volume, pause, resume) not working with live streams.");
		return embed;
	}
};