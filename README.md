[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/TheMaestro0/Iqrajs)
[![Run on Repl.it](https://repl.it/badge/github/eritislami/evobot)](https://repl.it/github/TheMaestro0/Iqrajs)


> Clone of [Iqra](https://github.com/galacticwarrior9/Iqra) but in javascript!

This is a simple bot that can play recitations of surahs, ayahs and mushaf pages from the Qur'an in voice chat, along with a live audio stream from Makkah. It currently supports 120+ reciters.

## Commands

### q!play
`q!play`  instructs the bot to play a recitation of a surah, ayah or page from the Qur'an. 
#### Playing a surah
```
q!play <surah number> <optional reciter>
```

**OR**
```
q!play <surah name> <optional reciter>
```


If no reciter is specified, Mishary al-Afasy's recitation will be used. 
[Click here for the list of **surah** reciters](https://github.com/galacticwarrior9/QuranBot/blob/master/Reciters.md).

**Example 1**: `q!play surah al-fatiha Shaik Abu Bakr Al Shatri`

This would play Abu Bakr al-Shatri's recitation of Surah al-Fatiha.

**Example 2**: `q!play surah 112 Abdulrahman Alsudaes`

This would play Abdul Rahman al-Sudais' recitation of Surah al-Ikhlas. 

#### Playing a single ayah
```
q!play ayah <surah>:<ayah> <optional reciter>
```
If no reciter is specified, Mishary al-Afasy's recitation will be used.

**Example**: `q!play ayah 2:255 Shaik Abu Bakr Al Shatri`

This would play Abu Bakr al-Shatri's recitation of Surah al-Baqarah, ayah 255.

#### Playing a single page from the mushaf

```
q!play page <page number> <optional reciter>
```
`<page>` must be between 1 and 604.
If no reciter is specified, Mishary al-Afasy's recitation will be used.

**Example**: `q!play page 10 hani al-rifai`

This would play Hani al-Rifai's recitation of the 10th page of a standard *mushaf*.

### q!reciters
Gets the lists of reciters for `q!play`.


### q!live
Plays online Qur'an radio.


### q!volume
Changes the volume of the recitation. 
```
q!volume <volume>
```
`<volume>` must be a number between 0 and 120, e.g. `q!volume 50`.


### q!pause
Pauses the recitation.

### q!resume
Resumes the recitation.

### q!stop
Disconnects the bot from voice chat.

### q!help
Lists all commands and how to use them. 

## Sources

 - [mp3quran.net](http://mp3quran.net/) for the surah recitations, ayah recitations and Qur'an radio.
 - [everyayah.com](https://everyayah.com/) for the page recitations.
 - [haramain.info](http://www.haramain.info/) for the live Makkah audio.


## Credits

[@galacticwarrior9](https://github.com/galacticwarrior9) For the idea and system & readme file :). ♥️

* [Original Repo](https://github.com/galacticwarrior9/Iqra)