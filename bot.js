/*
BSD 3-Clause License

Copyright (c) 2019, Quentin Gruber
All rights reserved.
*/


// Import utils
const G_Utils = require('./bot_utils/bot.G_utils.js');
const D_Utils = require('./bot_utils/bot.D_utils.js');

// Extract Config JSON data

GetConfigData = function () {
    const fs = require('fs');
    try {
        rawdata = fs.readFileSync('config.json');
    }
    catch (e) {
        throw new Error("config.json has been deleted!");
    }
    var ConfigData = JSON.parse(rawdata);
    return ConfigData;
}

Config = GetConfigData()
// Auth bots

D_Utils.Authentication_Discord() // launch discord bot

function MainLoop() {
    G_Utils.GetError()
}

setInterval(function () { MainLoop() }, Config.RefreshTime * 1000)  // Check & display error every T time
