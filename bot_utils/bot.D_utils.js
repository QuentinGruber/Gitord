// Extract Auth JSON data
GetAuthData = function () {
  const fs = require('fs');
  rawdata = fs.readFileSync('auth.json');
  var AuthData = JSON.parse(rawdata);
  return AuthData;
}

GetDiscordToken = function () {  // used to get Discord_bot's secret token
  var AuthData = GetAuthData();
  return AuthData.token;
};

// Authentication 

exports.Authentication_Discord = function () {  // return our discord bot instance if connection has succeed
  // init API
  const Discord = require('discord.js');
  // Create bot instance
  const bot = new Discord.Client();

  // Get bot token from auth.json file
  Token = GetDiscordToken()

  bot.login(Token)

  bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag} (Discord)!`);
    return bot;
  });
}