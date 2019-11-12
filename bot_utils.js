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
    return [AuthData.Github_Username,AuthData.Github_Password,AuthData.Github_Repo_username,AuthData.Github_Repo_name];
  };