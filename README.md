# Gitord

## Description

Gitord is a free and open-source "bot template" that alerts you in the Discord Chanel of your choice if your github repository does not respect the rules you apply to it.

![Gitord exemple](https://i.ibb.co/rbwQMjh/gitord-exemple.png)

## Installation 
[Check Gitord's wiki ](https://github.com/QuentinGruber/Gitord/wiki)

`auth.json` is where you inform the following parameter : 

**[--All parameters must be filled in for Gitord to work!--]**
* 'Discord_token'
* 'Github_token'
* 'Github_Repo_owner'
* 'Github_Repo_name'

*exemple: "QuentinGruber" is the repo_owner of this repo and "Gitord" is the repo_name*

* 'Chanel_id'


To get the ID of a chanel you have to switch your Discord to developer mode.

1. Go to the "appearance" settings of your account
2. Enable developer mode
3. Right-click on the channel of your choice and copy its identifier

## Usage

Check `config.json` to change some default setting such as the Refresh Time

`rules.json` is where you inform which rule your github repo has to follow.

More info about the available rules [here](https://github.com/QuentinGruber/Gitord/wiki/Rules-info).

To start the bot run `node bot.js`

Used Node.js version 12.13.0
