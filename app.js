require("http")
	.createServer((req, res) => {
		res.write("Pong?");
		res.end();
	}).listen(process.env.PORT, "0.0.0.0");

const {
	MessageEmbed,
	Collection
} = require("discord.js");
const Client = require("./structures/Client");
const client = new Client({
	messageCacheMaxSize: 50,
	disableMentions: "everyone",
	ws: {
		intents: ["GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILDS", "GUILD_MESSAGE_REACTIONS"]
	}
});

client.start();


const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const prefix = client.prefix;
const cooldowns = client.cooldowns;

client.on("message", async message => {
	if (message.author.bot || !message.guild) return;

	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
	
	if (!prefixRegex.test(message.content)) return;

	const [, matchedPrefix] = message.content.match(prefixRegex);

	if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;

	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));

	if (!command) return;

	message.prefix = prefix;

	const send = (...content) => new Promise((reslove) => message.channel.send(...content).then(reslove).catch(() => reslove(null)));

	if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + command.cooldown;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Please wait \`${timeLeft.toFixed(1)}\` more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), command.cooldown);


	if (!message.channel.permissionsFor(client.user).has(command.botPermissions)) {

		const missing = "```diff\n" +
			message.channel.permissionsFor(client.user)
			.missing(command.botPermissions)
			.map(p => `- ${p.replace(/_/g, " ").toLowerCase().split(" ").map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(" ")}`).join("\n") + "```";

		return send("I need the following permissions to run this command:\n" + missing);
	}

	if (command.inVoiceChannel) {
		const voice = message.member.voice.channel;
		const state = message.guild.me.voice;

		if (!voice)
			return send("You need to be in a voice channel for this command!");

		if (command.playing && (!state.connection || !state.connection.dispatcher))
			return send("Nothing is playing right now!");

		if (command.sameVoiceChannel && voice.id !== message.guild.me.voice.channelID)
			return send("You're not in the same voice channel as me!");

		if (command.joinable && !voice.joinable)
			return send("I do not have permission to join your voice channel.");

		if (command.speakable && !voice.speakable)
			return send("I do not have permission to speak in your voice channel.");
	}

	try {
		const output = await command.run(message, args);
		if (typeof output == "string" || output instanceof MessageEmbed) {
			send(output);
		}
	} catch (error) {
		if (typeof error == "string") {
			send(`:x: | ${error}`);
		} else {
			console.error(error);
			message.reply("There was an error trying to execute that command!");
		}
	}
});