/*
BSD 3-Clause License
Copyright (c) 2020, Quentin Gruber
All rights reserved.
*/

export class Gitord {
  RefreshTime: number;
  WorkHours: Array<Array<number>>;
  WorkDays: Array<number>;

  // Discord stuff
  Discord_bot: any;
  Discord_token: string;
  Chanel_id: string;
  User_list: Array<string>;

  // Github stuff
  octokit: any;
  Github_token: string;
  Github_Repo_owner: string;
  Github_Repo_name: string;

  constructor(
    Discord_token: string,
    Github_token: string = "anon",
    Github_Repo_owner: string = "test-kanban-bot",
    Github_Repo_name: string = "repo_test",
    Chanel_id: string = "",
    RefreshTime: number = 10,
    WorkHours: Array<Array<number>> = [],
    WorkDays: Array<number> = [],
    User_list: Array<string> = []
  ) {
    // config
    this.RefreshTime = RefreshTime;
    this.WorkHours = WorkHours;
    this.WorkDays = WorkDays;

    // Discord stuff
    this.Discord_token = Discord_token;
    this.Chanel_id = Chanel_id;
    this.User_list = User_list;
    this.Authentication_Discord();

    // Github stuff
    this.Github_token = Github_token;
    this.Github_Repo_owner = Github_Repo_owner;
    this.Github_Repo_name = Github_Repo_name;
    this.octokit = this.Authentication_git();

    // init
    this.MainLoop = this.MainLoop.bind(this);
  }

  private Authentication_git() {
    // return our github instance if connection has succeed
    // init API
    const Octokit = require("@octokit/rest");
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
          debug: () => {},
          info: () => {},
          warn: console.warn,
          error: console.error,
        },
      });
      return octokit;
    } else {
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
          debug: () => {},
          info: () => {},
          warn: console.warn,
          error: console.error,
        },
      });
      return octokit;
    }
  }

  private Authentication_Discord() {
    // return our discord bot instance if connection has succeed
    // init API
    // Create bot instance
    const Discord = require("discord.js");
    this.Discord_bot = new Discord.Client();
    this.Discord_bot.login(this.Discord_token);

    this.Discord_bot.on("ready", () => {
      // is logged in
      console.log(`Logged in as ${this.Discord_bot.user.tag} (Discord)!`);
      try {
        this.Discord_bot.channels.get(this.Chanel_id).send("Bot connected !");
        this.Start(); // when bot is setup on discord
      } catch (e) {
        throw new Error("Wrong chanel id ! Fill it in auth.json");
      }
    });
  }

  private async GetError() {
    // retrieve errors from the github repo
    let data = await this.octokit.paginate("GET /repos/:owner/:repo/issues", {
      owner: this.Github_Repo_owner,
      repo: this.Github_Repo_name,
    }); // Update data from github repo
    // send errors to the discord bot
    const Errors_Utils = require("./Errors_Utils.js");
    this.DisplayError(Errors_Utils.Check_error(data));
  }

  // Send errors message in Discord Channel
  private DisplayError(errors) {
    console.log(errors);
    // Create an array of all msg that have to be send
    var msgList = [];
    for (let i = 0; i < errors.length; i++) {
      for (let j = 0; j < errors[i].length; j++) {
        var User_found: boolean = false;
        for (let u = 0; u < this.User_list.length; u++) {
          if (this.User_list[u][0] == errors[i][j][2]) {
            User_found = true;
            var User = "<@!" + this.User_list[u][1] + ">";
            msgList.push(
              "`" +
                ` Error : ${errors[i][j][3]}.` +
                "`" +
                ` "${errors[i][j][0]}" created by ${User} at ${errors[i][j][1]}`
            );
          }
        }
        if (!User_found) {
          msgList.push(
            "`" +
              ` Error : ${errors[i][j][3]}.` +
              "`" +
              ` "${errors[i][j][0]}" created by *${errors[i][j][2]}* at ${errors[i][j][1]}`
          );
        }
      }
    }
    // Send all msg
    for (let i = 0; i < msgList.length; i++) {
      this.Discord_bot.channels.get(this.Chanel_id).send(msgList[i]);
    }
    //Discord_bot.channels.get(Chanel_id).send("[-- **Check done!** --]")
  }

  Start() {
    setInterval(() => {
      this.MainLoop();
    }, this.RefreshTime * 1000); // Check & display error every T time
  }

  private MainLoop() {
    if (this.WorkHours.length == 0 && this.WorkDays.length == 0) {
      // if WorkHours & WorkDays not configured
      this.GetError();
    } else {
      var today = new Date(); // get new Date info
      for (var i = 0; i < this.WorkDays.length; i++) {
        if (this.WorkDays[i] == today.getDay()) {
          // if it's a workDay
          if (this.WorkDays.length != 0) {
            for (var j = 0; j < this.WorkHours.length; j++) {
              if (
                today.getHours() - this.WorkHours[j][0] >= 0 &&
                today.getHours() - this.WorkHours[j][0] <= 0
              ) {
                // if it's a workHour
                this.GetError();
              }
            }
          } else {
            // if no work hours as being specified
            this.GetError();
          }
        }
      }
    }
  }
}
