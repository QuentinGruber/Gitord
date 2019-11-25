// Import utils
const G_Utils = require('./bot_utils/bot.G_utils.js');
const D_Utils = require('./bot_utils/bot.D_utils.js');

// Auth bots

D_Utils.Authentication_Discord() // launch discord bot

function MainLoop() {
    G_Utils.GetError()
}
var TimeBetweenCheck = 60 // in sec
setInterval(function () { MainLoop() }, TimeBetweenCheck * 1000)  // Check & display error every T time