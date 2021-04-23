const { Client, Collection } = require('discord.js')
const BaseCommand = require('./Command')
const config = require('../config')
const { join } = require('path')
const { readdirSync } = require('fs')


class Bot extends Client {
	constructor(options) {
		super(options)
		this.prefix = config.prefix
		this.config = config
		this.commands = new Collection()
		this.aliases = new Collection()
		this.cooldown = new Collection()
	}
	start() {
		const commandFiles = readdirSync(join(__dirname, '../commands'))
		
		for (const file of commandFiles) {
			const Command = require(join(__dirname, '../commands', file))
			if (Command.prototype instanceof BaseCommand) {
				const command = new Command(this)
				this.commands.set(command.name, command)
				command.aliases.forEach((alias) => this.aliases.set(alias, command.name))
			}
		}

		this.on('ready', () => {
			console.log('Connected to Discord API')
			console.log(`${this.user.tag} (ID: ${this.user.id})`)

			this.user.setActivity(`Quran | ${config.prefix}help`, {
				type: 'LISTENING'
			})
		})

		return super.login(config.token)
	}
}

module.exports = Bot