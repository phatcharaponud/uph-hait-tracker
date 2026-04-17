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
  ADMINS: "admins",     // admin permissions
};

// ===== Entry Points =====

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || "list";
  try {
    let result;
    if (action === "list")           result = listItems();
    else if (action === "owners")    result = listOwners();
    else if (action === "log")       result = listLog();
    else if (action === "isAdmin")   result = checkIsAdmin(e.parameter.email || "");
    else if (action === "listAdmins") result = listAdmins();
    else throw new Error("Unknown action: " + action);
    return json({ ok: true, data: result });
  } catch (err) {
    return json({ ok: false, error: err.message });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    let result;

    // Admin management actions — require superadmin
    if (action === "addAdmin") {
      requireSuperAdmin(body.addedBy);
      result = addAdmin(body.email, body.name, body.role, body.addedBy);
    } else if (action === "removeAdmin") {
      requireSuperAdmin(body.removedBy);
      result = removeAdminEntry(body.email, body.removedBy);
    } else if (action === "updateAdminRole") {
      requireSuperAdmin(body.updatedBy);
      result = updateAdminRole(body.email, body.role, body.updatedBy);
    } else {
      // Item actions — require @up.ac.th domain
      const email = (body.userEmail || "").toLowerCase();
      if (!email.endsWith("@" + ALLOWED_DOMAIN)) {
        throw new Error("Unauthorized domain. Only @" + ALLOWED_DOMAIN + " is allowed.");
      }
      if      (action === "update")  result = updateItem(body.itemId, body.changes, email);
      else if (action === "create")  result = createItem(body.item, email);
      else if (action === "delete")  result = deleteItem(body.itemId, email);
      else throw new Error("Unknown action: " + action);
    }

    return json({ ok: true, data: result });
  } catch (err) {
    return json({ ok: false, error: err.message });
  }
}

// ===== Admin Management =====

function checkIsAdmin(email) {
  email = email.toLowerCase().trim();
  if (!email) return { isAdmin: false, role: "user" };

  var sh;
  try { sh = getSheet(SHEETS.ADMINS); } catch (e) { return { isAdmin: false, role: "user" }; }

  var values = sh.getDataRange().getValues();
  var headers = values[0];
  var emailCol = headers.indexOf("email");

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][emailCol]).toLowerCase().trim() === email) {
      var roleCol = headers.indexOf("role");
      var role = String(values[i][roleCol] || "admin");
      return { isAdmin: true, role: role };
    }
  }
  return { isAdmin: false, role: "user" };
}

function listAdmins() {
  var sh;
  try { sh = getSheet(SHEETS.ADMINS); } catch (e) { return []; }

  var values = sh.getDataRange().getValues();
  var headers = values.shift();
  return values.filter(function(r) { return r[0]; }).map(function(row) {
    return rowToObject(headers, row);
  });
}

function addAdmin(email, name, role, addedBy) {
  email = email.toLowerCase().trim();
  if (!email.endsWith("@" + ALLOWED_DOMAIN)) {
    throw new Error("Only @" + ALLOWED_DOMAIN + " emails allowed.");
  }

  var sh = getSheet(SHEETS.ADMINS);
  var values = sh.getDataRange().getValues();
  var headers = values[0];
  var emailCol = headers.indexOf("email");

  // Check duplicate
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][emailCol]).toLowerCase().trim() === email) {
      throw new Error("Admin already exists: " + email);
    }
  }

  sh.appendRow([email, name || "", role || "admin", addedBy, new Date()]);
  logActivity(addedBy, "addAdmin", email, "role=" + role);
  return { email: email, role: role };
}

function removeAdminEntry(email, removedBy) {
  email = email.toLowerCase().trim();
  var sh = getSheet(SHEETS.ADMINS);
  var values = sh.getDataRange().getValues();
  var headers = values[0];
  var emailCol = headers.indexOf("email");
  var roleCol = headers.indexOf("role");

  // Count superadmins
  var superAdminCount = 0;
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][roleCol]).toLowerCase() === "superadmin") superAdminCount++;
  }

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][emailCol]).toLowerCase().trim() === email) {
      if (String(values[i][roleCol]).toLowerCase() === "superadmin" && superAdminCount <= 1) {
        throw new Error("Cannot remove the last superadmin.");
      }
      sh.deleteRow(i + 1);
      logActivity(removedBy, "removeAdmin", email, "");
      return { email: email };
    }
  }
  throw new Error("Admin not found: " + email);
}

function updateAdminRole(email, newRole, updatedBy) {
  email = email.toLowerCase().trim();
  if (newRole !== "admin" && newRole !== "superadmin") {
    throw new Error("Invalid role: " + newRole);
  }

  var sh = getSheet(SHEETS.ADMINS);
  var values = sh.getDataRange().getValues();
  var headers = values[0];
  var emailCol = headers.indexOf("email");
  var roleCol = headers.indexOf("role");

  // If downgrading from superadmin, check count
  if (newRole !== "superadmin") {
    var superAdminCount = 0;
    for (var j = 1; j < values.length; j++) {
      if (String(values[j][roleCol]).toLowerCase() === "superadmin") superAdminCount++;
    }

    for (var i = 1; i < values.length; i++) {
      if (String(values[i][emailCol]).toLowerCase().trim() === email) {
        if (String(values[i][roleCol]).toLowerCase() === "superadmin" && superAdminCount <= 1) {
          throw new Error("Cannot downgrade the last superadmin.");
        }
        break;
      }
    }
  }

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][emailCol]).toLowerCase().trim() === email) {
      sh.getRange(i + 1, roleCol + 1).setValue(newRole);
      logActivity(updatedBy, "updateAdminRole", email, "role=" + newRole);
      return { email: email, role: newRole };
    }
  }
  throw new Error("Admin not found: " + email);
}

function requireSuperAdmin(email) {
  email = (email || "").toLowerCase().trim();
  var result = checkIsAdmin(email);
  if (!result.isAdmin || result.role !== "superadmin") {
    throw new Error("Only superadmin can perform this action.");
  }
}

// ===== Validation =====

var FIELD_LIMITS = {
  title: 200,
  notes: 1000,
  documentUrl: 500,
  refUrl: 500,
  ref: 500,
  owner: 100,
  id: 32,
  status: 32
};

var VALID_STATUSES = ["not_started", "in_progress", "completed", "needs_revision"];
var MAX_DAY = 366; // generous; frontend uses project-specific TOTAL_DAYS

function validateItemChanges(changes, fields) {
  for (var i = 0; i < fields.length; i++) {
    var k = fields[i];
    var v = changes[k];
    if (v === undefined || v === null) continue;

    if (FIELD_LIMITS[k] !== undefined) {
      var str = String(v);
      if (str.length > FIELD_LIMITS[k]) {
        throw new Error("Field '" + k + "' exceeds max length " + FIELD_LIMITS[k]);
      }
    }
    if (k === "status" && String(v) && VALID_STATUSES.indexOf(String(v)) === -1) {
      throw new Error("Invalid status: " + v);
    }
    if (k === "start" || k === "end") {
      var n = Number(v);
      if (!isFinite(n) || n < 1 || n > MAX_DAY || Math.floor(n) !== n) {
        throw new Error("Field '" + k + "' must be integer 1.." + MAX_DAY);
      }
    }
    if ((k === "documentUrl" || k === "refUrl" || k === "ref") && String(v).length > 0) {
      var url = String(v);
      if (!/^https?:\/\//i.test(url)) {
        throw new Error("Field '" + k + "' must be http(s) URL");
      }
    }
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

      // Permission check: non-admin can only edit status and owner
      const adminResult = checkIsAdmin(email);
      const allowedFields = adminResult.isAdmin
        ? Object.keys(changes)
        : Object.keys(changes).filter(k => k === "status" || k === "owner");

      // Server-side validation of known fields
      validateItemChanges(changes, allowedFields);

      allowedFields.forEach(k => {
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
  // Only admin can create
  const adminResult = checkIsAdmin(email);
  if (!adminResult.isAdmin) {
    throw new Error("Only admin can create items.");
  }

  validateItemChanges(item, Object.keys(item));

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
  // Only admin can delete
  const adminResult = checkIsAdmin(email);
  if (!adminResult.isAdmin) {
    throw new Error("Only admin can delete items.");
  }

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

  // users sheet
  let users = ss.getSheetByName(SHEETS.USERS);
  if (!users) users = ss.insertSheet(SHEETS.USERS);
  users.clear();
  users.getRange(1,1,1,3).setValues([["email","name","role"]]);
  users.setFrozenRows(1);
  users.getRange("A1:C1").setFontWeight("bold").setBackground("#1e3a5f").setFontColor("white");

  // admins sheet
  let admins = ss.getSheetByName(SHEETS.ADMINS);
  if (!admins) admins = ss.insertSheet(SHEETS.ADMINS);
  admins.clear();
  admins.getRange(1,1,1,5).setValues([["email","name","role","addedBy","addedAt"]]);
  admins.setFrozenRows(1);
  admins.getRange("A1:E1").setFontWeight("bold").setBackground("#1e3a5f").setFontColor("white");

  SpreadsheetApp.getUi().alert("✅ Setup เรียบร้อย! Sheets ทั้ง 5 ถูกสร้างแล้ว (รวม admins)");
}

// ===== Seed Super Admin (รันหลัง setupSheets ครั้งเดียว) =====

function seedSuperAdmin() {
  var sh;
  try {
    sh = getSheet(SHEETS.ADMINS);
  } catch (e) {
    // Create admins sheet if not exists
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    sh = ss.insertSheet(SHEETS.ADMINS);
    sh.getRange(1,1,1,5).setValues([["email","name","role","addedBy","addedAt"]]);
    sh.setFrozenRows(1);
    sh.getRange("A1:E1").setFontWeight("bold").setBackground("#1e3a5f").setFontColor("white");
  }

  var values = sh.getDataRange().getValues();
  // If only header row (or empty), seed super admin
  if (values.length <= 1) {
    sh.appendRow([
      "phatcharapon.ud@up.ac.th",
      "Phatcharaponud",
      "superadmin",
      "system",
      new Date()
    ]);
    SpreadsheetApp.getUi().alert("✅ Seeded super admin: phatcharapon.ud@up.ac.th");
  } else {
    SpreadsheetApp.getUi().alert("ℹ️ admins sheet already has data. No seed needed.");
  }
}
