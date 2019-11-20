// Import utils
const Utils = require('./bot_utils.js');

const Discord_bot = Utils.Authentication_Discord()
 
const octokit = Utils.Authentication_git()


Errors = Utils.GetError(octokit)
