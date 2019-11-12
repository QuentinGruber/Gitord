// init API
const Discord = require('discord.js');
const Octokit = require("@octokit/rest");

/*
      *GITHUB BOT INIT*
 */

// basic auth
const octokit = new Octokit({  // "octokit" is our Github bot client
  auth: {
    username: "KanbanBotDiscord",
    password: "jesuisunrobot1",
    async on2fa() {
      // example: ask the user
      return prompt("Two-factor authentication Code:");
    }
  }
 });
 // TODO : console log auth succeed

 
/*
      *DISCORD BOT INIT*
 */

 // Create bot instance
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
  });
  
  // import "Bot_utils.js"
  var Utils = require('./bot_utils.js');
  // Get bot token from auth.json file
  Token = Utils.GetToken()

  bot.login(Token)






  /* SandBox part */

 // Watch every message's content on the server
 bot.on('message', msg => {
  // If a msg is "ping"
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});


  var ListOfIssues = octokit.issues.listForRepo({
    owner:"KanbanBotDiscord",
    repo:"repo_test"
  })
   console.log(ListOfIssues);