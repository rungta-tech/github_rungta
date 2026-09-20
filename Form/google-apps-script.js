/**
 * ==============================================================================
 * GitHub Club RISU - Student Recruitment Form Backend
 * Google Apps Script (Connects Google Sheets to the "Join Us" Form)
 * ==============================================================================
 * 
 * 🚀 QUICK SETUP INSTRUCTIONS (Takes < 2 minutes):
 * 
 * 1. Open Google Sheets:
 *    - Go to https://sheets.new to create a brand new Google Spreadsheet.
 *    - Name your spreadsheet: "GitHub Club RISU - Student Applications"
 * 
 * 2. Open Apps Script:
 *    - In the top menu of your Google Sheet, click: "Extensions" > "Apps Script".
 * 
 * 3. Paste this Code:
 *    - Delete any existing code in the Code.gs editor.
 *    - Copy and paste this ENTIRE file into the editor.
 *    - Click the floppy disk icon ("Save project") or press Ctrl+S.
 * 
 * 4. Deploy as a Web App:
 *    - Click the blue "Deploy" button at the top right > select "New deployment".
 *    - Click the gear icon ⚙️ next to "Select type" and select "Web app".
 *    - Set the following fields:
 *      * Description: "Recruitment Form API"
 *      * Execute as: "Me" (your email)
 *      * Who has access: "Anyone"   <--- ⚠️ VERY IMPORTANT! Must be "Anyone" so students can submit without Google login!
 *    - Click "Deploy".
 *    - Click "Authorize access" (log in with your Google account, click "Advanced" > "Go to ... (unsafe)" > "Allow").
 * 
 * 5. Copy Web App URL:
 *    - Copy the "Web app URL" (it looks like: https://script.google.com/macros/s/.../exec).
 *    - Paste it in `js/script.js` at `GOOGLE_SHEET_URL` (or paste it directly in the website's "View Applicants" settings).
 * 
 * 6. Done!
 *    - When anyone submits the "Join Us" form on the website, their application
 *      will instantly appear in your Google Spreadsheet and on the website's applicant dashboard!
 * ==============================================================================
 */

// 1. POST: Handle Form Submissions from the website
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000); // 15-second timeout to prevent race conditions

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // Auto-create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      setupSheetHeaders(sheet);
    }

    var data;
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    } else {
      data = {};
    }

    var timestamp = data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var name      = data.name      || "";
    var email     = data.email     || "";
    var year      = data.year      || "";
    var branch    = data.branch    || "";
    var phone     = data.phone     || "";
    var team      = data.team      || "";
    var github    = data.github    || "";
    var linkedin  = data.linkedin  || "";
    var skills    = data.skills    || "";
    var reason    = data.reason    || "";
    var projects  = data.projects  || "";

    // Append student application as a new row
    sheet.appendRow([
      timestamp,
      name,
      email,
      year,
      branch,
      "'" + phone, // Prefix with apostrophe so phone numbers with +91 or leading 0 don't get truncated
      team,
      github,
      linkedin,
      skills,
      reason,
      projects
    ]);

    // Apply auto-styling to the new row
    var lastRow = sheet.getLastRow();
    var rowRange = sheet.getRange(lastRow, 1, 1, 12);
    rowRange.setVerticalAlignment("middle");
    if (lastRow % 2 === 0) {
      rowRange.setBackground("#fbfcfd");
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Application recorded successfully!",
        applicant: name,
        row: lastRow
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 2. GET: Return the list of applicants as JSON (Powers the Website's Applicant Dashboard)
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    if (sheet.getLastRow() === 0) {
      setupSheetHeaders(sheet);
      return ContentService
        .createTextOutput(JSON.stringify({
          status: "success",
          count: 0,
          spreadsheetUrl: ss.getUrl(),
          applicants: []
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var values = sheet.getDataRange().getValues();
    var applicants = [];

    // Row 0 is headers, loop through actual applicant submissions
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      if (!row[1] && !row[2]) continue; // Skip empty rows

      applicants.push({
        id: i,
        timestamp: row[0],
        name: row[1],
        email: row[2],
        year: row[3],
        branch: row[4],
        phone: String(row[5]).replace(/^'/, ''),
        team: row[6],
        github: row[7],
        linkedin: row[8],
        skills: row[9],
        reason: row[10],
        projects: row[11]
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        count: applicants.length,
        spreadsheetUrl: ss.getUrl(),
        spreadsheetName: ss.getName(),
        applicants: applicants
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper: Setup formatted headers on sheet creation
function setupSheetHeaders(sheet) {
  var headers = [
    "Timestamp",
    "Full Name",
    "College Email",
    "Academic Year",
    "Branch / Department",
    "Phone / WhatsApp",
    "Preferred Position",
    "GitHub Profile",
    "LinkedIn Profile",
    "Primary Skills",
    "Why Join Statement",
    "Previous Projects"
  ];

  sheet.appendRow(headers);

  // Modern Dark Header Theme
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#161b22"); // GitHub dark slate
  headerRange.setFontColor("#58a6ff"); // GitHub electric blue
  headerRange.setFontSize(11);
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 36);

  // Freeze the top row so headers stay visible when scrolling
  sheet.setFrozenRows(1);

  // Auto-fit column widths
  sheet.autoResizeColumns(1, headers.length);
}
