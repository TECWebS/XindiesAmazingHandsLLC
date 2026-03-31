/* ══════════════════════════════════════════════
   XINDIES AMAZING HANDS LLC — Global JavaScript
   ══════════════════════════════════════════════

   SETUP CHECKLIST:
   1. Replace STRIPE_PAYMENT_LINK below with your real
      Stripe Payment Link URL (from your Stripe dashboard
      → Payment Links → Create a link).
   2. Replace GOOGLE_FORM_ACTION_URL in each HTML file's
      <form action="..."> with your Google Form POST URL.
   ══════════════════════════════════════════════ */

/* ─────────────────────────────────
   STRIPE PAYMENT LINK
   Go to: https://dashboard.stripe.com/payment-links
   Create a link, copy the URL, paste it below.
   ───────────────────────────────── */
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/YOUR_PAYMENT_LINK_HERE';

/* ─────────────────────────────────
   NAV SCROLL EFFECT
   ───────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
})();

/* ─────────────────────────────────
   SCROLL REVEAL
   ───────────────────────────────── */
<script>
// ── LEGAL MODAL ───────────────────────────────────────────────
(function(){
  var overlay = document.getElementById('legalOverlay');
  function openModal(target) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.querySelectorAll('.lm-tab').forEach(function(t){
      var on = t.dataset.target === target;
      t.style.background = on ? '#a35468' : 'transparent';
      t.style.color = on ? '#fff' : '#a35468';
    });
    document.getElementById('panel-privacy').style.display = target === 'privacy' ? 'block' : 'none';
    document.getElementById('panel-terms').style.display   = target === 'terms'   ? 'block' : 'none';
  }
  function closeModal() { overlay.style.display = 'none'; document.body.style.overflow = ''; }
  document.querySelectorAll('[data-legal]').forEach(function(a){
    a.addEventListener('click', function(e){ e.preventDefault(); openModal(a.dataset.legal); });
  });
  document.querySelectorAll('.lm-tab').forEach(function(t){
    t.addEventListener('click', function(){ openModal(t.dataset.target); });
  });
  document.querySelector('.lm-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e){ if(e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });
})();

// ── DATE SPLIT ────────────────────────────────────────────────
function splitDate(val) {
  if (!val) return;
  var p = val.split('-');
  document.getElementById('dateYear').value  = p[0];
  document.getElementById('dateMonth').value = p[1].replace(/^0/,'');
  document.getElementById('dateDay').value   = p[2].replace(/^0/,'');
}

// ── DEPOSIT LOGIC ─────────────────────────────────────────────
var DEPOSIT_SERVICES = { 'Catering': true, 'Event Planning': true, 'Wedding Coordination': true };
var HAIR_DEPOSIT_STYLES = ['Box Braids – Small ($200)','Box Braids – Medium ($175)','Box Braids – Large ($165)','Sew-In with Leave Out ($175)'];

function requiresDeposit() {
  var svc = document.getElementById('serviceSelect').value;
  if (DEPOSIT_SERVICES[svc]) return true;
  if (svc === 'Hair') return HAIR_DEPOSIT_STYLES.indexOf(document.getElementById('subHair').value) !== -1;
  return false;
}

function updateDepositUI() {
  document.getElementById('deposit-row').style.display = requiresDeposit() ? 'flex' : 'none';
}

// ── SERVICE CHANGE ────────────────────────────────────────────
function handleServiceChange(val) {
  ['sub-catering','sub-hair','sub-event','sub-wedding'].forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.classList.remove('visible');
  });
  var map = { 'Catering':'sub-catering','Hair':'sub-hair','Event Planning':'sub-event','Wedding Coordination':'sub-wedding' };
  if (map[val]) document.getElementById(map[val]).classList.add('visible');
  updateDepositUI();
}

function selectService(el, name) {
  document.querySelectorAll('.bsl-item').forEach(function(i){ i.classList.remove('active'); });
  el.classList.add('active');
  var sel = document.getElementById('serviceSelect');
  sel.value = name;
  handleServiceChange(name);
}

function pickSub(el, hiddenId) {
  el.closest('.sub-options').querySelectorAll('.sub-opt').forEach(function(o){ o.classList.remove('active'); });
  el.classList.add('active');
  document.getElementById(hiddenId).value = el.dataset.val;
  if (hiddenId === 'subHair') updateDepositUI();
}

// ── STRIPE ────────────────────────────────────────────────────
var DEPOSIT_AMOUNTS = {
  'Catering – Small (10–30 guests)': 28000,
  'Catering – Medium (30–75 guests)': 95000,
  'Catering – Large (75–200+ guests)': 120000,
  'Box Braids – Small ($200)': 8000,
  'Box Braids – Medium ($175)': 7000,
  'Box Braids – Large ($165)': 6600,
  'Sew-In with Leave Out ($175)': 7000,
  'Event Planning – Small (10–30 guests, $250)': 10000,
  'Event Planning – Medium (30–75 guests, $600)': 24000,
  'Event Planning – Large (75–150+ guests, $1,200)': 48000,
  'Wedding – Day-Of Coordination ($800)': 32000,
  'Wedding – Partial Planning ($1,500)': 60000,
  'Wedding – Full Service ($3,000)': 120000
};

function getDepositAmount() {
  var svc = document.getElementById('serviceSelect').value;
  if (svc === 'Hair') return DEPOSIT_AMOUNTS[document.getElementById('subHair').value] || null;
  if (svc === 'Catering') return DEPOSIT_AMOUNTS[document.getElementById('subCatering').value] || null;
  if (svc === 'Event Planning') return DEPOSIT_AMOUNTS[document.getElementById('subEvent').value] || null;
  if (svc === 'Wedding Coordination') return DEPOSIT_AMOUNTS[document.getElementById('subWedding').value] || null;
  return null;
}

function redirectStripe() {
  var amt = getDepositAmount();
  if (!amt) { alert('Please select a service tier first so we can calculate your deposit.'); return; }
  var svc = document.getElementById('serviceSelect').value;
  Stripe('pk_live_51TH5dbQSNbOl19IkHcXzpHoNjyKDhuofjDr9gPBUg79E2cSDXNGMAgXitL05Og8KuoMEEEsyIQFFJAhgFbDPOIpk00OqQVtUsS').redirectToCheckout({
    lineItems: [{ price_data: { currency: 'usd', product_data: { name: '40% Deposit — ' + svc + ' (Xindies Amazing Hands LLC)' }, unit_amount: amt }, quantity: 1 }],
    mode: 'payment',
    successUrl: window.location.origin + '/index.html?booked=1',
    cancelUrl: window.location.href
  }).then(function(r){ if(r.error) alert('Payment error: ' + r.error.message); });
}

// ── FORM SUBMIT ───────────────────────────────────────────────
function handleBooking(e) {
  e.preventDefault();
  var form = e.target;
  fetch(form.action, { method: 'POST', body: new FormData(form), mode: 'no-cors' });
  if (requiresDeposit()) {
    setTimeout(redirectStripe, 600);
  } else {
    form.innerHTML = '<div style="text-align:center;padding:2rem 0;"><svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="#8aab96" stroke-width="2"/><path d="M14 24l8 8 12-14" stroke="#8aab96" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg><h3 style="font-family:\'Bodoni Moda\',Georgia,serif;margin:1rem 0 0.5rem;">Request Received!</h3><p style="font-size:0.85rem;color:#7a6e72;line-height:1.7;">We\'ll confirm availability within 24 hours. Full payment is due at time of service.</p></div>';
  }
}

// ── GALLERY SCROLL ────────────────────────────────────────────
(function(){
  var lane = document.querySelector('.gallery-lane');
  if (!lane) return;
  var speed = 0.5, pos = 0, paused = false;
  lane.addEventListener('mouseenter', function(){ paused = true; });
  lane.addEventListener('mouseleave', function(){ paused = false; });
  function tick() {
    if (!paused) { pos += speed; if (pos >= lane.scrollWidth / 2) pos = 0; lane.style.transform = 'translateX(-' + pos + 'px)'; }
    requestAnimationFrame(tick);
  }
  tick();
})();

// ── PRICE TOGGLE ─────────────────────────────────────────────
document.querySelectorAll('.svc-price-hint').forEach(function(btn){
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    var panel = btn.nextElementSibling;
    var open = panel.classList.toggle('open');
    btn.textContent = open ? 'Hide Pricing' : 'View Pricing';
  });
});

// ── NAV SCROLL ────────────────────────────────────────────────
window.addEventListener('scroll', function(){
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 60);
});

// ── REVEAL ────────────────────────────────────────────────────
(function(){
  var els = document.querySelectorAll('.reveal-up,.reveal-left');
  if (!('IntersectionObserver' in window)) { els.forEach(function(e){ e.classList.add('visible'); }); return; }
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting) en.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  els.forEach(function(e){ obs.observe(e); });
})();

// ── CURSOR ────────────────────────────────────────────────────
(function(){
  var c = document.getElementById('cursor'), r = document.getElementById('cursor-ring');
  if (!c || !r) return;
  document.addEventListener('mousemove', function(e){ c.style.left=r.style.left=e.clientX+'px'; c.style.top=r.style.top=e.clientY+'px'; });
})();

// ── INIT ─────────────────────────────────────────────────────
handleServiceChange('Catering');
</script>
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('in'), i * 100);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
})();

/* ─────────────────────────────────
   SERVICES — PRICE REVEAL ON CLICK
   Each card has a "View Pricing" button that toggles
   the price panel. Cards are height-equalized.
   ───────────────────────────────── */
(function initPricePanels() {
  document.querySelectorAll('.svc-price-hint').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const panel = this.nextElementSibling;
      const isOpen = panel.classList.contains('visible');

      // Close all other open panels
      document.querySelectorAll('.svc-price-panel.visible').forEach(p => {
        p.classList.remove('visible');
        p.previousElementSibling.classList.remove('open');
        p.previousElementSibling.textContent = 'View Pricing';
      });

      if (!isOpen) {
        panel.classList.add('visible');
        this.classList.add('open');
        this.textContent = 'Hide Pricing';
      }

      // Re-equalize card heights after animation frame
      requestAnimationFrame(equalizeServiceCards);
    });
  });

  // Close price panel when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.svc-price-panel.visible').forEach(p => {
      p.classList.remove('visible');
      p.previousElementSibling.classList.remove('open');
      p.previousElementSibling.textContent = 'View Pricing';
    });
    requestAnimationFrame(equalizeServiceCards);
  });
})();

function equalizeServiceCards() {
  const grid = document.querySelector('.services-grid');
  if (!grid) return;
  const cards = grid.querySelectorAll('.svc-card');
  // Reset heights first
  cards.forEach(c => c.style.height = 'auto');
  // Find max height
  let max = 0;
  cards.forEach(c => { if (c.offsetHeight > max) max = c.offsetHeight; });
  // Apply to all
  cards.forEach(c => c.style.height = max + 'px');
}

// Equalize on load and resize
window.addEventListener('load', equalizeServiceCards);
window.addEventListener('resize', equalizeServiceCards);

/* ─────────────────────────────────
   BOOKING FORM — SUB-CATEGORY PICKERS
   ───────────────────────────────── */
function handleServiceChange(val) {
  document.querySelectorAll('.sub-picker').forEach(el => el.classList.remove('visible'));
  const map = {
    'Catering':             'sub-catering',
    'Hair':                 'sub-hair',
    'Event Planning':       'sub-event',
    'Wedding Coordination': 'sub-wedding',
  };
  if (map[val]) document.getElementById(map[val]).classList.add('visible');
}

function pickSub(el, hiddenId) {
  el.closest('.sub-options').querySelectorAll('.sub-opt').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.getElementById(hiddenId).value = el.dataset.val;
}

/* ─────────────────────────────────
   BOOKING FORM — SIDEBAR SYNC
   ───────────────────────────────── */
function selectService(el, name) {
  document.querySelectorAll('.bsl-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  const sel = document.getElementById('serviceSelect');
  if (sel) {
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === name) { sel.selectedIndex = i; break; }
    }
    handleServiceChange(name);
  }
}

/* ─────────────────────────────────
   STRIPE REDIRECT
   ───────────────────────────────── */
function redirectStripe() {
  if (STRIPE_PAYMENT_LINK.includes('YOUR_PAYMENT_LINK_HERE')) {
    alert('Stripe Payment Link not yet configured.\n\nTo set it up:\n1. Log in to dashboard.stripe.com\n2. Go to Payment Links → Create a link\n3. Copy the URL and replace STRIPE_PAYMENT_LINK in js/main.js');
    return;
  }
  window.open(STRIPE_PAYMENT_LINK, '_blank');
}

/* ─────────────────────────────────
   BOOKING FORM SUBMIT HANDLER
   ───────────────────────────────── */
function handleBooking(e) {
  const form = document.getElementById('bookingForm');
  if (form && form.action.includes('YOUR_GOOGLE_FORM')) {
    e.preventDefault();
    alert('Booking form not yet connected to Google Forms.\n\nSee the SETUP INSTRUCTIONS comment inside book.html to link your Google Form.');
    return;
  }
  // Form submits normally to Google Forms
}

/* ─────────────────────────────────
   INQUIRY FORM SUBMIT HANDLER
   ───────────────────────────────── */
function handleInquiry(e) {
  const form = e.target;
  if (form && form.action.includes('YOUR_GOOGLE_INQUIRY_FORM_URL')) {
    e.preventDefault();
    alert('Contact form not yet connected to Google Forms.\n\nSee the SETUP INSTRUCTIONS comment inside contact.html to link your Google Form.');
    return;
  }
}

/* ─────────────────────────────────
   LEGAL MODAL
   ───────────────────────────────── */
(function initLegalModal() {
  const overlay  = document.getElementById('legalOverlay');
  if (!overlay) return;
  const tabs     = document.querySelectorAll('.lm-tab');
  const panels   = document.querySelectorAll('.lm-panel');
  const closeBtn = document.querySelector('.lm-close');

  function openModal(panelId) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.target === panelId));
    panels.forEach(p => p.classList.toggle('active', p.id === 'panel-' + panelId));
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  tabs.forEach(tab => tab.addEventListener('click', () => openModal(tab.dataset.target)));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  document.querySelectorAll('[data-legal]').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); openModal(link.dataset.legal); });
  });
})();
