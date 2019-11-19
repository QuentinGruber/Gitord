

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

  GetGithubToken = function () {  // used to extract all Github's info in Auth.json
    var AuthData = GetAuthData();
    return AuthData.Github_token;
  };
  GetGithubRepoInfo = function (Asked) {  // used to extract all Github's info in Auth.json
    var AuthData = GetAuthData();
    if(Asked == "Owner"){ 
      return AuthData.Github_Repo_owner;
    }
    else if(Asked == "Name"){
      return AuthData.Github_Repo_name;
    }
    else{
      Console.error("GetGithubRepoInfo() doesn't provide an valid Asked value! [Owner/Name]")
    }
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

  exports.Authentication_git = function () { // return our github instance if connection has succeed
    // init API
    const Octokit = require("@octokit/rest");
    // basic auth
    var octokit = new Octokit({  // "octokit" is our Github bot client
      auth: GetGithubToken,
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


// Read Github Data

exports.Updt_issues = async function (octokit) {  
  try{
    octokit.paginate("GET /repos/:owner/:repo/issues", {
    owner: GetGithubRepoInfo("Owner"),
    repo: GetGithubRepoInfo("Name")
  })
  .then(issues => {
    var util = require("util");
    WriteIssueInfo(util.inspect(issues))
  });
  }
  catch(e){
    console.log(e);
  }
  }

WriteIssueInfo = function(Data){ // write issue data in a JSON file
  const fs = require("fs") 
  const dJSON = require('dirty-json');
  const Data_json = dJSON.parse(Data)
    fs.writeFile("IssueInfo.JSON", JSON.stringify(Data_json), (err) => { 
    if (err) throw err; })
}


// Get Rules info

GetRules = function () {
  const fs = require('fs');
  rawdata = fs.readFileSync('Rules.json');
  var Rules = JSON.parse(rawdata);
  return Rules;
}


// Apply Rules

exports.Check_error = function() {
  Rules = GetRules()
  if (Rules.IssuesNeedLabel){
    console.log("ok")
  }
  if (Rules.IssuesNeedAssignee){
    console.log("ok")
  }
  if (Rules.IssueMinimalBody != 0){
    console.log("ok")
  }
  if (Rules.PullNeedToFix){
    console.log("ok")
  }
  if (Rules.PullNeedAssigneeWIP){
    console.log("ok")
  }
  if (Rules.PullNeedReviewer){
    console.log("ok")
  }
}
