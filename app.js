(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const header = $('[data-header]');
  const nav = $('[data-nav]');
  const menuToggle = $('[data-menu-toggle]');

  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 26);
  syncHeader();
  addEventListener('scroll', syncHeader, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(Boolean(open)));
  });
  $$('#site-nav a').forEach(link => link.addEventListener('click', () => {
    nav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px' });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  const cursor = $('.cursor-light');
  addEventListener('pointermove', event => {
    if (!cursor) return;
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  }, { passive: true });

  const tiltRoot = $('[data-tilt-root]');
  const tilt = $('[data-tilt]');
  if (tiltRoot && tilt && matchMedia('(pointer:fine)').matches) {
    tiltRoot.addEventListener('pointermove', event => {
      const rect = tiltRoot.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      tilt.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    tiltRoot.addEventListener('pointerleave', () => {
      tilt.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  const steps = $$('[data-step]');
  let activeStep = 0;
  let stepTimer;
  const setStep = index => {
    activeStep = index;
    steps.forEach((step, i) => step.classList.toggle('active', i === index));
  };
  const startSteps = () => {
    clearInterval(stepTimer);
    if (steps.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stepTimer = setInterval(() => setStep((activeStep + 1) % steps.length), 3600);
  };
  steps.forEach((step, index) => {
    step.addEventListener('mouseenter', () => setStep(index));
    step.addEventListener('focusin', () => setStep(index));
  });
  startSteps();

  const revision = $('[data-revision]');
  let rev = 2417;
  setInterval(() => {
    if (!revision || document.hidden) return;
    if (Math.random() > .55) rev += 1;
    revision.textContent = String(rev).padStart(5, '0');
  }, 3000);

  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const canvas = $('#field');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let nodes = [];
  const pointer = { x: .5, y: .5 };

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    width = innerWidth;
    height = innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(30, Math.min(72, Math.floor((width * height) / 29000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: .3 + Math.random() * .7,
      vx: (Math.random() - .5) * .06,
      vy: (Math.random() - .5) * .06,
      r: .45 + Math.random() * .9,
      phase: Math.random() * Math.PI * 2
    }));
  };

  resize();
  addEventListener('resize', resize, { passive: true });
  addEventListener('pointermove', event => {
    pointer.x = event.clientX / width;
    pointer.y = event.clientY / height;
  }, { passive: true });

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const driftX = (pointer.x - .5) * 10;
    const driftY = (pointer.y - .5) * 8;

    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;
      node.phase += .008;
      if (node.x < -25) node.x = width + 25;
      if (node.x > width + 25) node.x = -25;
      if (node.y < -25) node.y = height + 25;
      if (node.y > height + 25) node.y = -25;
    }

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const ax = a.x + driftX * a.z;
      const ay = a.y + driftY * a.z;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const bx = b.x + driftX * b.z;
        const by = b.y + driftY * b.z;
        const dx = ax - bx;
        const dy = ay - by;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance >= 118) continue;
        const alpha = (1 - distance / 118) * .045 * Math.min(a.z, b.z);
        ctx.strokeStyle = `rgba(92,220,255,${alpha})`;
        ctx.lineWidth = .6;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
      const alpha = .075 + (Math.sin(a.phase) + 1) * .02;
      ctx.fillStyle = `rgba(106,226,255,${alpha * a.z})`;
      ctx.beginPath();
      ctx.arc(ax, ay, a.r * a.z, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  };

  draw();
})();
