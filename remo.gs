function getNatureRemoData(access_token, endpoint) {

  const headers = {
    "Content-Type" : "application/json;",
    'Authorization': 'Bearer ' + access_token,
  };

  const options = {
    "method" : "get",
    "headers" : headers,
  };

  return JSON.parse(UrlFetchApp.fetch("https://api.nature.global/1/" + endpoint, options));
}