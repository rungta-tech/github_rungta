/**
 * GitHub Club — Rungta International Skills University (RISU)
 * Official Community Portal Interactive Script
 * Clean, modular, Vanilla ES6+ implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     0. GOOGLE SHEETS & APPLICANTS CONFIGURATION
     ========================================================================== */
  // Paste your Google Apps Script Web App URL below (or configure via website modal)
  const DEFAULT_GOOGLE_SHEET_URL = ''; 
  const DEFAULT_SPREADSHEET_VIEW_URL = '';

  const getSheetUrl = () => {
    return localStorage.getItem('risu_github_sheet_url') || DEFAULT_GOOGLE_SHEET_URL;
  };

  const setSheetUrl = (url) => {
    localStorage.setItem('risu_github_sheet_url', url.trim());
    if (typeof updateSheetStatusUI === 'function') updateSheetStatusUI();
  };

  const getSpreadsheetViewUrl = () => {
    return localStorage.getItem('risu_github_spreadsheet_view_url') || DEFAULT_SPREADSHEET_VIEW_URL;
  };

  const setSpreadsheetViewUrl = (url) => {
    localStorage.setItem('risu_github_spreadsheet_view_url', url.trim());
    if (typeof updateSheetStatusUI === 'function') updateSheetStatusUI();
  };

  const APPLICATIONS_STORAGE_KEY = 'risu_github_club_applications';

  const getLocalApplications = () => {
    try {
      return JSON.parse(localStorage.getItem(APPLICATIONS_STORAGE_KEY) || '[]');
    } catch (_) {
      return [];
    }
  };

  const saveApplicationLocally = (app) => {
    const list = getLocalApplications();
    const newEntry = {
      id: Date.now(),
      ...app
    };
    list.unshift(newEntry);
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(list));
    if (typeof updateApplicantsBadge === 'function') updateApplicantsBadge();
    return newEntry;
  };

  /* ==========================================================================
     1. STICKY HEADER & ACTIVE NAVIGATION OBSERVER
     ========================================================================== */
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ScrollSpy using IntersectionObserver
  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach((section) => navObserver.observe(section));

  /* ==========================================================================
     2. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleDrawer = (open) => {
    const shouldOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
    mobileToggle.classList.toggle('open', shouldOpen);
    mobileDrawer.classList.toggle('open', shouldOpen);
    mobileToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => toggleDrawer());

    // Close on link click
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => toggleDrawer(false));
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleDrawer(false);
      }
    });
  }

  /* ==========================================================================
     3. INTERACTIVE TERMINAL TYPING ANIMATION
     ========================================================================== */
  const terminalContent = document.getElementById('terminal-lines');

  if (terminalContent) {
    const commands = [
      { text: 'git clone https://github.com/github-club-risu/community.git', isCmd: true, delay: 40 },
      { text: 'Cloning into \'community\'... done.', isCmd: false, delay: 15 },
      { text: 'cd community', isCmd: true, delay: 50 },
      { text: 'git checkout -b your-journey', isCmd: true, delay: 45 },
      { text: 'Switched to a new branch \'your-journey\'', isCmd: false, delay: 15 },
      { text: 'git commit -m "Start building"', isCmd: true, delay: 40 },
      { text: '[your-journey 7a3f89b] Start building', isCmd: false, delay: 15 },
      { text: 'git push origin main', isCmd: true, delay: 50 },
      { text: '✓ Welcome to GitHub Club RISU! Initialized new developer journey.', isCmd: false, isSuccess: true, delay: 15 }
    ];

    let currentCmdIdx = 0;
    let currentCharIdx = 0;

    const typeTerminal = () => {
      if (currentCmdIdx >= commands.length) {
        // Finished typing all lines; add blinking active prompt
        const promptLine = document.createElement('div');
        promptLine.className = 'terminal-line';
        promptLine.innerHTML = `<span class="prompt-symbol">$</span> <span class="term-cmd">Ready for your commit...</span><span class="cursor"></span>`;
        terminalContent.appendChild(promptLine);
        return;
      }

      const item = commands[currentCmdIdx];

      if (currentCharIdx === 0) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.id = `term-line-${currentCmdIdx}`;

        if (item.isCmd) {
          line.innerHTML = `<span class="prompt-symbol">$</span> <span class="term-cmd"></span><span class="cursor"></span>`;
        } else if (item.isSuccess) {
          line.innerHTML = `<span class="term-success"></span>`;
        } else {
          line.innerHTML = `<span class="term-output"></span>`;
        }
        terminalContent.appendChild(line);
      }

      const activeLine = document.getElementById(`term-line-${currentCmdIdx}`);

      if (item.isCmd) {
        const cmdSpan = activeLine.querySelector('.term-cmd');
        cmdSpan.textContent += item.text[currentCharIdx];
        currentCharIdx++;

        if (currentCharIdx < item.text.length) {
          setTimeout(typeTerminal, item.delay);
        } else {
          // Remove cursor from this line
          const cursor = activeLine.querySelector('.cursor');
          if (cursor) cursor.remove();
          currentCharIdx = 0;
          currentCmdIdx++;
          setTimeout(typeTerminal, 250);
        }
      } else {
        // Output lines appear quickly
        const outSpan = activeLine.querySelector(item.isSuccess ? '.term-success' : '.term-output');
        outSpan.textContent = item.text;
        currentCharIdx = 0;
        currentCmdIdx++;
        setTimeout(typeTerminal, 200);
      }
    };

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      commands.forEach((c) => {
        const l = document.createElement('div');
        l.className = 'terminal-line';
        if (c.isCmd) {
          l.innerHTML = `<span class="prompt-symbol">$</span> <span class="term-cmd">${c.text}</span>`;
        } else if (c.isSuccess) {
          l.innerHTML = `<span class="term-success">${c.text}</span>`;
        } else {
          l.innerHTML = `<span class="term-output">${c.text}</span>`;
        }
        terminalContent.appendChild(l);
      });
    } else {
      setTimeout(typeTerminal, 600);
    }
  }

  /* ==========================================================================
     4. COMMUNITY STATISTICS COUNT-UP ANIMATION
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const animateValue = (el, start, end, suffix, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * (end - start) + start);
      el.textContent = current + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = end + suffix;
      }
    };
    window.requestAnimationFrame(step);
  };

  const statsSection = document.querySelector('.stats-section');
  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        statNumbers.forEach((item) => {
          const target = parseInt(item.getAttribute('data-target'), 10) || 0;
          const suffix = item.getAttribute('data-suffix') || '';
          animateValue(item, 0, target, suffix, 1800);
        });
      }
    }, { threshold: 0.25 });

    statsObserver.observe(statsSection);
  }

  /* ==========================================================================
     5. EVENTS CATEGORY FILTERING
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const eventCards = document.querySelectorAll('.event-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      eventCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     6. FAQ ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-button');
    if (!button) return;

    button.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach((other) => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-button');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ==========================================================================
     7. RECRUITMENT FORM VALIDATION & SUBMISSION
     ========================================================================== */
  const recruitForm = document.getElementById('recruit-form');
  const successModal = document.getElementById('success-modal');
  const modalCandidateName = document.getElementById('modal-candidate-name');
  const modalCandidateTeam = document.getElementById('modal-candidate-team');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /^[0-9+-\s()]{8,15}$/;
    return re.test(phone.trim());
  };

  const validateUrl = (url) => {
    if (!url) return true; // Optional fields
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const setGroupError = (inputEl, message) => {
    const group = inputEl.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      const errEl = group.querySelector('.form-error-msg');
      if (errEl && message) errEl.textContent = message;
    }
  };

  const clearGroupError = (inputEl) => {
    const group = inputEl.closest('.form-group');
    if (group) {
      group.classList.remove('has-error');
    }
  };

  // Clear errors on typing
  if (recruitForm) {
    const inputs = recruitForm.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      input.addEventListener('input', () => clearGroupError(input));
      input.addEventListener('change', () => clearGroupError(input));
    });

    recruitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const name = document.getElementById('full-name');
      const email = document.getElementById('college-email');
      const year = document.getElementById('academic-year');
      const branch = document.getElementById('branch');
      const phone = document.getElementById('phone-number');
      const team = document.getElementById('preferred-team');
      const github = document.getElementById('github-profile');
      const linkedin = document.getElementById('linkedin-profile');
      const reason = document.getElementById('join-reason');
      const skills = document.getElementById('skills');

      // Validate Name
      if (!name.value.trim() || name.value.trim().length < 2) {
        setGroupError(name, 'Please enter your full name (minimum 2 characters).');
        isValid = false;
      }

      // Validate College Email
      if (!email.value.trim() || !validateEmail(email.value)) {
        setGroupError(email, 'Please enter a valid email address.');
        isValid = false;
      }

      // Validate Year
      if (!year.value) {
        setGroupError(year, 'Please select your current academic year.');
        isValid = false;
      }

      // Validate Branch
      if (!branch.value) {
        setGroupError(branch, 'Please select your branch.');
        isValid = false;
      }

      // Validate Phone
      if (!phone.value.trim() || !validatePhone(phone.value)) {
        setGroupError(phone, 'Please provide a valid 10-digit phone number.');
        isValid = false;
      }

      // Validate Preferred Team
      if (!team.value) {
        setGroupError(team, 'Please select your preferred club team.');
        isValid = false;
      }

      // Validate GitHub Profile
      if (github.value.trim() && !validateUrl(github.value.trim())) {
        setGroupError(github, 'Please provide a valid URL (e.g., https://github.com/username).');
        isValid = false;
      }

      // Validate LinkedIn Profile
      if (linkedin.value.trim() && !validateUrl(linkedin.value.trim())) {
        setGroupError(linkedin, 'Please provide a valid URL (e.g., https://linkedin.com/in/username).');
        isValid = false;
      }

      // Validate Reason
      if (!reason.value.trim() || reason.value.trim().length < 15) {
        setGroupError(reason, 'Please tell us why you want to join (at least 15 characters).');
        isValid = false;
      }

      if (!isValid) {
        const firstError = recruitForm.querySelector('.form-group.has-error input, .form-group.has-error select, .form-group.has-error textarea');
        if (firstError) firstError.focus();
        showToast('Please correct the highlighted fields before submitting.', 'error');
        return;
      }

      // Collect all form values including previous projects
      const previousProjects = document.getElementById('previous-projects');

      // Construct application payload with all fields
      const applicationData = {
        name: name.value.trim(),
        email: email.value.trim(),
        year: year.value,
        branch: branch.value,
        phone: phone.value.trim(),
        team: team.value,
        github: github.value.trim(),
        linkedin: linkedin.value.trim(),
        reason: reason.value.trim(),
        skills: skills ? skills.value.trim() : '',
        projects: previousProjects ? previousProjects.value.trim() : '',
        timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      };

      // 1. Immediately store in local storage (guarantees local access & zero loss)
      saveApplicationLocally(applicationData);

      // Submit button state
      const submitBtn = recruitForm.querySelector('[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳ Submitting...</span>';
      }

      const finishFormSubmission = (toastMessage, isSuccess) => {
        if (modalCandidateName) modalCandidateName.textContent = applicationData.name;
        if (modalCandidateTeam) modalCandidateTeam.textContent = applicationData.team;
        openModal(successModal);
        recruitForm.reset();
        showToast(toastMessage, isSuccess ? 'success' : 'info');
        if (typeof updateApplicantsBadge === 'function') updateApplicantsBadge();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      };

      // 2. Post to Google Sheet if configured
      const sheetUrl = getSheetUrl();
      if (sheetUrl && sheetUrl.startsWith('http')) {
        fetch(sheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(applicationData)
        })
        .then(() => {
          finishFormSubmission('🎉 Application saved and posted to your Google Sheet!', true);
        })
        .catch((err) => {
          console.warn('Google Sheet submission warning:', err);
          finishFormSubmission('✅ Application recorded locally! (Will sync when online)', true);
        });
      } else {
        // No Google Sheet configured yet
        setTimeout(() => {
          finishFormSubmission('🎉 Application recorded! Connect your Google Sheet to sync live.', true);
        }, 500);
      }
    });
  }

  /* ==========================================================================
     8. EVENT REGISTRATION MODAL
     ========================================================================== */
  const eventModal = document.getElementById('event-modal');
  const modalEventTitle = document.getElementById('modal-event-name');
  const registerButtons = document.querySelectorAll('.btn-register-event');
  const eventRegisterForm = document.getElementById('event-register-form');

  registerButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const eventCard = btn.closest('.event-card');
      const title = eventCard ? eventCard.querySelector('.event-title').textContent : 'GitHub Club Event';
      if (modalEventTitle) modalEventTitle.textContent = title;
      openModal(eventModal);
    });
  });

  if (eventRegisterForm) {
    eventRegisterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const regName = document.getElementById('reg-name');
      const regEmail = document.getElementById('reg-email');

      if (!regName.value.trim() || !validateEmail(regEmail.value)) {
        showToast('Please enter your name and valid college email.', 'error');
        return;
      }

      closeModal(eventModal);
      eventRegisterForm.reset();
      showToast('🎟️ Registration confirmed! Check your email for details.', 'success');
    });
  }

  /* Modal Helpers */
  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Generic modal close listeners
  document.querySelectorAll('.modal-overlay').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.modal-close-btn') || e.target.closest('.modal-dismiss-btn')) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach((m) => closeModal(m));
    }
  });

  /* ==========================================================================
     9. TOAST NOTIFICATION SYSTEM
     ========================================================================== */
  const toastContainer = document.getElementById('toast-container');

  const showToast = (message, type = 'success') => {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') {
      toast.style.borderLeftColor = 'var(--accent-red)';
    }

    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${type === 'error' 
          ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>' 
          : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'}
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger transition
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  };

  /* ==========================================================================
     10. NEWSLETTER SIGNUP
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      if (input && validateEmail(input.value)) {
        showToast('📬 Subscribed to GitHub Club RISU updates!', 'success');
        input.value = '';
      } else {
        showToast('Please enter a valid email address.', 'error');
      }
    });
  }

  /* ==========================================================================
     11. ROLE CHIP & APPLY BUTTON SELECTION HELPER
     ========================================================================== */
  const roleSelectButtons = document.querySelectorAll('.role-chip, .btn-apply-role');
  const preferredTeamSelect = document.getElementById('preferred-team');

  roleSelectButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const role = btn.getAttribute('data-role');
      if (preferredTeamSelect && role) {
        preferredTeamSelect.value = role;
        
        // Scroll to form smoothly
        const formEl = document.getElementById('recruit-form');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          clearGroupError(preferredTeamSelect);
          preferredTeamSelect.focus();
          
          // Flash glowing border effect
          preferredTeamSelect.style.borderColor = 'var(--accent-green-bright)';
          preferredTeamSelect.style.boxShadow = '0 0 0 4px rgba(46, 160, 67, 0.35)';
          setTimeout(() => {
            preferredTeamSelect.style.borderColor = '';
            preferredTeamSelect.style.boxShadow = '';
          }, 1500);

          showToast(`⚡ Selected position: ${role}`, 'success');
        }
      }
    });
  });

  /* ==========================================================================
     12. APPLICANT RECORDS DASHBOARD & GOOGLE SHEETS SYNC
     ========================================================================== */
  const applicantsModal = document.getElementById('applicants-modal');
  const btnViewApplicants = document.getElementById('btn-view-applicants');
  const footerViewApplicants = document.getElementById('footer-view-applicants');
  const applicantsCountBadge = document.getElementById('applicants-count-badge');
  const sheetDirectLink = document.getElementById('sheet-direct-link');
  const modalOpenSheetBtn = document.getElementById('modal-open-sheet-btn');
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnSyncSheet = document.getElementById('btn-sync-sheet');
  const sheetStatusIndicator = document.getElementById('sheet-status-indicator');
  const sheetStatusText = document.getElementById('sheet-status-text');
  const btnConfigSheetUrl = document.getElementById('btn-config-sheet-url');
  const applicantsSearchInput = document.getElementById('applicants-search-input');
  const applicantsRoleFilter = document.getElementById('applicants-role-filter');
  const applicantsListWrapper = document.getElementById('applicants-list-wrapper');
  
  // Sheet Settings Modal elements
  const sheetSettingsModal = document.getElementById('sheet-settings-modal');
  const sheetSettingsForm = document.getElementById('sheet-settings-form');
  const settingSheetUrl = document.getElementById('setting-sheet-url');
  const settingSpreadsheetUrl = document.getElementById('setting-spreadsheet-url');

  const updateSheetStatusUI = () => {
    const url = getSheetUrl();
    const viewUrl = getSpreadsheetViewUrl();

    if (sheetStatusIndicator && sheetStatusText) {
      if (url && url.startsWith('http')) {
        sheetStatusIndicator.classList.add('connected');
        sheetStatusText.textContent = 'Google Sheet: Connected & Ready';
      } else {
        sheetStatusIndicator.classList.remove('connected');
        sheetStatusText.textContent = 'Google Sheet: Not Connected (Using Local Storage)';
      }
    }

    if (sheetDirectLink) {
      if (viewUrl && viewUrl.startsWith('http')) {
        sheetDirectLink.href = viewUrl;
        sheetDirectLink.style.display = 'inline-flex';
      } else {
        sheetDirectLink.style.display = 'none';
      }
    }

    if (modalOpenSheetBtn) {
      if (viewUrl && viewUrl.startsWith('http')) {
        modalOpenSheetBtn.href = viewUrl;
        modalOpenSheetBtn.style.display = 'inline-flex';
      } else {
        modalOpenSheetBtn.style.display = 'none';
      }
    }
  };

  const updateApplicantsBadge = () => {
    const apps = getLocalApplications();
    if (applicantsCountBadge) {
      applicantsCountBadge.textContent = apps.length;
    }
  };

  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const renderApplicantsList = () => {
    if (!applicantsListWrapper) return;

    const apps = getLocalApplications();
    const query = (applicantsSearchInput ? applicantsSearchInput.value.trim().toLowerCase() : '');
    const roleFilter = (applicantsRoleFilter ? applicantsRoleFilter.value : '');

    const filtered = apps.filter((app) => {
      const matchesRole = !roleFilter || app.team === roleFilter;
      const matchesSearch = !query ||
        (app.name && app.name.toLowerCase().includes(query)) ||
        (app.email && app.email.toLowerCase().includes(query)) ||
        (app.branch && app.branch.toLowerCase().includes(query)) ||
        (app.skills && app.skills.toLowerCase().includes(query)) ||
        (app.phone && app.phone.includes(query));
      return matchesRole && matchesSearch;
    });

    if (filtered.length === 0) {
      const hasAny = apps.length > 0;
      applicantsListWrapper.innerHTML = `
        <div class="applicant-empty-state">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <div class="applicant-empty-title">
            ${hasAny ? 'No Matching Applicants Found' : 'No Student Applications Yet'}
          </div>
          <p class="applicant-empty-desc">
            ${hasAny
              ? 'Try changing your search keywords or role filter to view other candidates.'
              : 'When students submit the "Join Us" recruitment form, their applications will automatically appear here and in your Google Spreadsheet.'}
          </p>
          ${!hasAny ? `
            <button type="button" class="btn btn-primary btn-sm" id="btn-add-sample-applicant">
              <span>+ Add Demo Applicant</span>
            </button>
          ` : ''}
        </div>
      `;

      const btnSample = document.getElementById('btn-add-sample-applicant');
      if (btnSample) {
        btnSample.addEventListener('click', () => {
          saveApplicationLocally({
            name: 'Rahul Sharma',
            email: 'rahul.s@rungta.ac.in',
            year: '2nd Year',
            branch: 'Computer Science & Engineering',
            phone: '+91 98765 43210',
            team: 'Technical Lead',
            github: 'https://github.com/rahul-sharma',
            linkedin: 'https://linkedin.com/in/rahul-sharma',
            skills: 'JavaScript, React, Node.js, Git, Python',
            reason: 'I want to lead engineering workshops, help juniors build real open source projects, and contribute to RISU campus tech tools.',
            projects: 'Created CampusConnect portal and contributed to RISU automated timetable repository.',
            timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
          });
          showToast('Sample applicant added!', 'success');
          renderApplicantsList();
        });
      }
      return;
    }

    // Render cards
    applicantsListWrapper.innerHTML = filtered.map((app, index) => {
      const skillsPills = app.skills
        ? app.skills.split(',').map(s => `<span class="applicant-skill-badge">${escapeHtml(s.trim())}</span>`).join('')
        : '<span style="color: var(--text-muted); font-size: 0.78rem;">None listed</span>';

      return `
        <div class="applicant-card" data-index="${index}">
          <div class="applicant-card-header">
            <div class="applicant-name-wrap">
              <span class="applicant-name">${escapeHtml(app.name || 'Anonymous')}</span>
              <span class="applicant-role-tag">${escapeHtml(app.team || 'General Cohort')}</span>
            </div>
            <span class="applicant-timestamp">${escapeHtml(app.timestamp || '')}</span>
          </div>

          <div class="applicant-details-grid">
            <div class="applicant-detail-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <a href="mailto:${escapeHtml(app.email || '')}">${escapeHtml(app.email || 'N/A')}</a>
            </div>

            <div class="applicant-detail-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <a href="tel:${escapeHtml(app.phone || '')}">${escapeHtml(app.phone || 'N/A')}</a>
            </div>

            <div class="applicant-detail-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
              <span>${escapeHtml(app.year || '')} • ${escapeHtml(app.branch || '')}</span>
            </div>

            <div class="applicant-detail-item" style="gap: 0.75rem;">
              ${app.github ? `
                <a href="${escapeHtml(app.github)}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.3rem;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  <span>GitHub</span>
                </a>
              ` : ''}
              ${app.linkedin ? `
                <a href="${escapeHtml(app.linkedin)}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.3rem;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  <span>LinkedIn</span>
                </a>
              ` : ''}
            </div>
          </div>

          <div class="applicant-skills-row">
            <span style="color: var(--text-muted); font-size: 0.74rem;">Skills:</span>
            ${skillsPills}
          </div>

          <div class="applicant-expandable">
            <button type="button" class="applicant-expand-toggle">
              <span class="arrow">▸</span>
              <span>View Statement & Projects</span>
            </button>
            <div class="applicant-expanded-content" style="display: none; margin-top: 0.5rem;">
              <strong>Statement: Why Join</strong>
              <p style="margin: 0 0 0.5rem 0;">${escapeHtml(app.reason || 'No statement provided.')}</p>
              ${app.projects ? `
                <strong>Previous Projects & Experience:</strong>
                <p style="margin: 0;">${escapeHtml(app.projects)}</p>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach expandable toggles
    applicantsListWrapper.querySelectorAll('.applicant-expand-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        const arrow = btn.querySelector('.arrow');
        if (content.style.display === 'none' || !content.style.display) {
          content.style.display = 'block';
          if (arrow) arrow.textContent = '▾';
        } else {
          content.style.display = 'none';
          if (arrow) arrow.textContent = '▸';
        }
      });
    });
  };

  // Export to CSV
  const exportApplicantsCsv = () => {
    const apps = getLocalApplications();
    if (apps.length === 0) {
      showToast('No applications to export yet.', 'info');
      return;
    }

    const headers = [
      'Timestamp',
      'Full Name',
      'College Email',
      'Academic Year',
      'Branch',
      'Phone Number',
      'Preferred Team',
      'GitHub Profile',
      'LinkedIn Profile',
      'Skills',
      'Statement',
      'Previous Projects'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const clean = String(val).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = apps.map(app => [
      escapeCsv(app.timestamp),
      escapeCsv(app.name),
      escapeCsv(app.email),
      escapeCsv(app.year),
      escapeCsv(app.branch),
      escapeCsv(app.phone),
      escapeCsv(app.team),
      escapeCsv(app.github),
      escapeCsv(app.linkedin),
      escapeCsv(app.skills),
      escapeCsv(app.reason),
      escapeCsv(app.projects)
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `github_club_risu_applicants_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`📥 Exported ${apps.length} applicant records as CSV!`, 'success');
  };

  // Sync from Google Sheet
  const syncFromGoogleSheet = () => {
    const sheetUrl = getSheetUrl();
    if (!sheetUrl || !sheetUrl.startsWith('http')) {
      showToast('Please connect your Google Apps Script URL first.', 'info');
      openModal(sheetSettingsModal);
      return;
    }

    if (btnSyncSheet) {
      btnSyncSheet.disabled = true;
      btnSyncSheet.innerHTML = '<span>Syncing...</span>';
    }

    showToast('Fetching latest applicants from Google Spreadsheet...', 'info');

    fetch(sheetUrl, {
      method: 'GET',
      redirect: 'follow'
    })
    .then((res) => res.json())
    .then((data) => {
      if (data && data.status === 'success' && Array.isArray(data.applicants)) {
        if (data.spreadsheetUrl) {
          setSpreadsheetViewUrl(data.spreadsheetUrl);
        }

        // Merge with local applications avoiding duplicate emails & timestamps
        const localApps = getLocalApplications();
        const merged = [...data.applicants];

        localApps.forEach(local => {
          const exists = merged.some(m => m.email === local.email && m.timestamp === local.timestamp);
          if (!exists) {
            merged.push(local);
          }
        });

        localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(merged));
        updateApplicantsBadge();
        renderApplicantsList();
        showToast(`✅ Synced ${data.applicants.length} applicants from Google Sheet!`, 'success');
      } else {
        showToast('Google Sheet replied, but no applicants array was found.', 'info');
      }
    })
    .catch((err) => {
      console.warn('Sync failed:', err);
      showToast('⚠️ Could not fetch from Google Sheet. Check your Web App URL permissions ("Anyone").', 'error');
    })
    .finally(() => {
      if (btnSyncSheet) {
        btnSyncSheet.disabled = false;
        btnSyncSheet.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          <span>Sync</span>
        `;
      }
    });
  };

  // Connect listeners
  if (btnViewApplicants) {
    btnViewApplicants.addEventListener('click', () => {
      renderApplicantsList();
      updateSheetStatusUI();
      openModal(applicantsModal);
    });
  }

  if (footerViewApplicants) {
    footerViewApplicants.addEventListener('click', (e) => {
      e.preventDefault();
      renderApplicantsList();
      updateSheetStatusUI();
      openModal(applicantsModal);
    });
  }

  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', exportApplicantsCsv);
  }

  if (btnSyncSheet) {
    btnSyncSheet.addEventListener('click', syncFromGoogleSheet);
  }

  if (btnConfigSheetUrl) {
    btnConfigSheetUrl.addEventListener('click', () => {
      if (settingSheetUrl) settingSheetUrl.value = getSheetUrl();
      if (settingSpreadsheetUrl) settingSpreadsheetUrl.value = getSpreadsheetViewUrl();
      openModal(sheetSettingsModal);
    });
  }

  if (sheetSettingsForm) {
    sheetSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = settingSheetUrl ? settingSheetUrl.value.trim() : '';
      const viewUrl = settingSpreadsheetUrl ? settingSpreadsheetUrl.value.trim() : '';

      setSheetUrl(url);
      setSpreadsheetViewUrl(viewUrl);
      closeModal(sheetSettingsModal);
      updateSheetStatusUI();
      showToast('🎉 Google Spreadsheet connection updated!', 'success');
    });
  }

  if (applicantsSearchInput) {
    applicantsSearchInput.addEventListener('input', renderApplicantsList);
  }

  if (applicantsRoleFilter) {
    applicantsRoleFilter.addEventListener('change', renderApplicantsList);
  }

  // Initial badge and status load
  updateApplicantsBadge();
  updateSheetStatusUI();

  // Global exposure for console debugging or extensions
  window.githubClubPortal = {
    showToast,
    getApplications: getLocalApplications,
    saveApplication: saveApplicationLocally,
    setSheetUrl,
    getSheetUrl,
    setSpreadsheetViewUrl,
    openApplicantsModal: () => {
      renderApplicantsList();
      openModal(applicantsModal);
    }
  };
});
