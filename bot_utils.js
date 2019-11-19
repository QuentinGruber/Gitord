

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
 // Updt_Project(octokit); not working
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
    fs.writeFile(`${DataFileName}.json`, JSON.stringify(Data_json), (err) => { 
    if (err) throw err; })
}


// Get Github info from json

GetGithubInfo = function (Answer) {
  if(Answer == "issues"){
    return GetIssueInfo();
  }
}

GetIssueInfo = function () {
  const fs = require('fs');
    rawdata = fs.readFileSync('issuesInfo.json');
    var IssuesInfo = JSON.parse(rawdata);
    return IssuesInfo;
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
  var Error_found = []
  if (Rules.IssuesNeedLabel){
    error = Check_IssuesNeedLabel()
    if (error != null){
    Error_found.push(error)
    }
  }
  if (Rules.IssuesNeedAssignee){
    error = Check_IssuesAssignee()
    if (error != null){
    Error_found.push(error)
    }
  }
  if (Rules.IssueMinimalBody != 0){
    error = Check_IssueMinimalBody(Rules.IssueMinimalBody)
    if (error != null){
    Error_found.push(error)
    }
  }
  if (Rules.PullNeedToFix){
    error = Check_PullNeedToFix()
    if (error.length != 0){
    Error_found.push(error)
    }
  }
  if (Rules.PullNeedAssigneeWIP){

  }
  if (Rules.PullNeedReviewer){

  }
  return Error_found
}



// Check rules func 

Check_IssuesNeedLabel = function(){
    Issues = GetGithubInfo("issues")
    var error_found = []
    for (i=0;i<Issues.length;i++){
    if (Issues[i].labels.length == 0 && Issues[i].pull_request == undefined){
      error_found.push([Issues[i].title,Issues[i].html_url,Issues[i].user.login,"Missing Label!"])
    }
    }
    return error_found

}

Check_IssuesAssignee = function(){
  Issues = GetGithubInfo("issues")
  var error_found = []
  for (i=0;i<Issues.length;i++){
  if (Issues[i].assignee == null && Issues[i].pull_request == undefined){
    error_found.push([Issues[i].title,Issues[i].html_url,Issues[i].user.login,"Missing Assignee!"])
  }
  }
  return error_found

}

Check_IssueMinimalBody = function(Body_size){
  Issues = GetGithubInfo("issues")
  var error_found = []
  for (i=0;i<Issues.length;i++){

  if (Issues[i].body == null  && Issues[i].pull_request == undefined){
    error_found.push([Issues[i].title,Issues[i].html_url,Issues[i].user.login,`Body to small!(0/${Body_size})`])
  }
  else if (Issues[i].body.length < Body_size && Issues[i].pull_request == undefined){
    error_found.push([Issues[i].title,Issues[i].html_url,Issues[i].user.login,`Body to small!(${Issues[i].body.length}/${Body_size})`])
    }  
  }
  return error_found

}

Check_PullNeedToFix = function(){
  Issues = GetGithubInfo("issues")
  var error_found = []
  for (i=0;i<Issues.length;i++){

  if (Issues[i].body == null){
    if(Issues[i].pull_request != undefined){
    error_found.push([Issues[i].title,Issues[i].html_url,Issues[i].user.login,"Pull Request to not Fix/Close any issue1"])
    }
  }
  else if (String(Issues[i].body).includes('Close') == false && String(Issues[i].body).includes('Fix') == false && Issues[i].pull_request != undefined){
    console.log(String(Issues[i].body).includes('Close'))
    error_found.push([Issues[i].title,Issues[i].html_url,Issues[i].user.login,"Pull Request to not Fix/Close any issue2"])
    }  
  }
  return error_found

}