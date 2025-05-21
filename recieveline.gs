const access_token = 'ory_at_iEHX0qauQvnfpSvoJPvb1Rh-nMSPQgyBo2RWpL_WoNA._bG2Ps7y1GDXJxRPFOEb7987x2V4xLddSaEmhIsR2tw' //アクセストークン
const id = {
  aircon : 'abeb5776-7131-48f3-894d-c80e60bf4e8c' + '/aircon_settings', //エアコンのID
  light : 'e8b63b89-dd93-4c1a-89f2-ecabec123a1e' + '/light' //ライトのID
}
const operation_off = {
  aircon : 'power-off',
  light : 'off'
}
//はい、いいえ、待機状態から操作を行う
function checkCell() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet_line = ss.getSheetByName('sheet2');
  const cellValue1 = sheet_line.getRange(2, 3).getValue();
  const cellValue2 = sheet_line.getRange(2, 4).getValue();
  const targetstring1 = "消す";
  const targetstring2 = "消さない";
  const targetstring3 = "0"
  const targetstring4 = "1"
  const targetstring5 = "2"
  if (cellValue1 == targetstring1){
    if (cellValue2 == targetstring3){
       postNatureRemo(id.light, access_token, operation_off.light)
       postMessage1(0);
       sheetdelete();
       console.log(0);
   }
   else if (cellValue2 == targetstring4){
       postNatureRemo(id.aircon, access_token, operation_off.aircon)
       postMessage1(1);
       sheetdelete();
       console.log(1);
   }
   else if (cellValue2 == targetstring5){
       postNatureRemo(id.light, access_token, operation_off.light)
       postNatureRemo(id.aircon, access_token, operation_off.aircon)
       postMessage1(2);
       sheetdelete();
       console.log(2);
   }
  }
  else if (cellValue1 == targetstring2){
     postMessage2();
     sheetdelete();
     console.log(3);
  }
}
function postMessage1(num) {
  const url = 'https://api.line.me/v2/bot/message/push';
  const token = '0LkFDkSoeDYDDqIXRWXRmILpPawouao3alwoMCpt2hSRhmxQTRYGX6VjL6UlWiQDCnqv+DH0UxFTo0ABx3+DvtTKc6rs9R43i3d7ZpOpLBwYl8cOb6Dmn4l681WUmhNVR0b+9wZq2+kpS87An35cNwdB04t89/1O/w1cDnyilFU=';
  const payload = [
    {
      to: 'Uf2cfa798341dd9870bd089e0cfaa336e',//ユーザーID
      messages: [
        { type: 'text', text: '電気を消しました' }
      ]
    },
    {
      to: 'Uf2cfa798341dd9870bd089e0cfaa336e',//ユーザーID
      messages: [
        { type: 'text', text: 'エアコンを消しました' }
      ]
    },
    {
      to: 'Uf2cfa798341dd9870bd089e0cfaa336e',//ユーザーID
      messages: [
        { type: 'text', text: '電気とエアコンを消しました' }
      ]
    },
  ];
  const params = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + token
    },
    payload: JSON.stringify(payload[num])
  };
  UrlFetchApp.fetch(url, params);
}
function sheetdelete() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet_line = ss.getSheetByName('sheet2');
  const range1 = sheet_line.getRange("C2");
  const addArray = [
    ['']
  ]
  range1.setValues(addArray)
  const range2 = sheet_line.getRange("D2");
  range2.setValues(addArray)
}
function postMessage2() {
  const url = 'https://api.line.me/v2/bot/message/push';
  const token = '0LkFDkSoeDYDDqIXRWXRmILpPawouao3alwoMCpt2hSRhmxQTRYGX6VjL6UlWiQDCnqv+DH0UxFTo0ABx3+DvtTKc6rs9R43i3d7ZpOpLBwYl8cOb6Dmn4l681WUmhNVR0b+9wZq2+kpS87An35cNwdB04t89/1O/w1cDnyilFU=';
  const payload = {
    to: 'Uf2cfa798341dd9870bd089e0cfaa336e',//ユーザーID
    messages: [
      { type: 'text', text: '操作は行いません' }
    ]
  };
  const params = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + token
    },
    payload: JSON.stringify(payload)
  };
  UrlFetchApp.fetch(url, params);
}