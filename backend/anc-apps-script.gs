/**
 * ANC Statistics - Google Apps Script Backend
 * โรงพยาบาลมหาวิทยาลัยพะเยา · แผนกฝากครรภ์
 *
 * วิธี deploy:
 *   1. เปิด Google Sheet ใหม่ ตั้งชื่อแท็บแรกเป็น "anc_records"
 *   2. Extensions → Apps Script → วางโค้ดทั้งหมดนี้
 *   3. Deploy → New deployment → Web app
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   4. คัดลอก URL ที่ได้ → ใส่ใน .env.local เป็น VITE_ANC_API_URL
 */

const SHEET_NAME = 'anc_records';

const COLUMNS = [
  'id',
  'serviceDate',
  'hn',
  'name',
  'age',
  'gravida',
  'ga',
  'visitNumber',
  'weight',
  'height',
  'bpSystolic',
  'bpDiastolic',
  'hct',
  'serviceType',
  'serviceUnit',
  'isFirstVisit',
  'risks',
  'notes',
  'createdAt',
  'updatedAt',
];

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'list';
  try {
    if (action === 'list') return json({ ok: true, data: listRecords() });
    if (action === 'health') return json({ ok: true, data: { now: new Date().toISOString() } });
    throw new Error('Unknown action: ' + action);
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const action = body.action;
    if (action === 'create') return json({ ok: true, data: createRecord(body.record) });
    if (action === 'update') return json({ ok: true, data: updateRecord(body.id, body.changes) });
    if (action === 'delete') return json({ ok: true, data: deleteRecord(body.id) });
    throw new Error('Unknown action: ' + action);
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold').setBackground('#e0e7ff');
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold').setBackground('#e0e7ff');
  }
  return sheet;
}

function listRecords() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const values = sheet.getRange(2, 1, lastRow - 1, COLUMNS.length).getValues();
  return values.map(rowToRecord_);
}

function rowToRecord_(row) {
  const rec = {};
  for (let i = 0; i < COLUMNS.length; i++) {
    const key = COLUMNS[i];
    let v = row[i];
    if (key === 'risks') {
      v = typeof v === 'string' && v ? v.split('|').filter(Boolean) : [];
    } else if (key === 'isFirstVisit') {
      v = v === true || v === 'TRUE' || v === 'true';
    } else if (
      key === 'age' || key === 'gravida' || key === 'ga' || key === 'visitNumber' ||
      key === 'weight' || key === 'height' || key === 'bpSystolic' || key === 'bpDiastolic' || key === 'hct'
    ) {
      v = v === '' || v === null ? null : Number(v);
    } else if (key === 'serviceDate' && v instanceof Date) {
      v = Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    }
    rec[key] = v;
  }
  return rec;
}

function createRecord(record) {
  const sheet = getSheet_();
  const now = new Date().toISOString();
  if (!record.id) record.id = Utilities.getUuid();
  if (!record.createdAt) record.createdAt = now;
  record.updatedAt = now;
  const row = COLUMNS.map((k) => {
    if (k === 'risks') return Array.isArray(record[k]) ? record[k].join('|') : '';
    if (k === 'isFirstVisit') return !!record[k];
    return record[k] == null ? '' : record[k];
  });
  sheet.appendRow(row);
  return record;
}

function updateRecord(id, changes) {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) throw new Error('Not found');
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().map((r) => r[0]);
  const idx = ids.indexOf(id);
  if (idx < 0) throw new Error('Not found: ' + id);
  const rowNum = idx + 2;
  const current = rowToRecord_(sheet.getRange(rowNum, 1, 1, COLUMNS.length).getValues()[0]);
  const merged = Object.assign({}, current, changes, { id, updatedAt: new Date().toISOString() });
  const newRow = COLUMNS.map((k) => {
    if (k === 'risks') return Array.isArray(merged[k]) ? merged[k].join('|') : '';
    if (k === 'isFirstVisit') return !!merged[k];
    return merged[k] == null ? '' : merged[k];
  });
  sheet.getRange(rowNum, 1, 1, COLUMNS.length).setValues([newRow]);
  return merged;
}

function deleteRecord(id) {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) throw new Error('Not found');
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().map((r) => r[0]);
  const idx = ids.indexOf(id);
  if (idx < 0) throw new Error('Not found: ' + id);
  sheet.deleteRow(idx + 2);
  return { id };
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
