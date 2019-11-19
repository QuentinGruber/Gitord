// Import utils
const Utils = require('./bot_utils.js');

const Discord_bot = Utils.Authentication_Discord()
 
const octokit = Utils.Authentication_git()

Utils.Updt_issues(octokit) // Update issues's data from github repo

Utils.Check_error()