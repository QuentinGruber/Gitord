exports.GetToken = function () {
    const fs = require('fs');
    rawdata = fs.readFileSync('auth.json');
    var AuthData = JSON.parse(rawdata);
    return AuthData.token;
  };

  exports.GetGithubInfo = function () {
    const fs = require('fs');
    rawdata = fs.readFileSync('auth.json');
    var AuthData = JSON.parse(rawdata);
    return [AuthData.Github_token,AuthData.Github_Repo_username,AuthData.Github_Repo_name];
  };