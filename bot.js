// Import utils
var Utils = require('./bot_utils.js');

const Discord_bot = Utils.Authentication_Discord()
 
const octokit = Utils.Authentication_git()

IssuesList = Utils.Getissues(octokit)

setTimeout(function(){
  IssuesList.then(function(result) {
    console.log(result) // "Some User token"
  })
}, 8000);