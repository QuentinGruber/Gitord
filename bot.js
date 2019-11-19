// Import utils
const Utils = require('./bot_utils.js');

const Discord_bot = Utils.Authentication_Discord()
 
const octokit = Utils.Authentication_git()

Utils.Updt_GithubInfo(octokit) // Update data from github repo

Utils.Check_error()

console.log(Utils.Check_error())