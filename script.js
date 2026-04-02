/* ============================================================
   MININGTHON 2026 — MAIN SCRIPT
   ============================================================ */

/* ── Navbar: scroll effect ──────────────────────────────────── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ── Mobile Nav Toggle ──────────────────────────────────────── */
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

/* ── Active Nav Link ────────────────────────────────────────── */
(function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── Scroll Fade-In (IntersectionObserver) ──────────────────── */
const animClasses = ['.fade-in', '.fade-in-left', '.fade-in-right'];
const allAnimEls  = document.querySelectorAll(animClasses.join(','));

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

allAnimEls.forEach(el => scrollObserver.observe(el));

/* ── Hero Parallax (disabled — white hero has no bg image) ── */

/* ── Countdown Timer ────────────────────────────────────────── */
function initCountdown() {
  const deadline = new Date('2026-02-28T23:59:59').getTime();

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = Date.now();
    const diff = Math.max(0, deadline - now);

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    // Hero float card countdown
    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');
    if (dEl) dEl.textContent = pad(days);
    if (hEl) hEl.textContent = pad(hours);
    if (mEl) mEl.textContent = pad(mins);

    // CTA section countdown
    const ctaD = document.getElementById('cta-days');
    const ctaH = document.getElementById('cta-hours');
    const ctaM = document.getElementById('cta-mins');
    const ctaS = document.getElementById('cta-secs');
    if (ctaD) ctaD.textContent = pad(days);
    if (ctaH) ctaH.textContent = pad(hours);
    if (ctaM) ctaM.textContent = pad(mins);
    if (ctaS) ctaS.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
}

initCountdown();

/* ── Animated Number Counter ────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current  = eased * target;

    el.textContent = isFloat
      ? current.toFixed(1)
      : Math.floor(current).toLocaleString('en-IN');

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el  = entry.target;
      const raw = el.dataset.count;
      if (!raw) return;
      animateCounter(el, parseFloat(raw));
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ── FAQ Accordion ──────────────────────────────────────────── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');

    document.querySelectorAll('.faq-question').forEach(b => {
      b.classList.remove('open');
      b.nextElementSibling.classList.remove('open');
    });

    if (!isOpen) {
      btn.classList.add('open');
      answer.classList.add('open');
    }
  });
});

/* ── Member Tabs ────────────────────────────────────────────── */
(function initMemberTabs() {
  const membersSelect = document.getElementById('members');
  const section       = document.getElementById('memberTabsSection');
  const tabsEl        = document.getElementById('memberTabs');
  const panelsEl      = document.getElementById('memberPanels');
  if (!membersSelect || !section) return;

  // Check for duplicate values across all member fields of the same type
  function checkDuplicates(changedInput) {
    const name = changedInput.name; // e.g. m2_mobile
    const type = name.includes('_mobile') ? '_mobile' : '_email';
    const allInputs = Array.from(panelsEl.querySelectorAll(`input[name$="${type}"]`));
    const values = allInputs.map(el => el.value.trim().toLowerCase()).filter(v => v !== '');

    allInputs.forEach(el => {
      const group = el.closest('.form-group');
      const errEl = group.querySelector('.dup-error');
      const val   = el.value.trim().toLowerCase();
      const isDup = val !== '' && values.filter(v => v === val).length > 1;

      if (isDup) {
        el.classList.add('input-error');
        if (errEl) errEl.style.display = 'flex';
      } else {
        el.classList.remove('input-error');
        if (errEl) errEl.style.display = 'none';
      }
    });
  }

  function buildTabs(count) {
    tabsEl.innerHTML   = '';
    panelsEl.innerHTML = '';

    for (let i = 1; i <= count; i++) {
      const label = i === 1 ? 'Member 1 (Leader)' : `Member ${i}`;

      // Tab button
      const tab = document.createElement('button');
      tab.type      = 'button';
      tab.className = 'member-tab' + (i === 1 ? ' active' : '');
      tab.textContent = label;
      tab.dataset.index = i;
      tab.addEventListener('click', () => {
        tabsEl.querySelectorAll('.member-tab').forEach(t => t.classList.remove('active'));
        panelsEl.querySelectorAll('.member-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`panel-m${i}`).classList.add('active');
      });
      tabsEl.appendChild(tab);

      // Panel
      const panel = document.createElement('div');
      panel.className = 'member-panel' + (i === 1 ? ' active' : '');
      panel.id = `panel-m${i}`;
      panel.innerHTML = `
        <div class="panel-title"><i class="fa-solid fa-user"></i> ${label}</div>
        <div class="form-row">
          <div class="form-group">
            <label>Full Name <span class="req">*</span></label>
            <input type="text" name="m${i}_name" placeholder="Full name" />
          </div>
          <div class="form-group">
            <label>Gender <span class="req">*</span></label>
            <select name="m${i}_gender">
              <option value="default" disabled selected>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>College / Institution <span class="req">*</span></label>
            <input type="text" name="m${i}_college" placeholder="e.g. ISM Dhanbad" />
          </div>
          <div class="form-group">
            <label>Mobile Number <span class="req">*</span></label>
            <input type="tel" name="m${i}_mobile" placeholder="10-digit number" maxlength="10" />
            <div class="error-msg dup-error" style="display:none;"><i class="fa-solid fa-triangle-exclamation"></i> Mobile number already used by another member.</div>
          </div>
        </div>
        <div class="form-group">
          <label>Email Address <span class="req">*</span></label>
          <input type="email" name="m${i}_email" placeholder="member@example.com" />
          <div class="error-msg dup-error" style="display:none;"><i class="fa-solid fa-triangle-exclamation"></i> Email already used by another member.</div>
        </div>
      `;
      panelsEl.appendChild(panel);

      // Attach duplicate check on blur
      panel.querySelectorAll('input[name$="_mobile"], input[name$="_email"]').forEach(inp => {
        inp.addEventListener('blur', () => checkDuplicates(inp));
        inp.addEventListener('input', () => checkDuplicates(inp));
      });
    }

    section.style.display = 'block';

    // Auto-fill Member 1 name from Team Leader Name
    const leaderInput = document.getElementById('leaderName');
    const m1NameInput = panelsEl.querySelector('input[name="m1_name"]');
    if (leaderInput && m1NameInput) {
      m1NameInput.value = leaderInput.value.trim();
      m1NameInput.setAttribute('placeholder', 'Auto-filled from Team Leader Name');
      // Keep in sync as leader name changes
      leaderInput._m1Sync = () => { m1NameInput.value = leaderInput.value.trim(); };
      leaderInput.removeEventListener('input', leaderInput._m1Sync); // avoid duplicates
      leaderInput.addEventListener('input', leaderInput._m1Sync);
    }
  }

  // Expose duplicate checker for submit validation
  window._checkAllMemberDuplicates = function() {
    const mobileInputs = panelsEl.querySelectorAll('input[name$="_mobile"]');
    const emailInputs  = panelsEl.querySelectorAll('input[name$="_email"]');
    if (mobileInputs.length) checkDuplicates(mobileInputs[0]);
    if (emailInputs.length)  checkDuplicates(emailInputs[0]);
    return panelsEl.querySelectorAll('.dup-error[style*="flex"]').length === 0;
  };

  membersSelect.addEventListener('change', () => {
    const val = parseInt(membersSelect.value);
    if (!isNaN(val)) buildTabs(val);
  });

  // Default: build 1 member tab on load
  buildTabs(1);
})();

/* ── File Upload ────────────────────────────────────────────── */
(function initFileUpload() {
  const wrap      = document.getElementById('fileUploadWrap');
  const input     = document.getElementById('ideaFile');
  const chosen    = document.getElementById('fileChosen');
  const chosenName = document.getElementById('fileChosenName');
  const removeBtn = document.getElementById('fileRemove');
  const errEl     = document.getElementById('fileError');
  if (!wrap || !input) return;

  const ALLOWED = ['pdf','ppt','pptx','doc','docx'];
  const MAX_MB  = 10;

  function setFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    const sizeMB = file.size / (1024 * 1024);
    if (!ALLOWED.includes(ext) || sizeMB > MAX_MB) {
      errEl.style.display = 'flex';
      input.value = '';
      return;
    }
    errEl.style.display = 'none';
    wrap.querySelector('.file-upload-ui').style.display = 'none';
    chosenName.textContent = file.name;
    chosen.style.display = 'flex';
  }

  function clearFile() {
    input.value = '';
    chosen.style.display = 'none';
    wrap.querySelector('.file-upload-ui').style.display = 'flex';
    errEl.style.display = 'none';
  }

  input.addEventListener('change', () => { if (input.files[0]) setFile(input.files[0]); });
  removeBtn.addEventListener('click', (e) => { e.stopPropagation(); clearFile(); });

  // Drag & drop
  wrap.addEventListener('dragover',  (e) => { e.preventDefault(); wrap.classList.add('drag-over'); });
  wrap.addEventListener('dragleave', ()  => wrap.classList.remove('drag-over'));
  wrap.addEventListener('drop', (e) => {
    e.preventDefault();
    wrap.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) { setFile(file); }
  });

  // Expose for submit validation
  window._validateFileUpload = function() {
    if (!input.files[0]) { errEl.style.display = 'flex'; return false; }
    return true;
  };
})();

/* ── Registration Form Validation ──────────────────────────── */
const regForm = document.getElementById('regForm');
if (regForm) {
  // Real-time validation on blur
  regForm.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (group.classList.contains('has-error')) validateField(field);
    });
  });

  regForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const fields = [
      { id: 'teamName',   type: 'text',   msg: 'Team name is required.' },
      { id: 'leaderName', type: 'text',   msg: 'Leader name is required.' },
      { id: 'members',    type: 'select', msg: 'Please select number of members.' },
      { id: 'theme',      type: 'select', msg: 'Please select a theme.' },
    ];

    let valid = true;
    let firstError = null;

    fields.forEach(f => {
      const el    = document.getElementById(f.id);
      const group = el.closest('.form-group');
      const ok    = validateField(el);
      if (!ok) { valid = false; if (!firstError) firstError = el; }
    });

    if (!valid) {
      firstError.focus();
      firstError.closest('.form-group').querySelector('input, select').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Check terms checkbox
    const agree = document.getElementById('agree');
    if (agree && !agree.checked) {
      alert('Please agree to the Rules & Guidelines to proceed.');
      return;
    }

    // Check member duplicate mobile/email
    if (typeof window._checkAllMemberDuplicates === 'function') {
      if (!window._checkAllMemberDuplicates()) {
        alert('Two or more members share the same mobile number or email. Please fix before submitting.');
        return;
      }
    }

    // Check file upload
    if (typeof window._validateFileUpload === 'function') {
      if (!window._validateFileUpload()) {
        document.getElementById('ideaFile').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    regForm.style.display = 'none';
    const successEl = document.getElementById('successMsg');
    if (successEl) {
      successEl.style.display = 'block';
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

function validateField(el) {
  const group = el.closest('.form-group');
  if (!group) return true;

  const val = el.value.trim();
  let ok = true;

  if (el.tagName === 'SELECT') {
    ok = val !== '' && val !== 'default';
  } else if (el.type === 'email') {
    ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  } else if (el.id === 'phone') {
    ok = /^[6-9]\d{9}$/.test(val);
  } else {
    ok = val.length > 0;
  }

  group.classList.toggle('has-error', !ok);
  return ok;
}

/* ── Support / Query Form ───────────────────────────────────── */
const queryForm = document.getElementById('queryForm');
if (queryForm) {
  queryForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name  = document.getElementById('qName').value.trim();
    const email = document.getElementById('qEmail').value.trim();
    const msg   = document.getElementById('qMsg').value.trim();

    if (!name || !email || !msg) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    queryForm.reset();
    const thanks = document.getElementById('querySuccess');
    if (thanks) {
      thanks.style.display = 'block';
      thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

/* ── PDF Download ───────────────────────────────────────────── */
function triggerPdfDownload() {
  const link = document.createElement('a');
  link.href = 'rules.pdf';
  link.download = 'Miningthon_2026_Rules.pdf';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.querySelectorAll('#downloadPdf, #downloadPdf2, .pdf-trigger').forEach(btn => {
  btn.addEventListener('click', triggerPdfDownload);
});

/* ── Smooth Scroll for anchor links ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* ── Hero particles (disabled — white hero) ─────────────────── */
function initParticles() { /* no-op */ }

initParticles();

/* ── Timeline v2 — scroll animations + sparks ───────────────── */
(function initTimeline() {
  const section   = document.querySelector('.tl2-section');
  const steps     = document.querySelectorAll('.tl2-step');
  const fillEl    = document.getElementById('tlProgressFill');
  const DONE_IDX  = 1; // steps 0 & 1 are "done/active" (40% progress)

  if (!section || !steps.length) return;

  /* Reveal steps with stagger when section enters viewport */
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Animate progress bar
      if (fillEl) {
        setTimeout(() => { fillEl.style.width = '40%'; }, 300);
      }

      // Stagger-reveal each step
      steps.forEach((step, i) => {
        setTimeout(() => {
          step.classList.add('tl2-visible');
        }, 150 + i * 160);
      });

      sectionObs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  sectionObs.observe(section);

  /* Spark particles on the active step */
  const activeStep = document.querySelector('.tl2-active');
  const sparksEl   = document.getElementById('tlSparks');

  function spawnSpark() {
    if (!sparksEl) return;
    const spark = document.createElement('div');
    spark.className = 'tl2-spark';
    const angle = Math.random() * 360;
    const dist  = 28 + Math.random() * 24;
    const tx    = Math.cos(angle * Math.PI / 180) * dist;
    const ty    = Math.sin(angle * Math.PI / 180) * dist;
    const dur   = 0.7 + Math.random() * 0.5;
    spark.style.setProperty('--tx', tx + 'px');
    spark.style.setProperty('--ty', ty + 'px');
    spark.style.setProperty('--dur', dur + 's');
    sparksEl.appendChild(spark);
    setTimeout(() => spark.remove(), dur * 1000);
  }

  // Spawn sparks periodically
  setInterval(spawnSpark, 420);
  setInterval(spawnSpark, 700);
  setInterval(spawnSpark, 1100);
})();
