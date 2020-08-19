interface Rules {
    IssuesNeedLabel: boolean;
    IssuesNeedAssignee: boolean;
    IssueMinimalBody: number;
    PullNeedToFix: boolean;
    PullNeedAssigneeWIP: boolean;
    AssignedIssueNeedMstone: boolean;
}
export declare class Gitord {
    console_errors: boolean;
    welcome_message: boolean;
    RefreshTime: number;
    WorkHours: Array<Array<number>>;
    WorkDays: Array<number>;
    private Discord_bot;
    private Discord_token;
    Chanel_id: string;
    User_list: Array<string>;
    private octokit;
    private Github_token;
    private Github_Repo_owner;
    private Github_Repo_name;
    Rules: Rules;
    private error_utils;
    constructor(Discord_token: string, Github_token?: string, Github_Repo_owner?: string, Github_Repo_name?: string, Chanel_id?: string);
    private Authentication_git;
    private Authentication_Discord;
    private GetError;
    private DisplayError;
    Start(): void;
    private MainLoop;
}
export {};
