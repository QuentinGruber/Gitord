// Import utils
const G_Utils = require('./bot_utils/bot.G_utils.js');
const D_Utils = require('./bot_utils/bot.D_utils.js');

// Auth bots

const Discord_bot = D_Utils.Authentication_Discord()

function MainLoop(Discord_bot){
    console.log("ok")
    G_Utils.GetError(Discord_bot)

}

setInterval(function(){MainLoop()},20000)  // Check & display error every T time