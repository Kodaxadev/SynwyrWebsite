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
      tilt.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    tiltRoot.addEventListener('pointerleave', () => tilt.style.transform = 'rotateY(0deg) rotateX(0deg)');
  }

  const loopStates = [
    {
      title: 'SEE THE SCENE',
      copy: 'Read live scene state, persistent IDs, and visual evidence before changing anything.',
      log: ['scene.snapshot()', 'viewport.capture()', 'object.id = obj_142'],
      verify: 'EVIDENCE CAPTURED',
      verifyWarn: true,
      activeNode: 0,
      scene: scene => {
        scene.focus.classList.remove('is-modified');
        scene.focus.classList.add('is-focused');
        scene.box.style.left = '29%';
        scene.box.style.top = '25%';
      }
    },
    {
      title: 'APPLY THE CHANGE',
      copy: 'Run a structured operation against the exact scene revision the agent already inspected.',
      log: ['transaction.begin()', 'mesh.extrude(face_08)', 'if_revision = 2417'],
      verify: 'CHANGE IN PROGRESS',
      verifyWarn: true,
      activeNode: 1,
      scene: scene => {
        scene.focus.classList.add('is-focused');
        scene.focus.classList.add('is-modified');
        scene.box.style.left = '31%';
        scene.box.style.top = '22%';
      }
    },
    {
      title: 'VERIFY THE RESULT',
      copy: 'Inspect again, compare before and after state, and only then trust or commit the result.',
      log: ['mesh.validate()', 'scene.diff()', 'transaction.commit()'],
      verify: '✓ MATCHES EXPECTATION',
      verifyWarn: false,
      activeNode: 2,
      scene: scene => {
        scene.focus.classList.add('is-focused');
        scene.focus.classList.add('is-modified');
        scene.box.style.left = '31%';
        scene.box.style.top = '22%';
      }
    }
  ];

  const heroStepTitle = $('[data-step-title]');
  const heroStepCopy = $('[data-step-copy]');
  const heroStepLog = $('[data-step-log]');
  const verifyPill = $('[data-verify-pill]');
  const pipeNodes = $$('[data-pipe]');
  const stepCards = $$('[data-step-card]');
  const scene = {
    focus: $('[data-scene-object="a"]'),
    box: $('.vision-box')
  };
  let stateIndex = 0;
  let stateTimer;

  const renderState = index => {
    stateIndex = index;
    const state = loopStates[index];

    if (heroStepTitle) heroStepTitle.textContent = state.title;
    if (heroStepCopy) heroStepCopy.textContent = state.copy;
    if (heroStepLog) {
      heroStepLog.innerHTML = '';
      state.log.forEach(line => {
        const el = document.createElement('code');
        el.textContent = line;
        heroStepLog.appendChild(el);
      });
    }
    if (verifyPill) {
      verifyPill.textContent = state.verify;
      verifyPill.classList.toggle('warn', !!state.verifyWarn);
    }

    pipeNodes.forEach((n, i) => n.classList.toggle('active', i === state.activeNode));
    stepCards.forEach((n, i) => n.classList.toggle('active', i === state.activeNode));

    if (scene.focus && scene.box) {
      scene.focus.classList.remove('is-focused', 'is-modified');
      state.scene(scene);
    }
  };

  const restartStates = () => {
    clearInterval(stateTimer);
    stateTimer = setInterval(() => renderState((stateIndex + 1) % loopStates.length), 2600);
  };

  stepCards.forEach((card, index) => card.addEventListener('mouseenter', () => {
    renderState(index);
    restartStates();
  }));

  renderState(0);
  restartStates();

  const revision = $('[data-revision]');
  let rev = 2417;
  setInterval(() => {
    if (!revision || document.hidden) return;
    rev += Math.random() > .55 ? 1 : 0;
    revision.textContent = String(rev).padStart(5, '0');
  }, 3000);

  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

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
    const count = Math.max(26, Math.min(72, Math.floor((w * h) / 30000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: .25 + Math.random() * .75,
      vx: (Math.random() - .5) * .06,
      vy: (Math.random() - .5) * .06,
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
        if (dist < 115) {
          const alpha = (1 - dist / 115) * .05 * Math.min(a.z,b.z);
          ctx.strokeStyle = `rgba(92,220,255,${alpha})`;
          ctx.lineWidth = .6;
          ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.stroke();
        }
      }
      const alpha = .08 + (Math.sin(a.pulse)+1) * .025;
      ctx.fillStyle = `rgba(106,226,255,${alpha * a.z})`;
      ctx.beginPath(); ctx.arc(ax,ay,a.r * a.z,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(draw);
  };
  draw();
})();
