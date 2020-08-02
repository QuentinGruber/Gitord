import { Gitord } from "./Gitord";
var bot = new Gitord(
  "Discord Token",
  "anon",
  "test-kanban-bot",
  "repo_test",
  "ChanelID"
);
bot.RefreshTime = 4;
bot.Rules.IssueMinimalBody = 8;
bot.Start();
