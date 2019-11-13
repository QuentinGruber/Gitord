// init API
const Discord = require('discord.js');
const Octokit = require("@octokit/rest");

// Import
  // import "Bot_utils.js"
  var Utils = require('./bot_utils.js');

/*
      *GITHUB BOT INIT*
 */

 // Load github info from auth.json
const Github_info = Utils.GetGithubInfo();
const Github_username = Github_info[0]
const Github_password = Github_info[1]
const Github_repo_username = Github_info[2]
const Github_repo_name = Github_info[3]

// basic auth
const octokit = new Octokit({  // "octokit" is our Github bot client
  auth: {
    username: Github_username,
    password: Github_password,
    async on2fa() {
      // example: ask the user
      return prompt("Two-factor authentication Code:");
    }
  },
  userAgent: 'KanbanBot v1.0.0',
  timeZone: 'Europe/Amsterdam',
  baseUrl: 'https://api.github.com',
  log: {
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error
  },
  request: {
    agent: undefined,
    fetch: undefined,
    timeout: 0
  },


 });
 console.log(`Logged in as ${Github_username} (Github)!`);

 
/*
      *DISCORD BOT INIT*
 */

 // Create bot instance
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag} (Discord)!`);
  });
  
  // Get bot token from auth.json file
  Token = Utils.GetToken()

  bot.login(Token)






  /* SandBox part */  // TODO : remove this 

 // Watch every message's content on the server
 bot.on('message', msg => {
  // If a msg is "ping"
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

  var ListOfIssues = octokit.issues.listForRepo({
    owner:Github_repo_username,
    repo:Github_repo_name
  })
   console.log(ListOfIssues);
