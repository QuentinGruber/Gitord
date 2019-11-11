exports.GetToken = function () {
    const fs = require('fs');
    rawdata = fs.readFileSync('auth.json');
    var AuthData = JSON.parse(rawdata);
    return AuthData.token
  };