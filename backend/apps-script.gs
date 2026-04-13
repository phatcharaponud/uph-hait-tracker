/**
 * HAIT Tracker - Google Apps Script Backend
 * รพ.มหาวิทยาลัยพะเยา
 *
 * Deploy: Extensions → Apps Script → Deploy → New deployment → Web app
 *   - Execute as: Me
 *   - Who has access: Anyone (แต่จำกัดผ่าน domain check ด้านล่าง)
 */

const ALLOWED_DOMAIN = "up.ac.th";

// ชื่อ Sheet tabs
const SHEETS = {
  ITEMS: "items",       // ข้อมูล checklist
  USERS: "users",       // ผู้ใช้งานและ role
  LOG: "activity_log",  // บันทึกการเปลี่ยนแปลง
  OWNERS: "owners",     // รายชื่อผู้รับผิดชอบ
};

// ===== Entry Points =====

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || "list";
  try {
    let result;
    if (action === "list")         result = listItems();
    else if (action === "owners")  result = listOwners();
    else if (action === "log")     result = listLog();
    else throw new Error("Unknown action: " + action);
    return json({ ok: true, data: result });
  } catch (err) {
    return json({ ok: false, error: err.message });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const email = (body.userEmail || "").toLowerCase();

    // Domain check
    if (!email.endsWith("@" + ALLOWED_DOMAIN)) {
      throw new Error("Unauthorized domain. Only @" + ALLOWED_DOMAIN + " is allowed.");
    }

    const action = body.action;
    let result;
    if      (action === "update")  result = updateItem(body.itemId, body.changes, email);
    else if (action === "create")  result = createItem(body.item, email);
    else if (action === "delete")  result = deleteItem(body.itemId, email);
    else throw new Error("Unknown action: " + action);

    return json({ ok: true, data: result });
  } catch (err) {
    return json({ ok: false, error: err.message });
  }
}

// ===== Business Logic =====

function listItems() {
  const sh = getSheet(SHEETS.ITEMS);
  const values = sh.getDataRange().getValues();
  const headers = values.shift();
  return values.map(row => rowToObject(headers, row));
}

function listOwners() {
  const sh = getSheet(SHEETS.OWNERS);
  return sh.getDataRange().getValues()
    .slice(1) // skip header
    .filter(r => r[0])
    .map(r => ({ name: r[0], email: r[1] || "", role: r[2] || "editor" }));
}

function listLog() {
  const sh = getSheet(SHEETS.LOG);
  const values = sh.getDataRange().getValues();
  const headers = values.shift();
  return values.map(row => rowToObject(headers, row)).reverse(); // newest first
}

function updateItem(itemId, changes, email) {
  const sh = getSheet(SHEETS.ITEMS);
  const values = sh.getDataRange().getValues();
  const headers = values[0];
  const idCol = headers.indexOf("id");

  for (let i = 1; i < values.length; i++) {
    if (values[i][idCol] === itemId) {
      const rowNum = i + 1;
      const before = rowToObject(headers, values[i]);
      Object.keys(changes).forEach(k => {
        const col = headers.indexOf(k);
        if (col >= 0) sh.getRange(rowNum, col + 1).setValue(changes[k]);
      });
      // Update timestamp + user
      const tsCol = headers.indexOf("updatedAt");
      const userCol = headers.indexOf("updatedBy");
      if (tsCol >= 0)   sh.getRange(rowNum, tsCol + 1).setValue(new Date());
      if (userCol >= 0) sh.getRange(rowNum, userCol + 1).setValue(email);

      logActivity(email, "update", itemId, JSON.stringify(changes));
      return { itemId, changes, before };
    }
  }
  throw new Error("Item not found: " + itemId);
}

function createItem(item, email) {
  const sh = getSheet(SHEETS.ITEMS);
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const row = headers.map(h => {
    if (h === "updatedAt") return new Date();
    if (h === "updatedBy") return email;
    return item[h] || "";
  });
  sh.appendRow(row);
  logActivity(email, "create", item.id, JSON.stringify(item));
  return item;
}

function deleteItem(itemId, email) {
  const sh = getSheet(SHEETS.ITEMS);
  const values = sh.getDataRange().getValues();
  const headers = values[0];
  const idCol = headers.indexOf("id");
  for (let i = 1; i < values.length; i++) {
    if (values[i][idCol] === itemId) {
      sh.deleteRow(i + 1);
      logActivity(email, "delete", itemId, "");
      return { itemId };
    }
  }
  throw new Error("Item not found: " + itemId);
}

function logActivity(email, action, itemId, detail) {
  const sh = getSheet(SHEETS.LOG);
  sh.appendRow([new Date(), email, action, itemId, detail]);
}

// ===== Utilities =====

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(name);
  if (!sh) throw new Error("Sheet not found: " + name);
  return sh;
}

function rowToObject(headers, row) {
  const obj = {};
  headers.forEach((h, i) => {
    let v = row[i];
    if (v instanceof Date) v = v.toISOString();
    obj[h] = v;
  });
  return obj;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== Initial Setup (รันครั้งเดียวตอน deploy ใหม่) =====

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // items sheet
  let items = ss.getSheetByName(SHEETS.ITEMS);
  if (!items) items = ss.insertSheet(SHEETS.ITEMS);
  items.clear();
  items.getRange(1,1,1,12).setValues([[
    "id","catId","title","status","owner","dueDate",
    "startDate","documentUrl","refUrl","notes","updatedAt","updatedBy"
  ]]);
  items.setFrozenRows(1);
  items.getRange("A1:L1").setFontWeight("bold").setBackground("#1e3a5f").setFontColor("white");

  // owners sheet
  let owners = ss.getSheetByName(SHEETS.OWNERS);
  if (!owners) owners = ss.insertSheet(SHEETS.OWNERS);
  owners.clear();
  owners.getRange(1,1,1,3).setValues([["name","email","role"]]);
  owners.setFrozenRows(1);
  owners.getRange("A1:C1").setFontWeight("bold").setBackground("#1e3a5f").setFontColor("white");

  // log sheet
  let log = ss.getSheetByName(SHEETS.LOG);
  if (!log) log = ss.insertSheet(SHEETS.LOG);
  log.clear();
  log.getRange(1,1,1,5).setValues([["timestamp","user","action","itemId","detail"]]);
  log.setFrozenRows(1);
  log.getRange("A1:E1").setFontWeight("bold").setBackground("#1e3a5f").setFontColor("white");

  // users sheet (สำหรับ role control ถ้าต้องการ)
  let users = ss.getSheetByName(SHEETS.USERS);
  if (!users) users = ss.insertSheet(SHEETS.USERS);
  users.clear();
  users.getRange(1,1,1,3).setValues([["email","name","role"]]);
  users.setFrozenRows(1);
  users.getRange("A1:C1").setFontWeight("bold").setBackground("#1e3a5f").setFontColor("white");

  SpreadsheetApp.getUi().alert("✅ Setup เรียบร้อย! Sheets ทั้ง 4 ถูกสร้างแล้ว");
}
