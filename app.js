// ── Navbar scroll effect ──────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ── Mobile nav toggle ─────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ── Scroll fade-in animation ──────────────────────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => observer.observe(el));
}

// ── FAQ accordion ─────────────────────────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(open => {
      open.classList.remove('open');
      open.querySelector('.faq-answer').style.maxHeight = '0';
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ── Gallery thumbnail switcher ────────────────────────────────────────────────
document.querySelectorAll('.gallery-thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const gallery = thumb.closest('.product-images-gallery');
    const main = gallery.querySelector('.gallery-main img');
    main.src = thumb.querySelector('img').src;
    gallery.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  });
});

// ── Smooth scroll for anchor links ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── Web3Forms — shared submit helper ─────────────────────────────────────────
async function submitWeb3Form(form, btn, feedbackEl, successMsg) {
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="animation:spin 0.8s linear infinite"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Sending…';

  try {
    const data = Object.fromEntries(new FormData(form));
    const res  = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();

    if (json.success) {
      feedbackEl.textContent = successMsg;
      feedbackEl.className = 'form-feedback success';
      feedbackEl.style.display = 'block';
      form.reset();
      btn.disabled = false;
      btn.innerHTML = originalText;
    } else {
      throw new Error(json.message || 'Submission failed');
    }
  } catch (err) {
    feedbackEl.textContent = 'Something went wrong — please email us directly at info@craftedathletic.co.uk';
    feedbackEl.className = 'form-feedback error';
    feedbackEl.style.display = 'block';
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// ── Enquiry form ──────────────────────────────────────────────────────────────
const enquiryForm = document.getElementById('enquiry-form');
if (enquiryForm) {
  enquiryForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn      = enquiryForm.querySelector('[type="submit"]');
    const feedback = document.getElementById('enquiry-feedback');
    await submitWeb3Form(enquiryForm, btn, feedback, "Thanks! We'll be in touch within 24 hours. 🥊");
  });
}

// ── Newsletter form ───────────────────────────────────────────────────────────
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn      = newsletterForm.querySelector('[type="submit"]');
    const feedback = document.getElementById('newsletter-feedback');
    await submitWeb3Form(newsletterForm, btn, feedback, "You're subscribed! Keep an eye on your inbox.");
  });
}
