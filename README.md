# Gitord [![codebeat badge](https://codebeat.co/badges/042f97b4-6da9-4120-94df-9b6bacf25b8b)](https://codebeat.co/projects/github-com-quentingruber-gitord-master)

## Description

Gitord is a free and open-source "bot template" that alerts you in the Discord Chanel of your choice if your github repository does not respect the rules you apply to it.

## Installation

[Check Gitord's wiki ](https://github.com/QuentinGruber/Gitord/wiki)

`npm i Gitord`

## Usage

```typescript
import { Gitord } from "./Gitord";
var bot = new Gitord(
  "Discord token",
  "Github token",
  "test-kanban-bot",
  "repo_test",
  "Discord chanel ID"
);
bot.welcome_message = false;
bot.RefreshTime = 5;
bot.Rules.IssueMinimalBody = 1;
bot.Rules.PullNeedToFix = false;
bot.Start();
```

- 'Discord_token'
- 'Github*token' \_by leaving "anon" as a parameter of Github_token you can use Gitord anonymously, only for public directories and with an API rate limit*
- 'Github_Repo_owner'
- 'Github_Repo_name'

example: "QuentinGruber" is the repo_owner of this repo and "Gitord" is the repo_name\*

- 'Chanel_id'

To get the ID of a channel you have to switch your Discord to developer mode.

1. Go to the "appearance" settings of your account
2. Enable developer mode
3. Right-click on the channel of your choice and copy its identifier

- 'User_list'

  example : `"User_list":[["Github_Username1","DiscordID1"],["Github_Username2","DiscordID2"]]`

  To get a DiscordID right-click on the user of your choice and copy its identifier

More info about the available rules [here](https://github.com/QuentinGruber/Gitord/wiki/Rules-info).

Used Node.js version 12.18.0
