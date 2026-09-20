# GitHub Club — Rungta International Skills University (RISU)

Official community portal website for the **GitHub Club** at **Rungta International Skills University (RISU)**, Chhattisgarh, India.

Built with a modern developer aesthetic inspired by GitHub's dark theme, terminal workflows, and high-performance frontend architecture.

---

## 🚀 Live Preview & Architecture

- **Stack**: Pure Semantic HTML5, Modern CSS3 (Variables, Grid, Flexbox, Glassmorphism), Vanilla ES6+ JavaScript.
- **Dependencies**: Zero runtime dependencies or heavy frameworks.
- **Typography**: `Inter`, `Plus Jakarta Sans`, and `Fira Code` via Google Fonts.
- **Design System**: GitHub Primer Dark color palette (`#0d1117`, `#161b22`, `#21262d`), subtle GitHub green accents (`#238636`, `#3fb950`), glowing borders, terminal visualizers.

---

## 📂 Project Structure

```
├── index.html          # Semantic, accessible HTML5 single-page application
├── css/
│   └── style.css       # Design tokens, responsive grid, glassmorphism, animations
├── js/
│   └── script.js       # Terminal typing, count-up animation, filter tabs, modal dialogs, form validation
├── assets/
│   ├── images/         # Visual assets and media
│   └── icons/          # SVG badges and graphics
└── README.md           # Documentation and maintenance guide
```

---

## ✨ Features Included

1. **Sticky Header & Responsive Navigation**: Smooth blur backdrop, active link spy, and an accessible mobile hamburger drawer.
2. **Terminal Hero Visualizer**: Animated typing sequence simulating real Git commands (`git clone`, `git checkout -b`, `git commit`, `git push`), commit activity sparklines, and clear CTAs.
3. **About Section**: "More Than a Club. It's a Community." detailing hands-on learning, hackathons, and open source with 4 core pillars (*Learn, Build, Collaborate, Contribute*).
4. **Why Join (01-06 Grid)**: Numbered feature cards with hover transitions.
5. **Events Dashboard**: Categorized filter tabs (*All, Bootcamp, Workshop, Open Source, Hackathon*) with dates, venues, status badges, and interactive RSVP modals.
6. **Executive Council (Meet the Team)**: 8 leadership roles (President, Vice President, Technical Lead, Event Lead, Community Manager, Design Lead, Social Media Lead, Content Lead) with GitHub and LinkedIn links.
7. **Projects Showcase**: Repository-styled cards (*CampusConnect, SkillShare, EmergencyConnect, DevMetrics*) with star counters, fork metrics, language tags, and direct demo buttons.
8. **Live Statistics Counter**: Real-time count-up animation upon viewport entry (100+ Members, 5+ Projects, 1+ Events, 0 Hackathons).
9. **9 Core Team Positions Open**:
   - Dedicated showcase cards with skills, responsibilities, and one-click role application:
     - **Technical Lead** (Development & Architecture)
     - **Creative Design Executive** (UI/UX & Branding)
     - **PR & Outreach Manager** (Partnerships & Sponsorships)
     - **Event Lead** (Hackathons & Workshops)
     - **Social Media Manager** (Growth & Channels)
     - **Media Production Executive** (Video & Photography)
     - **Content & Communications Strategist** (Technical Writing)
     - **Community Manager** (Discord & Student Culture)
     - **Operations Manager** (Execution & Cross-Team Synergy)
10. **Recruitment & Application Portal**:
    - Interactive 9-position selector chips.
    - Comprehensive application form: Name, College Email (`@rungta.ac.in`), Year, Branch, Phone, Selected Position, GitHub/LinkedIn URLs, Statement, and Skills.
    - Client-side validation with real-time error clearance.
    - `localStorage` persistence for local submissions and custom confirmation modal.
11. **FAQ Accordion**: 8 essential questions with smooth CSS transitions.
12. **Toast Notification System**: Lightweight micro-feedback for user actions.
13. **Footer**: Official RISU affiliation, social links (GitHub, LinkedIn, Instagram, Discord), and newsletter signup.

---

## 🛠️ How to Customize

### Adding or Editing Events
Edit `index.html` within `<div class="events-grid">`. Each card has a `data-category`:
```html
<div class="event-card" data-category="workshop">
  ...
  <h3 class="event-title">Your Event Title</h3>
  ...
</div>
```

### Updating Team Members
Edit cards inside `<div class="team-grid">` in `index.html`. Replace placeholder names and social links:
```html
<h3 class="team-name">Student Name</h3>
<p class="team-dept">Branch / Specialization</p>
```

### Connecting the Recruitment Form to Google Sheets
A complete Google Sheets backend is provided in `google-apps-script.js`:
1. Create a new Google Spreadsheet at [sheets.new](https://sheets.new).
2. Open **Extensions > Apps Script**, paste the code from [`google-apps-script.js`](./google-apps-script.js), and deploy as a **Web App** (Execute as: *Me*, Who has access: *Anyone*).
3. Paste your Web App URL into the website's **"View Applicant Records"** modal settings or at `DEFAULT_GOOGLE_SHEET_URL` in `js/script.js`.
4. Detailed 2-minute step-by-step instructions are available in [`HOW_TO_CONNECT_SPREADSHEET.md`](./HOW_TO_CONNECT_SPREADSHEET.md).

---

## 🌐 Deployment to GitHub Pages

1. Initialize a git repository:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of GitHub Club RISU portal"
   ```
2. Create a GitHub repository named `github-club` or `github-club-risu.github.io`.
3. Push your code:
   ```bash
   git remote add origin https://github.com/<your-org>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
4. In GitHub repository settings, navigate to **Pages** > Select **Deploy from branch: `main` / `root`** > Click **Save**.

---

© 2026 GitHub Club — Rungta International Skills University. All rights reserved.
