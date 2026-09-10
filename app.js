(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const header = $('[data-header]');
  const menuToggle = $('[data-menu-toggle]');
  const nav = $('[data-nav]');

  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 28);
  syncHeader();
  addEventListener('scroll', syncHeader, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  $$('#site-nav a').forEach(a => a.addEventListener('click', () => {
    nav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
  $$('.reveal').forEach(el => observer.observe(el));

  const cursor = $('.cursor-light');
  addEventListener('pointermove', e => {
    if (!cursor) return;
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  }, { passive: true });

  const tiltRoot = $('[data-tilt-root]');
  const tilt = $('[data-tilt]');
  if (tiltRoot && tilt && matchMedia('(pointer:fine)').matches) {
    tiltRoot.addEventListener('pointermove', e => {
      const r = tiltRoot.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      tilt.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    tiltRoot.addEventListener('pointerleave', () => tilt.style.transform = 'rotateY(0deg) rotateX(0deg)');
  }

  const loopData = [
    { title: 'Observe before touching anything.', copy: 'Synwyr begins with explicit editor state and perception evidence. The agent knows which host it is connected to, what that host can do, what revision it is reasoning about, and what the scene actually looks like.', code: 'scene.snapshot\nviewport.capture' },
    { title: 'Plan against identity, not appearance.', copy: 'The model reasons against persistent object IDs, topology revisions, capability schemas, and explicit scene state. Names and transient indices are not trusted as identity.', code: 'system.hello\nscene.search\nif_revision: 2417' },
    { title: 'Make the smallest deterministic change.', copy: 'Actions are structured editor operations executed on the host\'s native editor thread. Arbitrary Python or C# is not the default control surface.', code: 'transaction.begin\nmesh.extrude\nmodifier.apply' },
    { title: 'Look again. Never assume.', copy: 'After acting, Synwyr re-inspects machine state and captures visual evidence from the same editor world. The agent gets a new revision and the context needed to compare before and after.', code: 'mesh.validate\nviewport.capture\nscene.diff' },
    { title: 'Separate completion from quality.', copy: 'A successful API call only proves that the host operation completed. Validation and evidence determine whether the result is actually acceptable.', code: 'validate(state)\ncompare(evidence)\nquality != confidence' },
    { title: 'Commit—or prove restoration.', copy: 'A good result is committed. A bad result is rolled back, and Synwyr recomputes the pre-transaction fingerprint. Restoration must match; otherwise rollback is reported incomplete.', code: 'transaction.commit\n// or\ntransaction.rollback → fingerprint' }
  ];
  const loopNodes = $$('[data-loop-node]');
  const loopTitle = $('[data-loop-title]');
  const loopCopy = $('[data-loop-copy]');
  const loopCode = $('[data-loop-code]');
  const loopNumber = $('[data-loop-number]');
  const loopProgress = $('[data-loop-progress]');
  let loopIndex = 0;
  let loopTimer;

  const setLoop = (index, manual = false) => {
    loopIndex = index;
    loopNodes.forEach((n, i) => n.classList.toggle('active', i === index));
    const d = loopData[index];
    if (loopTitle) loopTitle.textContent = d.title;
    if (loopCopy) loopCopy.textContent = d.copy;
    if (loopCode) loopCode.textContent = d.code;
    if (loopNumber) loopNumber.textContent = `${String(index + 1).padStart(2,'0')} / 06`;
    if (loopProgress) loopProgress.style.width = `${(index / 5) * 100}%`;
    if (manual) restartLoop();
  };
  const restartLoop = () => {
    clearInterval(loopTimer);
    loopTimer = setInterval(() => setLoop((loopIndex + 1) % loopData.length), 5200);
  };
  loopNodes.forEach((node, i) => node.addEventListener('click', () => setLoop(i, true)));
  restartLoop();

  const revision = $('[data-revision]');
  let rev = 2417;
  setInterval(() => {
    if (!revision || document.hidden) return;
    rev += Math.random() > .55 ? 1 : 0;
    revision.textContent = String(rev).padStart(5, '0');
  }, 3100);

  $('[data-year]').textContent = new Date().getFullYear();

  const canvas = $('#field');
  const ctx = canvas?.getContext('2d');
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canvas || !ctx || prefersReducedMotion) return;

  let w = 0, h = 0, dpr = 1, nodes = [];
  const pointer = { x: .5, y: .5 };

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.6);
    w = innerWidth; h = innerHeight;
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = Math.max(34, Math.min(86, Math.floor((w * h) / 25000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: .25 + Math.random() * .75,
      vx: (Math.random() - .5) * .07,
      vy: (Math.random() - .5) * .07,
      r: .45 + Math.random() * 1.05,
      pulse: Math.random() * Math.PI * 2
    }));
  };
  resize();
  addEventListener('resize', resize, { passive: true });
  addEventListener('pointermove', e => { pointer.x = e.clientX / w; pointer.y = e.clientY / h; }, { passive: true });

  const draw = () => {
    ctx.clearRect(0,0,w,h);
    const driftX = (pointer.x - .5) * 10;
    const driftY = (pointer.y - .5) * 8;

    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy; n.pulse += .008;
      if (n.x < -30) n.x = w + 30; else if (n.x > w + 30) n.x = -30;
      if (n.y < -30) n.y = h + 30; else if (n.y > h + 30) n.y = -30;
    }

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const ax = a.x + driftX * a.z, ay = a.y + driftY * a.z;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const bx = b.x + driftX * b.z, by = b.y + driftY * b.z;
        const dx = ax - bx, dy = ay - by;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 125) {
          const alpha = (1 - dist / 125) * .055 * Math.min(a.z,b.z);
          ctx.strokeStyle = `rgba(92,220,255,${alpha})`;
          ctx.lineWidth = .6;
          ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.stroke();
        }
      }
      const alpha = .09 + (Math.sin(a.pulse)+1) * .025;
      ctx.fillStyle = `rgba(106,226,255,${alpha * a.z})`;
      ctx.beginPath(); ctx.arc(ax,ay,a.r * a.z,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(draw);
  };
  draw();
})();
