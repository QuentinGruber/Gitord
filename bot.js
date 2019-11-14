// init API
const Discord = require('discord.js');
const Octokit = require("@octokit/rest");

// Import
  // import "Bot_utils.js"
  var Utils = require('./bot_utils.js');

/*
    *FUNCTION*
*/

function Authentication_git() {
  // basic auth
  var octokit = new Octokit({  // "octokit" is our Github bot client
    auth: Github_token,
    userAgent: 'octokit/rest.js v1.2.3',
    previews: ['jean-grey', 'symmetra'],
    timeZone: 'Europe/Amsterdam',
    baseUrl: 'https://api.github.com',
    log: {
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error
    },
   });
    return octokit;
  }

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






  /* SandBox part */  // TODO : remove this 

 // Watch every message's content on the server
 bot.on('message', msg => {
  // If a msg is "ping"
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});


async function Getissues() {
  try{
  const  ListOfIssues  = await octokit.pulls.get({
    owner: Github_repo_username,
    repo: Github_repo_name,
    pull_number: 1
  });
}
catch(e){
  console.log(e);
}
}

const octokit = Authentication_git()
Getissues()