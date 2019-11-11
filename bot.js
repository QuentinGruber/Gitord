const Discord = require('discord.js')
const bot = new Discord.Client()

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
  });
  
  bot.on('message', msg => {
    if (msg.content === 'ping') {
      msg.reply('pong');
    }
  });

bot.login('NjQzNDgzMDg4MTA1NTA0NzY5.XcmIaA.8p0WKJ08mHivZhxS1iiBn4twYq0')