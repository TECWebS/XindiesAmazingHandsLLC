/* ══════════════════════════════════════════════
   XINDIES AMAZING HANDS LLC — CLEAN JS
   ══════════════════════════════════════════════ */

const STRIPE_PAYMENT_LINK = 'https://book.stripe.com/bJefZj0Cu3CBbPE8Rm2Fa00';

/* ── LEGAL MODAL ───────────────────────────── */
(function initLegalModal() {
  const overlay = document.getElementById('legalOverlay');
  if (!overlay) return;

  const tabs = document.querySelectorAll('.lm-tab');
  const panels = document.querySelectorAll('.lm-panel');
  const closeBtn = document.querySelector('.lm-close');

  function openModal(panelId) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.target === panelId));
    panels.forEach(p => p.classList.toggle('active', p.id === 'panel-' + panelId));
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  tabs.forEach(tab => tab.addEventListener('click', () => openModal(tab.dataset.target)));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('[data-legal]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      openModal(link.dataset.legal);
    });
  });
})();

/* ── DATE SPLIT ───────────────────────────── */
function splitDate(val) {
  if (!val) return;
  const p = val.split('-');
  document.getElementById('dateYear').value = p[0];
  document.getElementById('dateMonth').value = p[1].replace(/^0/, '');
  document.getElementById('dateDay').value = p[2].replace(/^0/, '');
}

/* ── DEPOSIT LOGIC ───────────────────────── */
const DEPOSIT_SERVICES = {
  'Catering': true,
  'Event Planning': true,
  'Wedding Coordination': true
};

const HAIR_DEPOSIT_STYLES = [
  'Box Braids – Small ($200)',
  'Box Braids – Medium ($175)',
  'Box Braids – Large ($165)',
  'Sew-In with Leave Out ($175)'
];

function requiresDeposit() {
  const svc = document.getElementById('serviceSelect')?.value;
  if (DEPOSIT_SERVICES[svc]) return true;
  if (svc === 'Hair') {
    return HAIR_DEPOSIT_STYLES.includes(document.getElementById('subHair')?.value);
  }
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

  if (map[val]) document.getElementById(map[val])?.classList.add('visible');

  updateDepositUI();
}

function selectService(el, name) {
  document.querySelectorAll('.bsl-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');

  const sel = document.getElementById('serviceSelect');
  if (sel) {
    sel.value = name;
    handleServiceChange(name);
  }
}

function pickSub(el, hiddenId) {
  el.closest('.sub-options')
    .querySelectorAll('.sub-opt')
    .forEach(s => s.classList.remove('active'));

  el.classList.add('active');
  document.getElementById(hiddenId).value = el.dataset.val;

  updateDepositUI();
}

/* ── STRIPE ───────────────────────────── */
function redirectStripe() {
  if (STRIPE_PAYMENT_LINK.includes('https://book.stripe.com/bJefZj0Cu3CBbPE8Rm2Fa00')) {
    alert('Stripe not set up yet.');
    return;
  }
  window.open(STRIPE_PAYMENT_LINK, '_blank');
}

/* ── FORM HANDLERS ───────────────────── */
function handleBooking(e) {
  const form = e.target;

  if (form.action.includes('https://docs.google.com/forms/u/0/d/e/1FAIpQLScw5AwWl5g3TEOvk_szqdT9gLwa5iM4xew7yk4OJrU_HJ1sFw/formResponse')) {
    e.preventDefault();
    alert('Booking form not connected yet.');
    return;
  }

  if (requiresDeposit()) {
    setTimeout(redirectStripe, 500);
  }
}

function handleInquiry(e) {
  const form = e.target;

  if (form.action.includes('https://docs.google.com/forms/u/0/d/e/1FAIpQLScw5AwWl5g3TEOvk_szqdT9gLwa5iM4xew7yk4OJrU_HJ1sFw/formResponse')) {
    e.preventDefault();
    alert('Inquiry form not connected yet.');
  }
}

/* ── GALLERY SCROLL ───────────────────── */
(function () {
  const lane = document.querySelector('.gallery-lane');
  if (!lane) return;

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
})();

/* ── NAV SCROLL ───────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('mainNav')?.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── REVEAL ANIMATION ───────────────── */
(function () {
  const els = document.querySelectorAll('.reveal-up, .reveal-left');
  if (!('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('visible'));
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  });

  els.forEach(el => obs.observe(el));
})();

/* ── PRICE PANELS ───────────────────── */
(function () {
  document.querySelectorAll('.svc-price-hint').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();

      const panel = this.nextElementSibling;
      const isOpen = panel.classList.contains('visible');

      document.querySelectorAll('.svc-price-panel.visible').forEach(p => {
        p.classList.remove('visible');
        p.previousElementSibling.textContent = 'View Pricing';
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
      p.previousElementSibling.textContent = 'View Pricing';
    });
  });
})();

/* ── INIT ───────────────────────────── */
handleServiceChange('Catering');
