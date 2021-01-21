const {
	sep
} = require("path");

class Command {
	constructor(client, {
		__filename: filename,
		help = {},
		aliases = [],
		inVoiceChannel = false,
		sameVoiceChannel = false,
		playing = false,
		speakable = false,
		joinable = false,
		botPermissions = ["EMBED_LINKS"],
		cooldown = 3
	}) {
		this.client = client;

		const file = filename.split(sep);

		this.name = file.pop().split(".")[0];
		this.aliases = aliases;
		this.botPermissions = botPermissions;
		this.cooldown = cooldown * 1000;

		this.help = Object.assign({
			content: "No description available.",
			usage: "",
			examples: [],
			fields: []
		}, typeof help == "string" ? {
			content: help
		} : help);


		this.inVoiceChannel = inVoiceChannel;
		this.sameVoiceChannel = sameVoiceChannel;
		this.playing = playing;
	}
}

module.exports = Command;