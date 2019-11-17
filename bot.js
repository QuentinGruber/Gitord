// Import utils
var Utils = require('./bot_utils.js');

const Discord_bot = Utils.Authentication_Discord()
 
const octokit = Utils.Authentication_git()

Utils.Updt_issues(octokit)