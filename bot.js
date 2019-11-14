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
const Github_token = Github_info[0]
const Github_repo_username = Github_info[1]
const Github_repo_name = Github_info[2]

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

const octokit = Utils.Authentication_git(Octokit,Github_token)

IssuesList = Utils.Getissues(octokit,Github_repo_username,Github_repo_name)

