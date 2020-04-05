/*
BSD 3-Clause License
Copyright (c) 2020, Quentin Gruber
All rights reserved.
*/

// Extract Auth JSON data
var Sjs = require('@quentingruber/simple-json');

// Apply Rules

exports.Check_error = function (data) {
  var Rules = Sjs.extract('Rules.json')  // Get Rules
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


