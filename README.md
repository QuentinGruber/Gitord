# Gitord

## Description

Gitord is a free and open-source "bot template" that warn you in a Discord Chanel of your choice if your github repo do not follow the rules that you apply.

![Gitord exemple](https://i.ibb.co/rbwQMjh/gitord-exemple.png)

## Installation 
[Check Gitord's wiki ](https://github.com/QuentinGruber/Gitord)

`auth.json` is where you inform the following parameter : 
* 'Discord_token'
* 'Github_token'
* 'Github_Repo_owner' exemple "QuentinGruber" for this repo
* 'Github_Repo_name' and "Gitord"
* 'Chanel_id'

To get the ID of a chanel you have to switch your Discord to developer mode.

1. Go to the "appearance" settings of your account
2. Enable developer mode
3. Right-click on the channel of your choice and copy its identifier

## Usage

`rules.json` is where you inform which rule your github repo has to follow.

More info about the available rules [here](https://github.com/QuentinGruber/Gitord/wiki/Rules-info).

To start the bot run `node bot.js`

Used Node.js version 12.13.0
