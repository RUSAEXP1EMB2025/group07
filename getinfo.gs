function getInfo(info) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('sensor');

  if (!sheet) {
    throw new Error('シートが見つかりません');
  }

  let last_row = sheet.getLastRow();  //最終行を取得
  const value = sheet.getRange(last_row, info).getValue();
  console.log(value);
  return value;
}