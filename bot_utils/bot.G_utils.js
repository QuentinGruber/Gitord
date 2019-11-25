// Extract Auth JSON data

GetAuthData = function () {
  const fs = require('fs');
  rawdata = fs.readFileSync('auth.json');
  var AuthData = JSON.parse(rawdata);
  return AuthData;
}

GetGithubToken = function () {  // used to extract all Github's info in Auth.json
  var AuthData = GetAuthData();
  return AuthData.Github_token;
};
GetGithubRepoInfo = function (Asked) {  // used to extract all Github's info in Auth.json
  var AuthData = GetAuthData();
  if (Asked == "Owner") {
    return AuthData.Github_Repo_owner;
  }
  else if (Asked == "Name") {
    return AuthData.Github_Repo_name;
  }
  else {
    Console.error("GetGithubRepoInfo() doesn't provide an valid Asked value! [Owner/Name]")
  }
};

// Authentication 

Authentication_git = function () { // return our github instance if connection has succeed
  // init API
  const Octokit = require("@octokit/rest");
  // basic auth
  var octokit = new Octokit({  // "octokit" is our Github bot client
    auth: GetGithubToken,
    userAgent: 'octokit/rest.js v1.2.3',
    previews: ['jean-grey', 'symmetra', 'starfox-preview', 'inertia-preview'],
    timeZone: 'Europe/Amsterdam',
    baseUrl: 'https://api.github.com',
    log: {
      debug: () => { },
      info: () => { },
      warn: console.warn,
      error: console.error
    },
  });
  return octokit;
}

exports.GetError = function (octokit) {  // retrieve errors from the github repo
  octokit = Authentication_git()
  issues_path = 'Data/issuesInfo.json' // Json file that contain all "issues" errors
  Updt_GithubInfo(octokit) // Update data from github repo
  // Wait for github data being write/update 
  waitForDataCollecting()
  function waitForDataCollecting() {
    if (isCollectingData) {
      setTimeout(function () { waitForDataCollecting() }, 1000);
    }
    else {
      const D_Utils = require('./bot.D_utils.js');
      D_Utils.DisplayError(Check_error())
    }
  }
};

Updt_GithubInfo = function (octokit) {
  isCollectingData = true  // Set isCollectingData flag to true
  Updt_issues(octokit);
  // Updt_Project(octokit); not working
}

IsJsonCreated = function () {
  const fs = require('fs')
  if (fs.existsSync(issues_path)) {  // if the json file exist
    isCollectingData = false // Set isCollectingData flag to false
  }
  else {
    IsJsonCreated()  // if not re-check
  }
}

// Read Github Data
Updt_issues = async function (octokit) {  // Update issues's data from github repo
  try {
    octokit.paginate("GET /repos/:owner/:repo/issues", {
      owner: GetGithubRepoInfo("Owner"),
      repo: GetGithubRepoInfo("Name")
    })
      .then(issues => {
        var util = require("util");
        WriteInfo(util.inspect(issues), issues_path) // write issues's data in a json file
        IsJsonCreated() // Check if the json file has been created
      });
  }
  catch (e) {
    console.log(e);
  }
}

Updt_Project = async function (octokit) {
  try {
    octokit.paginate("GET /projects/columns/:column_id/cards", {
      column_id: 1,
      media: "Accept"
    })
      .then(issues => {
        var util = require("util");
        WriteInfo(util.inspect(issues), "ProjectInfo")
      });
  }
  catch (e) {
    console.log(e);
  }
}
WriteInfo = function (Data, DataPath) { // write issue data in a JSON file
  const fs = require("fs")
  const dJSON = require('dirty-json');
  const Data_json = dJSON.parse(Data)
  fs.writeFile(DataPath, JSON.stringify(Data_json), (err) => {
    if (err) throw err;
  })
}


// Get Github info from json

GetGithubInfo = function (Answer) {
  if (Answer == "issues") {
    return GetIssueInfo();
  }
}

GetIssueInfo = function () {
  const fs = require('fs');
  rawdata = fs.readFileSync(issues_path);
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

Check_error = function () {
  Rules = GetRules()  // Get Rules
  var Error_found = []  // init Error_found array

  if (Rules.IssuesNeedLabel) { // if the following Rules is enable
    // Check if she's respected
    error = Check_IssuesNeedLabel() // return an array of all issues that do not follow this rule
    if (error.length != 0) { // if we found errors about this rule
      Error_found.push(error) // add them to the Error_found array
    }
  }
  if (Rules.IssuesNeedAssignee) {
    error = Check_IssuesAssignee()
    if (error.length != 0) {
      Error_found.push(error)
    }
  }
  if (Rules.IssueMinimalBody != 0) {
    error = Check_IssueMinimalBody(Rules.IssueMinimalBody)
    if (error.length != 0) {
      Error_found.push(error)
    }
  }
  if (Rules.PullNeedToFix) {
    error = Check_PullNeedToFix()
    if (error.length != 0) {
      Error_found.push(error)
    }
  }
  if (Rules.PullNeedAssigneeWIP) {
    error = Check_PullNeedAssigneeWIP()
    if (error.length != 0) {
      Error_found.push(error)
    }
  }
  // After checking all rules return an array that contain all errors
  return Error_found
}



// Check rules func 

/*
  Errors format : [Issue/pull Title,Issue/pull URL,User that create it,"Error msg"]
*/

Check_IssuesNeedLabel = function () {
  Issues = GetGithubInfo("issues") // get issues info
  var errors_found = [] // init local errors_found array
  for (i = 0; i < Issues.length; i++) { // check all issues/pulls
    // if has 0 labels and isn't a pull request
    if (Issues[i].labels.length == 0 && Issues[i].pull_request == undefined) {
      // Add issue to the errors_found array
      errors_found.push([Issues[i].title, Issues[i].html_url, Issues[i].user.login, "Missing Label!"])
    }
  }
  //return errors
  return errors_found

}

Check_IssuesAssignee = function () {
  Issues = GetGithubInfo("issues")
  var errors_found = []
  for (i = 0; i < Issues.length; i++) {
    // if has no assignee and isn't a pull request
    if (Issues[i].assignee == null && Issues[i].pull_request == undefined) {
      errors_found.push([Issues[i].title, Issues[i].html_url, Issues[i].user.login, "Missing Assignee!"])
    }
  }
  return errors_found

}

Check_IssueMinimalBody = function (Body_size) {
  Issues = GetGithubInfo("issues")
  var errors_found = []
  for (i = 0; i < Issues.length; i++) {
    if (Issues[i].body == null && Issues[i].pull_request == undefined) {
      // if body is null and isn't a pull request
      errors_found.push([Issues[i].title, Issues[i].html_url, Issues[i].user.login, `Body to small!(0/${Body_size})`])
    }
    else if (Issues[i].body.length < Body_size && Issues[i].pull_request == undefined) {
      // if issue body is smaller that minimal body size and isn't a pull request
      errors_found.push([Issues[i].title, Issues[i].html_url, Issues[i].user.login, `Body to small!(${Issues[i].body.length}/${Body_size})`])
    }
  }
  return errors_found

}

Check_PullNeedToFix = function () {
  Issues = GetGithubInfo("issues")
  var errors_found = []
  for (i = 0; i < Issues.length; i++) {

    if (Issues[i].body == null) {
      if (Issues[i].pull_request != undefined) {
        // if body is null and is a pull request
        errors_found.push([Issues[i].title, Issues[i].html_url, Issues[i].user.login, "Pull Request do not Fix/Close any issue"])
      }
    }
    else if (String(Issues[i].body).includes('Close #') == false && String(Issues[i].body).includes('Fix #') == false && Issues[i].pull_request != undefined) {
      // if body doesn't use a keyword to close an issue and is a pull request
      errors_found.push([Issues[i].title, Issues[i].html_url, Issues[i].user.login, "Pull Request do not Fix/Close any issue"])
    }
  }
  return errors_found

}

Check_PullNeedAssigneeWIP = function () {
  Issues = GetGithubInfo("issues")
  var errors_found = []
  for (i = 0; i < Issues.length; i++) {
    if (Issues[i].pull_request != undefined && Issues[i].assignee == null) {
      if (String(Issues[i].title).includes('WIP') || String(Issues[i].title).includes('Work in progress') || String(Issues[i].title).includes('🚧')) {
        // if is an pull request without assignee that contain a WIP keyword
        errors_found.push([Issues[i].title, Issues[i].html_url, Issues[i].user.login, 'Pull Request "WIP" need an asignee'])
      }
    }
  }
  return errors_found

}