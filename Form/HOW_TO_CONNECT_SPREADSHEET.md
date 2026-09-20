# 📊 How to Connect Google Sheets to the "Join Us" Form

Follow this quick guide to connect a Google Spreadsheet to your website. Every time a student submits the **"Join Us"** recruitment form, their application will immediately appear in your Google Sheet and in the website's **"Applicant Records"** dashboard.

---

## ⚡ Quick 5-Step Setup (Takes 2 Minutes)

### Step 1: Create a Google Spreadsheet
1. Open [sheets.new](https://sheets.new) in your web browser.
2. Name the spreadsheet: **`GitHub Club RISU - Student Applications`**.

---

### Step 2: Open Google Apps Script
1. In the top menu bar of your Google Sheet, click **Extensions** > **Apps Script**.
2. A new tab will open with a code editor (`Code.gs`).

---

### Step 3: Paste the Code
1. Select all default code in `Code.gs` and delete it.
2. Open [`google-apps-script.js`](./google-apps-script.js) from this project folder.
3. Copy all the code from `google-apps-script.js` and paste it into `Code.gs`.
4. Click the **Save** icon (floppy disk) or press `Ctrl + S`.

---

### Step 4: Deploy as a Web App
1. Click the blue **Deploy** button at the top right > select **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `Recruitment Form API`
   - **Execute as**: `Me (<your-email>)`
   - **Who has access**: **`Anyone`** ⚠️ *(CRITICAL: Must be "Anyone" so students can submit applications without being asked to log in)*
4. Click **Deploy**.
5. Click **Authorize access** when prompted:
   - Select your Google account.
   - If you see *"Google hasn't verified this app"*, click **Advanced** > click **Go to Untitled project (unsafe)** > click **Allow**.
6. Copy the **Web app URL** that ends with `/exec`:
   - It will look like:
     `https://script.google.com/macros/s/AKfycbx.../exec`

---

### Step 5: Connect the URL to the Website

You have two easy ways to set your URL:

#### Option A: Right in the Website (Easiest!)
1. Open `index.html` in your browser.
2. Scroll to the **Join Us** section or click **"View Applicant Records"**.
3. In the Applicants modal, click **"Change Sheet URL"** (or the gear icon).
4. Paste your Web App URL and click **Save**.

#### Option B: In `js/script.js`
1. Open `js/script.js`.
2. At the top of the file, locate:
   ```javascript
   const GOOGLE_SHEET_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';
   ```
3. Replace the placeholder with your copied Web App URL and save the file.

---

## 📋 What Fields are Saved to Your Sheet?

The script automatically generates styled headers on the first submission:

| Column | Field Name | Description |
|---|---|---|
| **A** | **Timestamp** | Exact submission date & time |
| **B** | **Full Name** | Student's full name |
| **C** | **College Email** | Student's official `@rungta.ac.in` email |
| **D** | **Academic Year** | 1st, 2nd, 3rd, or 4th Year |
| **E** | **Branch / Dept** | Student's engineering/tech branch |
| **F** | **Contact Number** | WhatsApp / mobile number |
| **G** | **Applied Position** | 1 of the 9 Core Team positions selected |
| **H** | **GitHub Profile** | Link to candidate's GitHub handle |
| **I** | **LinkedIn Profile** | Link to candidate's LinkedIn profile |
| **J** | **Primary Skills** | Technical tools and languages |
| **K** | **Why Join Statement** | Student's statement of interest |
| **L** | **Previous Projects** | Portfolio & project repository links |

---

## 👥 How to View Student Applicants

1. **Directly in Google Sheets**: Open your Google Spreadsheet at any time to sort, filter, or share candidate rows with your executive council.
2. **On the Website**: Click the **"View Applicant Records"** button in the **"Ready to Build With Us?"** section.
   - Filter applicants by role (e.g. *Technical Lead*, *Event Lead*).
   - Search by student name or email in real-time.
   - Export all applicants directly to a **CSV** file.
   - Click **"Open Sheet ↗"** to jump directly into Google Sheets.
