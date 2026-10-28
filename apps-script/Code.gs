// Owed post-session survey: writes each response into this spreadsheet.
// Setup steps are in README.md. Each response is one row, keyed by its Response ID,
// so a participant's row is updated as they move through the survey.

var SHEET_NAME = 'Responses';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var row = JSON.parse(e.postData.contents);
    var id = String(row['Response ID'] || '');
    if (!id) return reply({ ok: false, error: 'Missing Response ID' });

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Add a column for any field the sheet doesn't have yet. Response ID stays in column A.
    var keys = Object.keys(row);
    var lastCol = sheet.getLastColumn();
    var headers = lastCol ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    var missing = keys.filter(function (k) { return headers.indexOf(k) === -1; });
    if (missing.length) {
      sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
      headers = headers.concat(missing);
      sheet.setFrozenRows(1);
    }

    var values = headers.map(function (h) { return h in row ? cell(row[h]) : ''; });
    var target = 0;
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === id) { target = i + 2; break; }
      }
    }
    if (target) sheet.getRange(target, 1, 1, values.length).setValues([values]);
    else sheet.appendRow(values);

    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Lets you check the deployment by opening the web app URL in a browser.
function doGet() {
  return reply({ ok: true, service: 'owed-post-survey' });
}

// Participant text starting with = + - @ would otherwise run as a formula.
function cell(v) {
  if (typeof v === 'string' && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
