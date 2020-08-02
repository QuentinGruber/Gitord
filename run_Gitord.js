"use strict";
exports.__esModule = true;
var Gitord_1 = require("./Gitord");
var bot = new Gitord_1.Gitord("Discord token", "Github token", "test-kanban-bot", "repo_test", "Discord chanel ID");
bot.welcome_message = false;
bot.RefreshTime = 5;
bot.Rules.IssueMinimalBody = 1;
bot.Rules.PullNeedToFix = false;
bot.Start();
