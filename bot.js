// Import utils
const G_Utils = require('./bot_utils/bot.G_utils.js');
const D_Utils = require('./bot_utils/bot.D_utils.js');

const Discord_bot = D_Utils.Authentication_Discord()
 
const octokit = G_Utils.Authentication_git()


Errors = G_Utils.GetError(octokit)
