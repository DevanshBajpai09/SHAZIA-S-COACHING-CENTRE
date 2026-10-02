/* Shazia's Coaching Centre — vanilla JS */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ===== SETTINGS: add the centre's real phone number here, e.g. "+91XXXXXXXXXX" ===== */
  const PHONE = '';
  /* ===== GALLERY: add photos to /assets and list them, e.g. {src:'assets/room.jpg', alt:'Classroom'} ===== */
  const PHOTOS = [];

  /* Navbar: glass on scroll + mobile menu */
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  const onScroll = () => {
    nav.classList.toggle('sc', scrollY > 30);
    const tl = $('#tl'); // timeline line fills as it scrolls into view
    const r = tl.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * .65 - r.top) / r.height));
    $('#fill').style.transform = `scaleY(${p})`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const setMenu = o => { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* Scroll reveal with stagger */
  $$('.rv').forEach((el, i) => el.style.setProperty('--d', (i % 4) * .08 + 's'));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
  $$('.rv').forEach(el => io.observe(el));

  /* Hero particles */
  if (!reduce) {
    const pc = $('#particles');
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('span');
      s.style.cssText = `left:${Math.random() * 100}%;top:${60 + Math.random() * 50}%;animation-duration:${14 + Math.random() * 18}s;animation-delay:-${Math.random() * 20}s;opacity:${.2 + Math.random() * .4}`;
      pc.appendChild(s);
    }
  }

  /* Desktop-only micro-interactions: cursor glow, magnetic buttons, card tilt */
  if (fine && !reduce) {
    const g = $('.glow');
    addEventListener('mousemove', e => { g.style.opacity = 1; g.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; }, { passive: true });
    $$('.mag').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
      b.addEventListener('mouseleave', () => b.style.transform = '');
    });
    $$('.tilt').forEach(c => {
      c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `perspective(700px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`; });
      c.addEventListener('mouseleave', () => c.style.transform = '');
    });
  }

  /* Program filter */
  const cards = $$('.card');
  $$('.filters button').forEach(b => b.addEventListener('click', () => {
    $$('.filters button').forEach(x => x.classList.toggle('on', x === b));
    const f = b.dataset.f;
    cards.forEach(c => {
      const show = f === 'all' || c.dataset.cat.split(' ').includes(f);
      if (show) { c.hidden = false; requestAnimationFrame(() => c.classList.remove('hide')); }
      else { c.classList.add('hide'); setTimeout(() => { if (c.classList.contains('hide')) c.hidden = true; }, reduce ? 0 : 350); }
    });
  }));

  /* Interactive panels */
  const T = [
    ['Concept', 'Every topic starts with understanding the idea behind it, so learners know why an answer works.'],
    ['Practice', 'Guided practice turns understanding into skill, with support available when a step feels unclear.'],
    ['Confidence', 'As gaps close and fundamentals firm up, learners become more comfortable and consistent.']
  ];
  $$('.tabs button').forEach(b => b.addEventListener('click', () => {
    $$('.tabs button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
    const [t, p] = T[b.dataset.t], pt = $('#pt'), pp = $('#pp');
    $('#pv').dataset.s = b.dataset.t;
    pt.style.opacity = pp.style.opacity = 0;
    setTimeout(() => { pt.textContent = t; pp.textContent = p; pt.style.opacity = pp.style.opacity = 1; }, reduce ? 0 : 220);
  }));

  /* Gallery + lightbox (placeholders until real photos are added) */
  const grads = ['#2b2f78,#14173f', '#f4b73f,#e8894a', '#7fd6c2,#2b2f78', '#14173f,#5b60c9', '#e8894a,#2b2f78', '#7fd6c2,#14173f'];
  const ratios = [4 / 5, 1, 3 / 4, 1, 5 / 6, 4 / 3];
  const items = PHOTOS.length ? PHOTOS : ['Learning space', 'Study time', 'Guided practice', 'Group learning', 'Focused tutoring', 'Our centre'].map((t, i) => ({ alt: t, g: grads[i], r: ratios[i] }));
  const media = (it, i) => it.src
    ? `<img src="${it.src}" alt="${it.alt}" loading="lazy" style="width:100%;display:block">`
    : `<span role="img" aria-label="${it.alt} placeholder" style="aspect-ratio:${it.r};background:linear-gradient(145deg,${it.g})">${it.alt}</span>`;
  const mason = $('#mason');
  items.forEach((it, i) => { const b = document.createElement('button'); b.className = 'tile'; b.innerHTML = media(it, i); b.setAttribute('aria-label', 'Open ' + it.alt); b.onclick = () => open(i); mason.appendChild(b); });
  const lb = $('#lb'), lbi = $('#lbi'); let cur = 0, last;
  const show = i => { cur = (i + items.length) % items.length; const it = items[cur]; lbi.style.background = it.src ? `url(${it.src}) center/cover` : `linear-gradient(145deg,${it.g})`; lbi.textContent = it.alt; lbi.style.animation = 'none'; lbi.offsetWidth; lbi.style.animation = ''; };
  const open = i => { last = document.activeElement; lb.hidden = false; show(i); $('#lbx').focus(); document.body.style.overflow = 'hidden'; };
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; last && last.focus(); };
  $('#lbx').onclick = close; $('#lbp').onclick = () => show(cur - 1); $('#lbnx').onclick = () => show(cur + 1);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });

  /* Call button */
  const call = $('#call'), note = $('#callnote');
  if (PHONE) call.href = 'tel:' + PHONE;
  else call.addEventListener('click', e => { e.preventDefault(); note.textContent = "The centre's phone number hasn't been added to this site yet. Please check the Google listing or visit us in Kondapur."; });

  /* Enquiry form validation (no backend — nothing is sent) */
  const form = $('#form');
  const rules = {
    s: v => v.trim().length > 1 || 'Enter the student name.',
    p: v => v.trim().length > 1 || 'Enter the parent or guardian name.',
    ph: v => /^[+]?[\d\s-]{10,14}$/.test(v.trim()) || 'Enter a valid phone number.',
    g: v => !!v || 'Choose a grade.',
    pr: v => !!v || 'Choose a program.'
  };
  form.addEventListener('submit', e => {
    e.preventDefault(); let ok = true;
    Object.entries(rules).forEach(([n, f]) => {
      const el = form.elements[n], r = f(el.value), msg = r === true ? '' : r;
      el.classList.toggle('bad', !!msg); el.setAttribute('aria-invalid', !!msg);
      el.parentElement.querySelector('em').textContent = msg; if (msg) ok = false;
    });
    if (ok) { $('#ok').hidden = false; form.reset(); } else { $('#ok').hidden = true; form.querySelector('.bad').focus(); }
  });
})();