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

GetChanelId = function () {  // used to get the id of the chanel where the bot will send msg
  var AuthData = GetAuthData();
  return AuthData.Chanel_id;
};

// Authentication 

exports.Authentication_Discord = function () {  // return our discord bot instance if connection has succeed
  // init API
  const Discord = require('discord.js');
  // Create bot instance
  Discord_bot = new Discord.Client();

  // Get bot token from auth.json file
  Token = GetDiscordToken()

  Discord_bot.login(Token)
  Chanel_id = GetChanelId()

  Discord_bot.on('ready', () => {  // is logged in 
    console.log(`Logged in as ${Discord_bot.user.tag} (Discord)!`);
    Discord_bot.channels.get(Chanel_id).send('Bot connected !')
  });
}

// Send errors message in Discord Channel
exports.DisplayError = function (errors) {
  console.log(errors)
  // Create an array of all msg that have to be send
  var msgList = []
  for (i = 0; i < errors.length; i++) {
    for (j = 0; j < errors[i].length; j++) {
      msgList.push("`" + ` Error : ${errors[i][j][3]}.` + "`" + ` "${errors[i][j][0]}" created by *${errors[i][j][2]}* at ${errors[i][j][1]}`)
    }
  }
  // Send all msg
  for (i = 0; i < msgList.length; i++) {
    Discord_bot.channels.get(Chanel_id).send(msgList[i])
  }
  Discord_bot.channels.get(Chanel_id).send("[-- **Check done!** --]")
}