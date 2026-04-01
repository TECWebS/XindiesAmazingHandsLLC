/* ══════════════════════════════════════════════
   XINDIES AMAZING HANDS LLC — CLEAN JS (FIXED)
   ══════════════════════════════════════════════ */

const STRIPE_PAYMENT_LINK = 'https://book.stripe.com/bJefZj0Cu3CBbPE8Rm2Fa00';

document.addEventListener('DOMContentLoaded', function () {

  /* ── LEGAL MODAL ───────────────────────────── */
  const overlay = document.getElementById('legalOverlay');

  function openModal(panelId) {
    if (!overlay) return;
    document.querySelectorAll('.lm-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.target === panelId)
    );
    document.querySelectorAll('.lm-panel').forEach(p =>
      p.classList.toggle('active', p.id === 'panel-' + panelId)
    );
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!overlay) return;
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (overlay) {
    /* Tab switching inside modal */
    overlay.querySelectorAll('.lm-tab, [data-target]').forEach(tab => {
      tab.addEventListener('click', () => openModal(tab.dataset.target));
    });

    /* Close button */
    const closeBtn = overlay.querySelector('.lm-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    /* Click outside modal box */
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });

    /* Escape key */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* Footer / any [data-legal] trigger links */
  document.querySelectorAll('[data-legal]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      openModal(link.dataset.legal);
    });
  });

  /* ── REVEAL ANIMATION ───────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left');

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(el => obs.observe(el));
  } else {
    /* Fallback for old browsers */
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── NAV SCROLL ───────────────────────── */
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ── GALLERY SCROLL ───────────────────── */
  const lane = document.querySelector('.gallery-lane');
  if (lane) {
    let pos = 0;
    let paused = false;

    lane.addEventListener('mouseenter', () => paused = true);
    lane.addEventListener('mouseleave', () => paused = false);

    function tick() {
      if (!paused) {
        pos += 0.5;
        if (pos >= lane.scrollWidth / 2) pos = 0;
        lane.style.transform = `translateX(-${pos}px)`;
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ── PRICE PANELS ───────────────────── */
  document.querySelectorAll('.svc-price-hint').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const panel = this.nextElementSibling;
      const isOpen = panel.classList.contains('visible');

      document.querySelectorAll('.svc-price-panel.visible').forEach(p => {
        p.classList.remove('visible');
        if (p.previousElementSibling) p.previousElementSibling.textContent = 'View Pricing';
      });

      if (!isOpen) {
        panel.classList.add('visible');
        this.textContent = 'Hide Pricing';
      }
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.svc-price-panel.visible').forEach(p => {
      p.classList.remove('visible');
      if (p.previousElementSibling) p.previousElementSibling.textContent = 'View Pricing';
    });
  });

  /* ── INIT DEFAULT SERVICE ───────────────────────── */
  handleServiceChange('Catering');

}); /* end DOMContentLoaded */

/* ── DATE SPLIT ───────────────────────────── */
function splitDate(val) {
  if (!val) return;
  const p = val.split('-');
  const y = document.getElementById('dateYear');
  const m = document.getElementById('dateMonth');
  const d = document.getElementById('dateDay');
  if (y) y.value = p[0];
  if (m) m.value = p[1].replace(/^0/, '');
  if (d) d.value = p[2].replace(/^0/, '');
}

/* ── DEPOSIT LOGIC ───────────────────── */
const DEPOSIT_SERVICES = { 'Catering': true, 'Event Planning': true, 'Wedding Coordination': true };
const HAIR_DEPOSIT_STYLES = [
  'Box Braids – Small ($200)',
  'Box Braids – Medium ($175)',
  'Box Braids – Large ($165)',
  'Sew-In with Leave Out ($175)'
];

function requiresDeposit() {
  const svc = document.getElementById('serviceSelect')?.value;
  if (DEPOSIT_SERVICES[svc]) return true;
  if (svc === 'Hair') return HAIR_DEPOSIT_STYLES.includes(document.getElementById('subHair')?.value);
  return false;
}

function updateDepositUI() {
  const row = document.getElementById('deposit-row');
  if (row) row.style.display = requiresDeposit() ? 'flex' : 'none';
}

/* ── SERVICE SELECTION ───────────────────── */
function handleServiceChange(val) {
  document.querySelectorAll('.sub-picker').forEach(el => el.classList.remove('visible'));
  const map = {
    'Catering': 'sub-catering',
    'Hair': 'sub-hair',
    'Event Planning': 'sub-event',
    'Wedding Coordination': 'sub-wedding'
  };
  if (map[val]) {
    const el = document.getElementById(map[val]);
    if (el) el.classList.add('visible');
  }
  updateDepositUI();
}

function selectService(el, name) {
  document.querySelectorAll('.bsl-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  const sel = document.getElementById('serviceSelect');
  if (sel) { sel.value = name; handleServiceChange(name); }
}

function pickSub(el, hiddenId) {
  el.closest('.sub-options').querySelectorAll('.sub-opt').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  const hidden = document.getElementById(hiddenId);
  if (hidden) hidden.value = el.dataset.val;
  updateDepositUI();
}

/* ── STRIPE ───────────────────────────── */
function redirectStripe() {
  window.open(STRIPE_PAYMENT_LINK, '_blank');
}

/* ── FORM HANDLERS ───────────────────── */
function handleBooking(e) {
  if (requiresDeposit()) setTimeout(redirectStripe, 500);
}

function handleInquiry(e) { /* form submits normally to Google Forms */ }
