function postNatureRemo(id, access_token, operation_off){
  const url = 'https://api.nature.global/1/appliances/' + id;
  const options = {
    method : 'post',
    headers : {
      'Authorization': 'Bearer ' + access_token
    },
    payload : 'button=' + operation_off
  }
  UrlFetchApp.fetch(url, options);
}

function nature_remo() {
  postNatureRemo(id_light.light, 'power-off');
}