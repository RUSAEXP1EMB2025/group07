var channel_token = "0LkFDkSoeDYDDqIXRWXRmILpPawouao3alwoMCpt2hSRhmxQTRYGX6VjL6UlWiQDCnqv+DH0UxFTo0ABx3+DvtTKc6rs9R43i3d7ZpOpLBwYl8cOb6Dmn4l681WUmhNVR0b+9wZq2+kpS87An35cNwdB04t89/1O/w1cDnyilFU="
var url = "https://api.line.me/v2/bot/message/reply"
var spreadsheet = SpreadsheetApp.openById("16QkO1ctbkSsm0CTIiCmKkZcGkkiwApXt08PPRnR_CdQ");
var sheet_line = spreadsheet.getSheetByName('sheet2');
var sheet_area = spreadsheet.getSheetByName('area');
//LINEからのイベントがdoPostにとんでくる
function doPost(e) {
  const cellValue = sheet_line.getRange("D2").getValue();
  if(cellValue == "0") {
    const range = sheet_line.getRange("D2"); //スプレッドシートに回答を入力
    range.setValue("");
    var sheet = sheet_area;
  }
  else {
    var sheet = sheet_line;
  }
  //とんできた情報を扱いやすいように変換している
  var json = e.postData.contents;
  var events = JSON.parse(json).events;
  var dat = sheet.getDataRange().getValues(); //受け取ったシートのデータを二次元配列に取得
  //とんできたイベントの種類を確認する
  events.forEach(function(event) {
    // ユーザーIDとユーザー名を取得
    var userId = event.source.userId;
    var json  = UrlFetchApp.fetch("https://api.line.me/v2/bot/profile/" + userId, {"headers" : {"Authorization" : "Bearer " + channel_token}});
    var displayName = JSON.parse(json).displayName;
    //スプレッドシートに書き込む
    for(var i=1;i<dat.length;i++){
      if(dat[i][0] == userId){
        break;
      }
    }
    if(i==dat.length) {
      sheet.appendRow([userId, displayName]);
    }
    //もしイベントの種類がトークによるテキストメッセージだったら
    if(event.type == "message") {
      if(event.message.type == "text"){
        //自動返信メッセージの内容
        var message = {
                        "replyToken" : event.replyToken,
                        "messages" : [{"type": "text","text" : "こちらはbotによる自動返信です。"}]
                      };
        //メッセージに添えなければならない情報
        var options = {
          "method" : "post",
          "headers" : {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + channel_token
          },
          "payload" : JSON.stringify(message)
        };
        //自動返信メッセージを送信する
        UrlFetchApp.fetch(url, options);
      }
    }
    else if(event.type == "postback") {
      var w_data = event.postback.data.split("&")[0].replace("data=","");//質問の内容を一時格納
      var w_item = event.postback.data.split("&")[1].replace("item=","");//回答を一時格納
      // 回答がきたら
      if(w_data == "survey1") {
        sheet.getRange(i+1, 3).setValue(w_item);//スプレッドシートに回答を入力
        survey_end(event);//「了解」メッセージ送信 
        checkCell(); 
          
      }
    }
  })
}
function select_operation (num) {
  var sheet = SpreadsheetApp.openById("16QkO1ctbkSsm0CTIiCmKkZcGkkiwApXt08PPRnR_CdQ");
  var ss = sheet.getSheetByName('sheet2');
  var dat = ss.getDataRange().getValues(); //受け取ったシートのデータを二次元配列に取得
for(var i=1;i<dat.length;i++){
  push_survey(dat[i][0], num)
}
}
function push_survey(userId, num){
  var sheet = SpreadsheetApp.openById("16QkO1ctbkSsm0CTIiCmKkZcGkkiwApXt08PPRnR_CdQ");
  var ss = sheet.getSheetByName('sheet2');
  var url = "https://api.line.me/v2/bot/message/push";
  var headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + channel_token,
  };
  var text = [
    "電気を消しますか？",
    "エアコンを消しますか？",
    "電気とエアコンを消しますか？"
  ]
  var s = num + "";
  const range = ss.getRange("D2"); //スプレッドシートに回答を入力
  range.setValue(s);
  var postData = {
        "to" : userId,
//★★★messages配信内容★★★
  'messages' : [
    {"type": "text","text" : text[num],
      "quickReply": {
          "items": [
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "消す",
                    "data":"data=survey1&item=消す",
                    "displayText": "消す"
                }
            },
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "消さない",
                    "data":"data=survey1&item=消さない",
                    "displayText": "消さない"
                }
            }
          ]
        }}
  ]
  //★★★messages配信内容 end★★★
  }
   var options = {
        "method" : "post",
        "headers" : headers,
        "payload" : JSON.stringify(postData)
      };
      return UrlFetchApp.fetch(url, options);
}

function survey_end(event){
  var message = {
      "replyToken" : event.replyToken,
      //★★★messages配信内容★★★
      'messages' : [
        {"type": "text","text" : "了解です"}
        ]
        //★★★messages配信内容 end★★★
    };
  //メッセージに添えなければならない情報
  var options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + channel_token
    },
    "payload" : JSON.stringify(message)
  };
  //自動返信メッセージを送信する
  UrlFetchApp.fetch(url, options);
}

function survey_area() {
  var sheet = SpreadsheetApp.openById("16QkO1ctbkSsm0CTIiCmKkZcGkkiwApXt08PPRnR_CdQ");
  var ss = sheet.getSheetByName('sheet2');
  var dat = ss.getDataRange().getValues(); //受け取ったシートのデータを二次元配列に取得
for(var i=1;i<dat.length;i++){
  push_area(dat[i][0])
}
}
function push_area(userId){
  var sheet = SpreadsheetApp.openById("16QkO1ctbkSsm0CTIiCmKkZcGkkiwApXt08PPRnR_CdQ");
  var ss = sheet.getSheetByName('sheet2');
  var url = "https://api.line.me/v2/bot/message/push";
  var headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + channel_token,
  };
  var postData = {
        "to" : userId,
//★★★messages配信内容★★★
  'messages' : [
    {"type": "text","text" : "地域を選択してください\n0:札幌\n1:仙台\n2:東京\n3:名古屋\n4:大阪\n5:広島\n6:福岡",
      "quickReply": {
          "items": [
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "0",
                    "data":"data=survey1&item=0",
                    "displayText": "0"
                }
            },
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "1",
                    "data":"data=survey1&item=1",
                    "displayText": "1"
                }
            },
             {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "2",
                    "data":"data=survey1&item=2",
                    "displayText": "2"
                }
            },
             {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "3",
                    "data":"data=survey1&item=3",
                    "displayText": "3"
                }
            },
             {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "4",
                    "data":"data=survey1&item=4",
                    "displayText": "4"
                }
            },
             {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "5",
                    "data":"data=survey1&item=5",
                    "displayText": "5"
                }
            },
             {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "6",
                    "data":"data=survey1&item=6",
                    "displayText": "6"
                }
            }
          ]
        }}
  ]
  //★★★messages配信内容 end★★★
  }
    
  var s = "0";
  const range = ss.getRange("D2"); //スプレッドシートに回答を入力
  range.setValue(s);

   var options = {
        "method" : "post",
        "headers" : headers,
        "payload" : JSON.stringify(postData)
      };
      return UrlFetchApp.fetch(url, options);
}
