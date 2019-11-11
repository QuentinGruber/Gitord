function GetToken(){
  const fs = require('fs');
  rawdata = fs.readFileSync('auth.json');
  var AuthData = JSON.parse(rawdata);
  return AuthData.token
}

const Discord = require('discord.js')
const bot = new Discord.Client()

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
  });
  
  bot.on('message', msg => {
    if (msg.content === 'ping') {
      msg.reply('pong',String);
    }
  });

bot.login(GetToken())