function getWeatherInfo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet_line = ss.getSheetByName('area');
  const locate = sheet_line.getRange(2, 3).getValue();
  //Open Weather MapのAPIキーを定義する(各自APIキーで書き換え)
  let apiKey = '0810821e4476128e086b60602b45be11';
  let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
  //日本の各地方の主要7都市を定義する
  let cityList = ['Sapporo,JP','Sendai,JP','Tokyo,JP','Nagoya,JP','Osaka,JP','Hiroshima,JP','Fukuoka,JP'];
  //スプレッドシートに書き込むための配列を初期化する
  let weatherInfo = [];
  //主要7都市分のAPIリクエストをForループで実行する
  for(let i = 0; i < cityList.length; i++){
    weatherInfo[i] = [];
    //APIリクエストするURLにAPIキーと取得都市のパラメータをセット
    let requestUrl = apiUrl + cityList[i] + '&appid=' + apiKey + '&lang=ja&units=metric';
    //UrlFetchAppでOpen Weather MapのAPIから天気データを取得する
    let response = UrlFetchApp.fetch(requestUrl).getContentText();
    //取得したデータはJSON形式のため、JSONとして変換する
    let json = JSON.parse(response);
    //Open Weather Mapから取得した天気情報の中から必要な情報を2次元配列に書き込み
    weatherInfo[i][0] = json['name'];
    weatherInfo[i][1] = json['weather'][0]['description'];
    weatherInfo[i][2] = json['main']['temp_min'];
    weatherInfo[i][3] = json['main']['temp_max'];
    weatherInfo[i][4] = json['main']['humidity'];
    weatherInfo[i][5] = json['main']['pressure'];
  }
  //スクリプトに紐付いたスプレッドシートのアクティブなシートを読み込み
  const sheet_sensor = ss.getSheetByName('sensor');
  //スプレッドシートにOpen Weather Mapから取得した天気情報を書き込み
  let last_row = sheet_sensor.getLastRow();  //最終行を取得
  sheet_sensor.getRange(last_row + 1, 4).setValue(weatherInfo[locate][3]);
}