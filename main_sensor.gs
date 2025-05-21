function doGet() {
  const access_token = 'ory_at_iEHX0qauQvnfpSvoJPvb1Rh-nMSPQgyBo2RWpL_WoNA._bG2Ps7y1GDXJxRPFOEb7987x2V4xLddSaEmhIsR2tw' //アクセストークン
  const SPREADSHEET_ID = '16QkO1ctbkSsm0CTIiCmKkZcGkkiwApXt08PPRnR_CdQ' //スプレッドシートID
  const deviceData = getNatureRemoData(access_token, "devices");      //data取得
  const lastSensorData = getLastData(SPREADSHEET_ID, "sensor");         //最終data取得
  
  var arg = {
    te:deviceData[0].newest_events.te.val,  //温度
    il:deviceData[0].newest_events.il.val,  //照度
  }
  
  getWeatherInfo();
  setSensorData(arg, lastSensorData + 1, SPREADSHEET_ID);
  if(Math.abs(getInfo(4) - getInfo(2)) >= 7 && getInfo(3) >= 50) { //外の気温を取得して計算
    select_operation(2);
  }
  else if(getInfo(3) >= 50) { 
    select_operation(0);
  }
  else if(Math.abs(getInfo(4) - getInfo(2)) >= 7) {
    select_operation(1);
  }
}

function setSensorData(data, row, SPREADSHEET_ID) {
  getSheet(SPREADSHEET_ID, 'sensor').getRange(row, 1, 1, 3).setValues([[new Date(), data.te, data.il]])
}