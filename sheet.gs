function getSheet(SPREADSHEET_ID, name) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    throw new Error('シートが見つかりません');
  }

  return sheet;
}

function getLastData(SPREADSHEET_ID, name) {
  return getSheet(SPREADSHEET_ID, name).getDataRange().getValues().length;
}
