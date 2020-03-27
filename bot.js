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
    if (Config.WorkHours.length == 0 && Config.WorkDays.length == 0) // if WorkHours & WorkDays not configured
    {
        G_Utils.GetError()
    }
    else {
        var today = new Date(); // get new Date info
        for (var i = 0; i < Config.WorkDays.length; i++) {
            if (Config.WorkDays[i] == today.getDay()) { // if it's a workDay
                for (var j = 0; j < Config.WorkHours.length; j++) {
                    if (today.getHours() - Config.WorkHours[j][0] >= 0 && today.getHours() - Config.WorkHours[j][0] <= 0) { // if it's a workHour
                        G_Utils.GetError()
                        //break;
                    }
                }
            }
        }
    }
}

setInterval(function () { MainLoop() }, Config.RefreshTime * 1000)  // Check & display error every T time
