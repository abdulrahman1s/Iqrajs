const fetch = require('node-fetch')


async function get_reciter_data(type = 'surah') {
	const url = type !== 'ayah' ? 'http://mp3quran.net/api/_english.php' : 'https://api.mp3quran.net/verse/verse_en.json'
	const response = await fetch(url)

	if (response.status === 200)
		return await response.json()

	throw 'The api returned an invalid response, try again later'
}

async function get_surah_reciters() {
	const data = await get_reciter_data()
	const temp = []

	return data.reciters
		.filter((obj) => obj.count >= 90)
		.map((obj) => {
			return {
				name: obj.name,
				riwayah: obj.rewaya,
				server: obj.Server
			}
		}).map((obj) => {
			if (!temp.includes(obj.riwayah)) {
				let newName = `${obj.name} - ${obj.riwayah}`
				temp.push(obj.riwayah)
				obj.name = newName
			}
			return obj
		})
}

async function get_ayah_reciters() {
	const data = await get_reciter_data('ayah')
	const temp = []

	return data.reciters_verse
		.filter((obj) => !['0', ''].includes(obj.audio_url_bit_rate_128))
		.map((obj) => {
			return {
				name: obj.name,
				riwayah: obj.rewaya,
				mushaf_type: obj.musshaf_type,
				ayah_url: obj.audio_url_bit_rate_128
			}
		}).map((obj) => {
			if (!temp.includes(obj.mushaf_type)) {
				temp.push(obj.mushaf_type)
				obj.name = `${obj.name} - ${obj.mushaf_type}`
			}
			return obj
		})
}

function get_page_reciters() {
	return Object.keys(require('../../JSON/reciters.json')).map((name) => {
		return {
			name: name.split(' ').map((str) => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ')
		}
	})
}

async function get_verse_count(surah) {
	const response = await fetch(`http://api.quran.com/api/v3/chapters/${surah}`)

	if (response.status === 200) {
		const data = await response.json()
		return Number(data.chapter.verses_count)
	}

	throw 'The api returned an invalid response, try again later'
}

async function get_surah_info(surah) {
	const response = await fetch(`http://api.quran.com/api/v3/chapters/${surah}`)

	if (response.status === 200) {
		const data = await response.json()
		return {
			name: data.chapter.name_simple,
			arabic_name: data.chapter.name_arabic
		}
	}

	throw 'The api returned an invalid response, try again later'
}

async function get_surah_names() {

	const response = await fetch('http://api.quran.com/api/v3/chapters')

	if (response.status === 200) {
		const data = await response.json()

		const surah_names = {}

		for (const surah of data.chapters) {
			surah_names[surah.name_simple.toLowerCase()] = surah.id
		}

		return surah_names
	}

	throw 'The api returned an invalid response, try again later'
}

async function get_surah_id_from_name(surah_name) {
	const surah_names = await get_surah_names()
	const surah_id = surah_names[surah_name]
	return surah_id
}

module.exports = {
	get_verse_count,
	get_surah_info,
	get_surah_names,
	get_surah_id_from_name,
	get_reciter_data,
	get_surah_reciters,
	get_ayah_reciters,
	get_page_reciters
}