

// Export JSON data

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




exports.Getissues = async function (octokit,Github_repo_username,Github_repo_name) {
  try{
    octokit.paginate("GET /repos/:owner/:repo/issues", {
    owner: Github_repo_username,
    repo: Github_repo_name
  })
  .then(issues => {
    console.log(issues)
  });
  }
  catch(e){
    console.log(e);
  }
  }