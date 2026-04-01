/* ══════════════════════════════════════════════
   XINDIES AMAZING HANDS LLC — MAIN JS
   ══════════════════════════════════════════════ */

/* ── STRIPE PAYMENT LINKS ───────────────────────────── */
const STRIPE_LINKS = {
  /* CATERING */
  'Catering – Small (10–30 guests)': {
    deposit: 'https://book.stripe.com/5kQ8wR2KC1utbPEaZu2Fa06',
    full:    'https://book.stripe.com/5kQeVf5WOfljbPEaZu2Fa0b'
  },
  'Catering – Medium (30–75 guests)': {
    deposit: 'https://book.stripe.com/14A5kFclc7SRg5U6Je2Fa07',
    full:    'https://book.stripe.com/eVqcN7gBs4GF3j82sY2Fa0a'
  },
  'Catering – Large (75–200+ guests)': {
    deposit: 'https://book.stripe.com/8x24gB2KCflj4nc4B62Fa08',
    full:    'https://book.stripe.com/bJe4gBgBsc97aLAffK2Fa09'
  },

  /* BOX BRAIDS */
  'Box Braids – Small ($200)': {
    deposit: 'https://book.stripe.com/aFabJ384W7SRg5U1oU2Fa05',
    full:    'https://buy.stripe.com/eVq6oJ5WO6ON06WebG2Fa03'
  },
  'Box Braids – Medium ($175)': {
    deposit: 'https://book.stripe.com/eVq7sNfxogpn9HwebG2Fa04',
    full:    'https://buy.stripe.com/5kQ28t0Cu2yxf1Qc3y2Fa02'
  },
  'Box Braids – Large ($165)': {
    deposit: 'https://book.stripe.com/bJefZj0Cu3CBbPE8Rm2Fa00',
    full:    'https://buy.stripe.com/7sYcN7etk0qp3j8aZu2Fa01'
  },

  /* OTHER HAIR */
  'Crochet Styles ($135)': {
    deposit: null,
    full:    'https://book.stripe.com/8x25kFclc6ONaLA4B62Fa0q'
  },
  'Braid Straight Back / Wig Install ($45)': {
    deposit: null,
    full:    'https://book.stripe.com/14A8wR84W2yx9HwebG2Fa0r'
  },
  'Sew-In with Leave Out ($175)': {
    deposit: 'https://book.stripe.com/14A7sN3OG1ut3j89Vq2Fa0c',
    full:    'https://book.stripe.com/8x2eVf84W5KJdXM5Fa2Fa0d'
  },

  /* NATURAL HAIR */
  'Natural Hair Braiding': {
    deposit: null,
    full:    'https://book.stripe.com/14A8wR84W2yx9HwebG2Fa0r'
  },

  /* EVENT PLANNING */
  'Event Planning – Small (10–30 guests, $250)': {
    deposit: 'https://book.stripe.com/eVqcN7gBs4GFf1Q1oU2Fa0j',
    full:    'https://book.stripe.com/aFa5kF5WO0qp9Hw5Fa2Fa0e'
  },
  'Event Planning – Medium (30–75 guests, $600)': {
    deposit: 'https://book.stripe.com/7sYcN79906ON6vk7Ni2Fa0i',
    full:    'https://book.stripe.com/9B600l70S8WV2f46Je2Fa0f'
  },
  'Event Planning – Large (75–150+ guests, $1,200)': {
    deposit: 'https://book.stripe.com/eVqdRb1Gya0Z06W0kQ2Fa0h',
    full:    'https://book.stripe.com/6oUbJ3bh86ONaLA2sY2Fa0g'
  },

  /* WEDDING */
  'Wedding – Day-Of Coordination ($800)': {
    deposit: 'https://book.stripe.com/cNi8wR2KC5KJdXM3x22Fa0k',
    full:    'https://book.stripe.com/14A3cx0Cu8WVf1QgjO2Fa0n'
  },
  'Wedding – Partial Planning ($1,500)': {
    deposit: 'https://book.stripe.com/00wfZj70S3CB4nc1oU2Fa0l',
    full:    'https://book.stripe.com/14AeVf0Cu5KJg5UaZu2Fa0m'
  },
  'Wedding – Full Service ($3,000)': {
    deposit: 'https://book.stripe.com/14AeVf0Cu5KJg5UaZu2Fa0m',
    full:    'https://book.stripe.com/bJe4gB3OG3CB1b07Ni2Fa0p'
  },

  /* PRIVATE SITTING */
  'Private Sitting – Childcare': {
    deposit: null,
    full:    'https://book.stripe.com/3cI9AV5WO3CBg5Uc3y2Fa0t'
  },
  'Private Sitting – Elderly': {
    deposit: null,
    full:    'https://book.stripe.com/aFacN74SKddb06W7Ni2Fa0s'
  },

  /* HOME ORGANIZING */
  'Home Organizing': {
    deposit: null,
    full:    'https://book.stripe.com/8x26oJ5WO0qpcTI5Fa2Fa0u'
  }
};

/* ── SELECTED PAYMENT TYPE ───────────────────────────── */
let selectedPaymentType = 'deposit'; // default

function pickPaymentType(el) {
  document.querySelectorAll('.pay-type-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  selectedPaymentType = el.dataset.val;
}

/* ── GET ACTIVE SUB-SELECTION KEY ───────────────────────────── */
function getActiveKey() {
  const svc = document.getElementById('serviceSelect')?.value;
  const subCatering = document.getElementById('subCatering')?.value;
  const subHair     = document.getElementById('subHair')?.value;
  const subEvent    = document.getElementById('subEvent')?.value;
  const subWedding  = document.getElementById('subWedding')?.value;

  // Return the most specific sub-selection available
  if (svc === 'Catering' && subCatering) return subCatering;
  if (svc === 'Hair' && subHair) return subHair;
  if (svc === 'Event Planning' && subEvent) return subEvent;
  if (svc === 'Wedding Coordination' && subWedding) return subWedding;
  if (svc === 'Private Sitting') return 'Private Sitting – Childcare'; // default, updated by sub if added
  if (svc === 'Home Organizing') return 'Home Organizing';
  return null;
}

/* ── STRIPE REDIRECT ───────────────────────────── */
function redirectStripe(paymentType) {
  const type = paymentType || selectedPaymentType;
  const key  = getActiveKey();

  if (!key || !STRIPE_LINKS[key]) {
    alert('Please select a service before paying.');
    return;
  }

  const entry = STRIPE_LINKS[key];

  // If no deposit option exists for this service, always go full
  const link = (type === 'deposit' && entry.deposit) ? entry.deposit : entry.full;

  if (link) {
    window.location.href = link; // same tab — feels like a natural next step
  } else {
    alert('Payment link not available. Please contact us directly.');
  }
}

/* ── DEPOSIT CHECK ───────────────────────────── */
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
  const row         = document.getElementById('deposit-row');
  const payChoice   = document.getElementById('payment-choice');
  const hasDeposit  = requiresDeposit();

  if (row)       row.style.display       = hasDeposit ? 'flex' : 'none';
  if (payChoice) payChoice.style.display = hasDeposit ? 'block' : 'none';
}

/* ── SERVICE SELECTION ───────────────────────────── */
function handleServiceChange(val) {
  document.querySelectorAll('.sub-picker').forEach(el => el.classList.remove('visible'));
  const map = {
    'Catering':              'sub-catering',
    'Hair':                  'sub-hair',
    'Event Planning':        'sub-event',
    'Wedding Coordination':  'sub-wedding'
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

/* ── FORM HANDLERS ───────────────────────────── */
async function handleBooking(e) {
  e.preventDefault();
  const form = document.getElementById('bookingForm');
  const data = new FormData(form);

  // Silently send to Google Forms — customer never sees Google
  try {
    await fetch(form.action, { method: 'POST', body: data, mode: 'no-cors' });
  } catch (_) {
    // no-cors fetch always "fails" — that's expected, data still goes through
  }

  // Show branded confirmation
  const card = form.closest('.booking-form-card');
  card.innerHTML = `
    <div style="text-align:center; padding:3rem 1.5rem;">
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style="margin-bottom:1.2rem;">
        <circle cx="26" cy="26" r="25" stroke="#a35468" stroke-width="1.5" fill="none"/>
        <path d="M16 26l7 7 13-13" stroke="#a35468" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <h3 style="font-family:'Bodoni Moda',Georgia,serif; font-size:1.6rem; margin-bottom:0.75rem; color:#1e1a1c;">Request Received</h3>
      <p style="font-family:'Jost',sans-serif; font-weight:300; color:#7a6e72; line-height:1.8; font-size:0.9rem; max-width:340px; margin:0 auto 2rem;">
        Thank you! We'll confirm availability within 24 hours.<br/>
        If a deposit is required, complete it below to secure your date.
      </p>
      ${requiresDeposit() ? `
        <p style="font-family:'Jost',sans-serif; font-size:0.75rem; letter-spacing:0.12em; text-transform:uppercase; color:#a35468; margin-bottom:1rem;">Complete Your Booking</p>
        <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
          <button onclick="redirectStripe('deposit')" style="background:#a35468; color:#fff; border:none; padding:0.85rem 1.6rem; font-family:'Jost',sans-serif; font-size:0.82rem; letter-spacing:0.1em; text-transform:uppercase; cursor:pointer; border-radius:2px;">
            Pay Deposit (40%)
          </button>
          <button onclick="redirectStripe('full')" style="background:transparent; color:#a35468; border:1.5px solid #a35468; padding:0.85rem 1.6rem; font-family:'Jost',sans-serif; font-size:0.82rem; letter-spacing:0.1em; text-transform:uppercase; cursor:pointer; border-radius:2px;">
            Pay in Full
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

function handleInquiry(e) { /* submits normally to Google Forms */ }

/* ══════════════════════════════════════════════
   DOM READY
   ══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  /* ── LEGAL MODAL ───────────────────────────── */
  const overlay = document.getElementById('legalOverlay');

  function openModal(panelId) {
    if (!overlay) return;
    document.querySelectorAll('.lm-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.target === panelId)
    );
    document.querySelectorAll('.lm-panel').forEach(p =>
      p.style.display = (p.id === 'panel-' + panelId) ? 'block' : 'none'
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
    overlay.querySelectorAll('.lm-tab, [data-target]').forEach(tab => {
      tab.addEventListener('click', () => openModal(tab.dataset.target));
    });
    const closeBtn = overlay.querySelector('.lm-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }

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
