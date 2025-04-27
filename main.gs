function doGet() {
  const access_token = 'アクセストークン'
  const SPREADSHEET_ID = 'スプレッドシートID'
  const id = {
    aircon : 'エアコンのID' + '/aircon_settings',
    light : 'ライトのID' + '/light'
    }
  const operation_off = {
    aircon : 'power-off',
    light : 'off'
  }
  const deviceData = getNatureRemoData(access_token, "devices");      //data取得
  const lastSensorData = getLastData(SPREADSHEET_ID, "sensor");         //最終data取得
  
  var arg = {
    te:deviceData[0].newest_events.te.val,  //温度
    il:deviceData[0].newest_events.il.val,  //照度
  }
  
  setSensorData(arg, lastSensorData + 1, SPREADSHEET_ID);
  if(Math.abs(30 - getInfo(2)) >= 5) {
    postNatureRemo(id.aircon, access_token, operation_off.aircon);
  }
  if(getInfo(3) >= 150) {
    postNatureRemo(id.light, access_token, operation_off.light);
  }
}

function setSensorData(data, row, SPREADSHEET_ID) {
  getSheet(SPREADSHEET_ID, 'sensor').getRange(row, 1, 1, 3).setValues([[new Date(), data.te, data.il]])
}