"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Gitord = void 0;
/*
BSD 3-Clause License
Copyright (c) 2020, Quentin Gruber
All rights reserved.
*/
var Errors_Utils_1 = require("./Errors_Utils");
var Gitord = /** @class */ (function () {
    function Gitord(Discord_token, Github_token, Github_Repo_owner, Github_Repo_name, Chanel_id) {
        if (Github_token === void 0) { Github_token = "anon"; }
        if (Github_Repo_owner === void 0) { Github_Repo_owner = "test-kanban-bot"; }
        if (Github_Repo_name === void 0) { Github_Repo_name = "repo_test"; }
        if (Chanel_id === void 0) { Chanel_id = ""; }
        // config
        this.RefreshTime = 10;
        this.WorkHours = [];
        this.WorkDays = [];
        // Discord stuff
        this.Discord_token = Discord_token;
        this.Chanel_id = Chanel_id;
        this.User_list = [];
        this.Authentication_Discord();
        // Github stuff
        this.Github_token = Github_token;
        this.Github_Repo_owner = Github_Repo_owner;
        this.Github_Repo_name = Github_Repo_name;
        this.octokit = this.Authentication_git();
        // Rules
        this.Rules = {
            IssuesNeedLabel: true,
            IssuesNeedAssignee: true,
            IssueMinimalBody: 20,
            PullNeedToFix: true,
            PullNeedAssigneeWIP: true,
            AssignedIssueNeedMstone: true
        };
        // init
        this.error_utils = new Errors_Utils_1.error_utils();
        this.MainLoop = this.MainLoop.bind(this);
    }
    Gitord.prototype.Authentication_git = function () {
        // return our github instance if connection has succeed
        // init API
        var Octokit = require("@octokit/rest");
        if (this.Github_token != "anon") {
            // if not in anonymous mode
            // basic auth
            var octokit = new Octokit({
                // "octokit" is our Github bot client
                auth: this.Github_token,
                userAgent: "octokit/rest.js v1.2.3",
                previews: [
                    "jean-grey",
                    "symmetra",
                    "starfox-preview",
                    "inertia-preview",
                ],
                timeZone: "Europe/Amsterdam",
                baseUrl: "https://api.github.com",
                log: {
                    debug: function () { },
                    info: function () { },
                    warn: console.warn,
                    error: console.error
                }
            });
            return octokit;
        }
        else {
            var octokit = new Octokit({
                // "octokit" is our Github bot client
                userAgent: "octokit/rest.js v1.2.3",
                previews: [
                    "jean-grey",
                    "symmetra",
                    "starfox-preview",
                    "inertia-preview",
                ],
                timeZone: "Europe/Amsterdam",
                baseUrl: "https://api.github.com",
                log: {
                    debug: function () { },
                    info: function () { },
                    warn: console.warn,
                    error: console.error
                }
            });
            return octokit;
        }
    };
    Gitord.prototype.Authentication_Discord = function () {
        var _this = this;
        // return our discord bot instance if connection has succeed
        // init API
        // Create bot instance
        var Discord = require("discord.js");
        this.Discord_bot = new Discord.Client();
        this.Discord_bot.login(this.Discord_token);
        this.Discord_bot.on("ready", function () {
            // is logged in
            console.log("Logged in as " + _this.Discord_bot.user.tag + " (Discord)!");
            try {
                _this.Discord_bot.channels.get(_this.Chanel_id).send("Bot connected !");
                _this.Start(); // when bot is setup on discord
            }
            catch (e) {
                throw new Error("Wrong chanel id ! Fill it in auth.json");
            }
        });
    };
    Gitord.prototype.GetError = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.octokit.paginate("GET /repos/:owner/:repo/issues", {
                            owner: this.Github_Repo_owner,
                            repo: this.Github_Repo_name
                        })];
                    case 1:
                        data = _a.sent();
                        // send errors to the discord bot
                        this.DisplayError(this.error_utils.Check_error(data, this.Rules));
                        return [2 /*return*/];
                }
            });
        });
    };
    // Send errors message in Discord Channel
    Gitord.prototype.DisplayError = function (errors) {
        console.log(errors);
        // Create an array of all msg that have to be send
        var msgList = [];
        for (var i = 0; i < errors.length; i++) {
            for (var j = 0; j < errors[i].length; j++) {
                var User_found = false;
                for (var u = 0; u < this.User_list.length; u++) {
                    if (this.User_list[u][0] == errors[i][j][2]) {
                        User_found = true;
                        var User = "<@!" + this.User_list[u][1] + ">";
                        msgList.push("`" +
                            (" Error : " + errors[i][j][3] + ".") +
                            "`" +
                            (" \"" + errors[i][j][0] + "\" created by " + User + " at " + errors[i][j][1]));
                    }
                }
                if (!User_found) {
                    msgList.push("`" +
                        (" Error : " + errors[i][j][3] + ".") +
                        "`" +
                        (" \"" + errors[i][j][0] + "\" created by *" + errors[i][j][2] + "* at " + errors[i][j][1]));
                }
            }
        }
        // Send all msg
        for (var i = 0; i < msgList.length; i++) {
            this.Discord_bot.channels.get(this.Chanel_id).send(msgList[i]);
        }
        //Discord_bot.channels.get(Chanel_id).send("[-- **Check done!** --]")
    };
    Gitord.prototype.Start = function () {
        var _this = this;
        setInterval(function () {
            _this.MainLoop();
        }, this.RefreshTime * 1000); // Check & display error every T time
    };
    Gitord.prototype.MainLoop = function () {
        if (this.WorkHours.length == 0 && this.WorkDays.length == 0) {
            // if WorkHours & WorkDays not configured
            this.GetError();
        }
        else {
            var today = new Date(); // get new Date info
            for (var i = 0; i < this.WorkDays.length; i++) {
                if (this.WorkDays[i] == today.getDay()) {
                    // if it's a workDay
                    if (this.WorkDays.length != 0) {
                        for (var j = 0; j < this.WorkHours.length; j++) {
                            if (today.getHours() - this.WorkHours[j][0] >= 0 &&
                                today.getHours() - this.WorkHours[j][0] <= 0) {
                                // if it's a workHour
                                this.GetError();
                            }
                        }
                    }
                    else {
                        // if no work hours as being specified
                        this.GetError();
                    }
                }
            }
        }
    };
    return Gitord;
}());
exports.Gitord = Gitord;
