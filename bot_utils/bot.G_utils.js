/*
BSD 3-Clause License
Copyright (c) 2020, Quentin Gruber
All rights reserved.
*/

// Extract Auth JSON data
var Sjs = require('@quentingruber/simple-json');

GetAuthData = function () {
  return Sjs.extract("auth.json");
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
  if (GetGithubToken() != "anon") { // if not in anonymous mode
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
  } else {
    var octokit = new Octokit({  // "octokit" is our Github bot client
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
}

exports.GetError = async function () {  // retrieve errors from the github repo
  var octokit = Authentication_git()
  let data = await octokit.paginate("GET /repos/:owner/:repo/issues", {
    owner: GetGithubRepoInfo("Owner"),
    repo: GetGithubRepoInfo("Name")
  }) // Update data from github repo
  // send errors to the discord bot
  const D_Utils = require('./bot.D_utils.js');
  D_Utils.DisplayError(Check_error(data))
};


// Get Rules info

GetRules = function () {
  const fs = require('fs');
  rawdata = fs.readFileSync('Rules.json');
  var Rules = JSON.parse(rawdata);
  return Rules;
}


// Apply Rules

Check_error = function (data) {
  Rules = GetRules()  // Get Rules
  var Error_found = []  // init Error_found array

  if (Rules.IssuesNeedLabel == "true") { // if the following Rules is enable
    // Check if she's respected
    error = Check_IssuesNeedLabel(data) // return an array of all issues that do not follow this rule
    if (error.length != 0) { // if we found errors about this rule
      Error_found.push(error) // add them to the Error_found array
    }
  }
  if (Rules.IssuesNeedAssignee == "true") {
    error = Check_IssuesAssignee(data)
    if (error.length != 0) {
      Error_found.push(error)
    }
  }
  if (Rules.IssueMinimalBody != 0) {
    error = Check_IssueMinimalBody(data, Rules.IssueMinimalBody)
    if (error.length != 0) {
      Error_found.push(error)
    }
  }
  if (Rules.PullNeedToFix == "true") {
    error = Check_PullNeedToFix(data)
    if (error.length != 0) {
      Error_found.push(error)
    }
  }
  if (Rules.PullNeedAssigneeWIP == "true") {
    error = Check_PullNeedAssigneeWIP(data)
    if (error.length != 0) {
      Error_found.push(error)
    }
  }
  if (Rules.AssignedIssueNeedMstone == "true") {
    error = Check_AssignedIssueNeedMstone(data)
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

Check_IssuesNeedLabel = function (data) {
  Issues = data // get issues info
  var errors_found = [] // init local errors_found array
  if (Issues != undefined) {
    for (i = 0; i < Issues.length; i++) { // check all issues/pulls
      // if has 0 labels and isn't a pull request
      if (Issues[i].labels.length == 0 && Issues[i].pull_request == undefined) {
        // Add issue to the errors_found array
        errors_found.push([Issues[i].title, Issues[i].html_url, Issues[i].user.login, "Missing Label!"])
      }
    }
  }
  //return errors
  return errors_found

}

Check_IssuesAssignee = function (data) {
  Issues = data
  var errors_found = []
  if (Issues != undefined) {
    for (i = 0; i < Issues.length; i++) {
      // if has no assignee and isn't a pull request
      if (Issues[i].assignee == null && Issues[i].pull_request == undefined) {
        errors_found.push([Issues[i].title, Issues[i].html_url, Issues[i].user.login, "Missing Assignee!"])
      }
    }
  }
  return errors_found

}

Check_IssueMinimalBody = function (data, Body_size) {
  Issues = data
  var errors_found = []
  if (Issues != undefined) {
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
  }
  return errors_found

}

Check_PullNeedToFix = function (data) {
  Issues = data
  var errors_found = []
  if (Issues != undefined) {
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
  }
  return errors_found

}

Check_PullNeedAssigneeWIP = function (data) {
  Issues = data
  var errors_found = []
  if (Issues != undefined) {
    for (i = 0; i < Issues.length; i++) {
      if (Issues[i].pull_request != undefined && Issues[i].assignee == null) {
        if (String(Issues[i].title).includes('WIP') || String(Issues[i].title).includes('Work in progress') || String(Issues[i].title).includes('🚧')) {
          // if is an pull request without assignee that contain a WIP keyword
          errors_found.push([Issues[i].title, Issues[i].html_url, Issues[i].user.login, 'Pull Request "WIP" need an asignee'])
        }
      }
    }
  }
  return errors_found

}

Check_AssignedIssueNeedMstone = function (data) {
  Issues = data
  var errors_found = []
  if (Issues != undefined) {
    for (i = 0; i < Issues.length; i++) {
      if (Issues[i].assignee != null && Issues[i].pull_request == undefined && Issues[i].milestone == null) {
        errors_found.push([Issues[i].title, Issues[i].html_url, Issues[i].user.login, 'Assigned issue need a Milestone'])
      }
    }
  }
  return errors_found

}


