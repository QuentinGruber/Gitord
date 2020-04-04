/*
BSD 3-Clause License
Copyright (c) 2020, Quentin Gruber
All rights reserved.
*/


// Import utils
var G_Utils = require('./bot_utils/bot.G_utils.js');
var D_Utils = require('./bot_utils/bot.D_utils.js');
var Sjs = require('@quentingruber/simple-json');

class Gitord {

    RefreshTime: number;
    WorkHours: any;
    WorkDays: any;
    constructor() {
        this.RefreshTime = Sjs.extract("config.json").RefreshTime
        this.WorkHours = Sjs.extract("config.json").WorkHours
        this.WorkDays = Sjs.extract("config.json").WorkDays

        D_Utils.Authentication_Discord()

    }

    MainLoop() {
        if (this.WorkHours.length == 0 && this.WorkDays.length == 0) // if WorkHours & WorkDays not configured
        {
            G_Utils.GetError()
        }
        else {
            var today = new Date(); // get new Date info
            for (var i = 0; i < this.WorkDays.length; i++) {
                if (this.WorkDays[i] == today.getDay()) { // if it's a workDay
                    for (var j = 0; j < this.WorkHours.length; j++) {
                        if (today.getHours() - this.WorkHours[j][0] >= 0 && today.getHours() - this.WorkHours[j][0] <= 0) { // if it's a workHour
                            G_Utils.GetError()
                        }
                    }
                }
            }
        }
    }
}

var bot = new Gitord // create bot
setInterval(function () { bot.MainLoop() }, bot.RefreshTime * 1000)  // Check & display error every T time