const {
	MessageEmbed
} = require('discord.js')
const fetch = require('node-fetch')

module.exports = class extends require('../structures/Command') {
	constructor(client) {
		super(client, {
			__filename,
			aliases: ['prayers', 'الصلاوات'],
			help: 'Gets prayer times for a specified location.',
			cooldown: 5
		})
	}
	async run(message, args) {
		const location = args.join(' ')

		if (!location)
			return `**Please provide a location**. \n\nExample: \`${message.prefix}prayertimes Dubai, UAE\``

		const embed = new MessageEmbed()
			.setAuthor('Prayer Times for ' + location)
			.setColor(message.client.config.brand_color)

		try {
			const {
				fajr,
				sunrise,
				dhuhr,
				asr,
				maghrib,
				isha,
				imsak,
				midnight
			} = await this.get_prayertimes(location)

			embed
				.addField('**Imsak (إِمْسَاك)**', imsak, true)
				.addField('**Fajr (صلاة الفجر)**', fajr, true)
				.addField('**Sunrise (طلوع الشمس)**', sunrise, true)
				.addField('**Ẓuhr (صلاة الظهر)**', dhuhr, true)
				.addField('**Asr (صلاة العصر)**', asr, true)
				.addField('**Maghrib (صلاة المغرب)**', maghrib, true)
				.addField('**Isha (صلاة العشاء)**', isha, true)
				.addField('**Midnight (منتصف الليل)**', midnight, true)
			return embed
		} catch {
			throw '**Location not found**.'
		}
	}
	async get_prayertimes(location, method = 5) {
		const res = await fetch(`http://api.aladhan.com/timingsByAddress?address=${location}&method=${method}&school=0`, {
			headers: {
				'content-type': 'application/json'
			}
		})
		if (res.status == 200) {
			const data = await res.json()
			const times = data.data.timings
			return {
				fajr: times.Fajr,
				sunrise: times.Sunrise,
				dhuhr: times.Dhuhr,
				asr: times.Asr,
				maghrib: times.Maghrib,
				isha: times.Isha,
				imsak: times.Imsak,
				midnight: times.Midnight,
				date: data.data.readable
			}
		}
		throw 'The api returned an invalid response, try again later'
	}
}