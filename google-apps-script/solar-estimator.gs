// ==== วางโค้ดนี้ทั้งหมดใน Google Apps Script ของ Google Sheet ใหม่ (แยกจากระบบ warranty) ====
// Extensions > Apps Script > วางทับโค้ดเดิมทั้งหมด > Deploy > New deployment > Web app
// Execute as: Me, Who has access: Anyone

const SHEETS = {
  leads: { name: "Leads", header: [
    "leadId", "บันทึกเมื่อ", "ชื่อ", "นามสกุล", "เบอร์โทร", "อีเมล",
    "ยินยอม PDPA", "รับข่าวสาร", "ประเภทอสังหาริมทรัพย์", "ค่าไฟต่อเดือน", "จังหวัด"
  ]},
  assessments: { name: "Assessments", header: [
    "leadId", "บันทึกเมื่อ", "มิเตอร์ TOU", "ชาร์จ EV ช่วงไหน", "% ใช้ไฟกลางวัน",
    "แผนขยายโหลดอนาคต", "ทำงานที่บ้าน", "ต้องการไฟสำรอง", "สถานะ EV", "ขนาดหลังคา",
    "Confidence Score", "ขนาดระบบ (kWp)", "งบลงทุน (บาท)", "ประหยัด/เดือน (บาท)", "ระยะคืนทุน (ปี)"
  ]},
  requests: { name: "Requests", header: ["leadId", "บันทึกเมื่อ"] },
};

// คอลัมน์ที่ห้าม Google Sheets auto-แปลงเป็นตัวเลข/วันที่ (ต้องคงเป็นข้อความล้วน)
const TEXT_ONLY_COLUMNS = ["leadId", "เบอร์โทร"];

function getSheet_(key) {
  const config = SHEETS[key];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(config.name);
  if (!sheet) sheet = ss.insertSheet(config.name);
  sheet.getRange(1, 1, 1, config.header.length).setValues([config.header]);
  return sheet;
}

function appendRow_(key, values) {
  const sheet = getSheet_(key);
  sheet.appendRow(values);

  const header = SHEETS[key].header;
  const newRow = sheet.getLastRow();
  TEXT_ONLY_COLUMNS.forEach(function (colName) {
    const col = header.indexOf(colName) + 1;
    if (col > 0) sheet.getRange(newRow, col).setNumberFormat("@");
  });
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    switch (payload.action) {
      case "submitLead":
        return handleSubmitLead_(payload);
      case "submitAssessment":
        return handleSubmitAssessment_(payload);
      case "submitRequest":
        return handleSubmitRequest_(payload);
      default:
        return jsonOutput_({ status: "error", message: "unknown action: " + payload.action });
    }
  } catch (err) {
    return jsonOutput_({ status: "error", message: err.message });
  }
}

function handleSubmitLead_(data) {
  appendRow_("leads", [
    data.leadId || "",
    new Date(),
    data.firstName || "",
    data.lastName || "",
    data.phone || "",
    data.email || "",
    data.pdpaConsent ? "ใช่" : "ไม่ใช่",
    data.marketingConsent ? "ใช่" : "ไม่ใช่",
    data.propertyType || "",
    data.monthlyBillBaht || "",
    data.province || "",
  ]);
  return jsonOutput_({ status: "ok" });
}

function handleSubmitAssessment_(data) {
  appendRow_("assessments", [
    data.leadId || "",
    new Date(),
    data.touMeter || "",
    data.evChargingTime || "",
    data.daytimeUsagePct != null ? data.daytimeUsagePct : "",
    Array.isArray(data.futureLoadOptions) ? data.futureLoadOptions.join(", ") : "",
    data.workFromHome || "",
    data.backupPowerNeeded || "",
    data.evStatus || "",
    data.roofSize || "",
    data.confidenceScore != null ? data.confidenceScore : "",
    data.finalKwp != null ? data.finalKwp : "",
    data.investmentBaht != null ? data.investmentBaht : "",
    data.savingsPerMonthBaht != null ? data.savingsPerMonthBaht : "",
    data.paybackYears != null ? data.paybackYears : "",
  ]);
  return jsonOutput_({ status: "ok" });
}

function handleSubmitRequest_(data) {
  appendRow_("requests", [data.leadId || "", new Date()]);
  return jsonOutput_({ status: "ok" });
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
