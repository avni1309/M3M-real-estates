/* ============================================================
   M3M-inspired site — interactions & animations
   ============================================================ */

/* ---- CONFIG: change numbers / email here in one place ---- */
const CONFIG = {
  whatsappPrimary: '919711537566',   // primary WhatsApp (91 = India country code)
  whatsappAlt:     '919654694700',
  phone1: '+91 97115 37566',
  phone2: '+91 96546 94700',
  email:  'xyz@gmail.com',           // TODO: replace with your real enquiry email
  // Optional: paste a Formspree endpoint (https://formspree.io) or a Google Apps
  // Script Web-App URL here to ALSO log every lead to a sheet/inbox.
  // Leave '' to skip logging (WhatsApp + email still work).
  formEndpoint: ''
};

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initCounters();
  initForms();
  initAutoPopup();
  wireFloatingButtons();
  initLightbox();
});

/* Navbar: scroll state + mobile toggle */
function initNav() {
  const nav = document.querySelector('.nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const burger = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => { burger.classList.remove('open'); links.classList.remove('open'); })
    );
  }
}

/* Scroll reveal via IntersectionObserver */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('show')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('show'); io.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(e => io.observe(e));
}

/* Animated number counters */
function initCounters() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1600; const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
}

/* Enquiry / contact form handling -> optional log + email draft + WhatsApp redirect */
function initForms() {
  document.querySelectorAll('form[data-enquiry]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const name = (data.name || '').trim();
      const phone = (data.phone || '').trim();
      if (!name || !phone) { showToast('Please enter your name and phone number.'); return; }

      const project = data.project || form.dataset.project || 'General Enquiry';
      const lines = [
        'New Enquiry — ' + project,
        'Name: ' + name,
        'Phone: ' + phone,
        data.email ? 'Email: ' + data.email : '',
        data.interest ? 'Interested in: ' + data.interest : '',
        data.visit ? 'Preferred site visit: ' + data.visit : '',
        data.message ? 'Message: ' + data.message : ''
      ].filter(Boolean);
      const text = lines.join('\n');

      // Optionally log the lead to a sheet / inbox (fire-and-forget)
      if (CONFIG.formEndpoint) {
        try {
          fetch(CONFIG.formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ project: project, name: name, phone: phone, email: data.email || '', interest: data.interest || '', visit: data.visit || '', message: data.message || '' })
          }).catch(() => {});
        } catch (_) {}
      }

      // Open a pre-filled email draft in a new tab
      const subject = encodeURIComponent('Enquiry: ' + project + ' — ' + name);
      const body = encodeURIComponent(text);
      window.open('mailto:' + CONFIG.email + '?subject=' + subject + '&body=' + body, '_blank');

      // Redirect to WhatsApp with the same message pre-filled
      const wa = 'https://wa.me/' + CONFIG.whatsappPrimary + '?text=' + encodeURIComponent(text);
      showToast('Redirecting you to WhatsApp…');
      setTimeout(() => { window.location.href = wa; }, 900);

      form.reset();
      closeModal();
    });
  });
}

/* Modal open/close */
function openModal() {
  const m = document.getElementById('enquiryModal');
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal() {
  const m = document.getElementById('enquiryModal');
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
window.openModal = openModal;
window.closeModal = closeModal;

document.addEventListener('click', (e) => {
  if (e.target.matches('[data-open-modal]')) { e.preventDefault(); openModal(); }
  if (e.target.matches('.modal-overlay') || e.target.matches('[data-close-modal]')) closeModal();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* Auto-open popup on project pages (once per browser session) */
function initAutoPopup() {
  const m = document.getElementById('enquiryModal');
  if (!m || m.dataset.autopop !== 'true') return;
  const key = 'm3m_popup_' + location.pathname;
  try { if (sessionStorage.getItem(key)) return; } catch (_) {}
  setTimeout(() => { openModal(); try { sessionStorage.setItem(key, '1'); } catch (_) {} }, 1400);
}

/* Floating WhatsApp button link */
function wireFloatingButtons() {
  document.querySelectorAll('.fab-wa').forEach(wa => {
    wa.href = 'https://wa.me/' + CONFIG.whatsappPrimary + '?text=' + encodeURIComponent('Hi M3M, I would like more information.');
    wa.target = '_blank';
  });
}

/* Lightbox gallery */
function initLightbox() {
  const items = Array.from(document.querySelectorAll('.g-item'));
  if (!items.length) return;

  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML =
    '<button class="lb-close" aria-label="Close">&times;</button>' +
    '<button class="lb-btn lb-prev" aria-label="Previous">&#8249;</button>' +
    '<div class="lb-stage"><div class="lb-slot"></div><div class="lb-cap"></div></div>' +
    '<button class="lb-btn lb-next" aria-label="Next">&#8250;</button>';
  document.body.appendChild(lb);

  const slot = lb.querySelector('.lb-slot');
  const cap = lb.querySelector('.lb-cap');
  let idx = 0;

  const render = () => {
    const el = items[idx];
    const img = el.querySelector('img');
    const label = (el.querySelector('.g-cap') || {}).textContent || '';
    const fb = el.querySelector('.g-fallback');
    const phClass = fb ? (fb.className.replace('g-fallback', '').trim() || 'ph-a') : 'ph-a';
    if (img && img.getAttribute('src')) {
      slot.innerHTML = '<img src="' + img.getAttribute('src') + '" alt="' + label + '">';
    } else {
      slot.innerHTML = '<div class="lb-fallback ' + phClass + '">' + (label || 'Image') + '</div>';
    }
    cap.textContent = label;
  };
  const open = (i) => { idx = i; render(); lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
  const next = () => { idx = (idx + 1) % items.length; render(); };
  const prev = () => { idx = (idx - 1 + items.length) % items.length; render(); };

  items.forEach((el, i) => el.addEventListener('click', () => open(i)));
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-next').addEventListener('click', next);
  lb.querySelector('.lb-prev').addEventListener('click', prev);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
}

/* Toast */
let toastTimer;
function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}
