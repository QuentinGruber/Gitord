/*
BSD 3-Clause License
Copyright (c) 2020, Quentin Gruber
All rights reserved.
*/


// Import utils
const G_Utils = require('./bot_utils/bot.G_utils.js');
const D_Utils = require('./bot_utils/bot.D_utils.js');

// Extract Config JSON data
var Sjs = require('@quentingruber/simple-json');

GetConfigData = function () {
    return Sjs.extract("config.json");;
}

Config = GetConfigData()
// Auth bots

D_Utils.Authentication_Discord() // launch discord bot

function MainLoop() {
    G_Utils.GetError()
}

setInterval(function () { MainLoop() }, Config.RefreshTime * 1000)  // Check & display error every T time
