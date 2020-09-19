const Discord = require("discord.js");

const bot = new Discord.Client();
const config = require("./config.json");

const fs = require("fs")

bot.on("ready", async () => {
  console.log(`Connecté en tant que ${bot.user.tag}!`);
  bot.channels.cache.get(config.chan_dev).send('Matchmaking Arena est connecté.');

  bot.user.setPresence({status : 'dnd', activity: { name: 'Jean-Claude coder.', type: 'WATCHING' }});

})

bot.on("message", async message => {

})

bot.login(config.token);
