

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
      previews: ['jean-grey', 'symmetra','starfox-preview','inertia-preview'],
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

exports.Updt_GithubInfo = function (octokit) {
  Updt_issues(octokit);
  Updt_Project(octokit);
}

// Read Github Data
Updt_issues = async function (octokit) {  // Update issues's data from github repo
  try{
    octokit.paginate("GET /repos/:owner/:repo/issues", {
    owner: GetGithubRepoInfo("Owner"),
    repo: GetGithubRepoInfo("Name")
  })
  .then(issues => {
    var util = require("util");
    WriteInfo(util.inspect(issues),"issuesInfo")
  });
  }
  catch(e){
    console.log(e);
  }}

  Updt_Project = async function (octokit) {
    try{
      octokit.paginate("GET /projects/columns/:column_id/cards", {
        column_id: 1,
        media: "Accept"
    })
    .then(issues => {
      var util = require("util");
      WriteInfo(util.inspect(issues),"ProjectInfo")
    });
    }
    catch(e){
      console.log(e);
    }}
WriteInfo = function(Data,DataFileName){ // write issue data in a JSON file
  const fs = require("fs") 
  const dJSON = require('dirty-json');
  const Data_json = dJSON.parse(Data)
    fs.writeFile(`${DataFileName}.JSON`, JSON.stringify(Data_json), (err) => { 
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
  var Error_found
  if (Rules.IssuesNeedLabel){
    error = Check_IssuesNeedLabel()
    if (error != null){
    Error_found.append(error)
    }
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



// Check rules func 

Check_IssuesNeedLabel = function(){
    

}