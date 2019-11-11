const Discord = require('discord.js')
const bot = new Discord.Client()

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
  });
  
  // Watch every message's content on the server
  bot.on('message', msg => {
    // If a msg is "ping"
    if (msg.content === 'ping') {
      msg.reply('pong');
    }
  });

  // import "Bot_utils.js"
  var Utils = require('./bot_utils.js');
  // Get bot token from auth.json file
  Token = Utils.GetToken()

  bot.login(Token)