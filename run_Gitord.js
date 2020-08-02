"use strict";
exports.__esModule = true;
var Gitord_1 = require("./Gitord");
var bot = new Gitord_1.Gitord("Discord Token", "anon", "test-kanban-bot", "repo_test", "ChanelID");
bot.RefreshTime = 4;
bot.Rules.IssueMinimalBody = 8;
bot.Start();
