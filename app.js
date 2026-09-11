(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const header = $('[data-header]');
  const nav = $('[data-nav]');
  const menuToggle = $('[data-menu-toggle]');
  const syncHeader = () => header?.classList.toggle('scrolled', scrollY > 24);
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

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px' });
  $$('.reveal').forEach(el => revealObserver.observe(el));

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
      tilt.style.transform = `rotateY(${x * 4.2}deg) rotateX(${-y * 4.2}deg)`;
    });
    tiltRoot.addEventListener('pointerleave', () => tilt.style.transform = 'rotateY(0deg) rotateX(0deg)');
  }

  const phases = [
    {
      title: 'PERCEIVE', copy: 'Build an authoritative scene model before planning a change.', state: 'GROUNDED', stateClass: '', score: '42%', truth: 'SCENE MODEL READY', truthClass: '', track: '20%', op1: 'scene.snapshot()', op2: 'perception.capture_bundle()', rev: '2417', mesh: '', frame: '', txn: 0, bars: 1, commit: 'pending'
    },
    {
      title: 'AUTHOR', copy: 'Use typed editor-native operations inside a revision-pinned transaction.', state: 'CANDIDATE', stateClass: '', score: '61%', truth: 'CANDIDATE STATE', truthClass: '', track: '45%', op1: 'transaction.begin(rev)', op2: 'author.execute(plan)', rev: '2417', mesh: 'authoring', frame: 'authoring', txn: 1, bars: 2, commit: 'pending'
    },
    {
      title: 'VERIFY', copy: 'Measure geometry, spatial truth, references, coverage, and edit locality.', state: 'REVIEW', stateClass: 'alert', score: '78%', truth: 'REFERENCE MISMATCH', truthClass: 'alert', track: '67%', op1: 'truth.evaluate()', op2: 'evidence.compare()', rev: '2418', mesh: 'authoring', frame: 'authoring', txn: 3, bars: 3, commit: 'revising'
    },
    {
      title: 'CORRECT', copy: 'Recover from the bad hypothesis and apply a bounded correction trajectory.', state: 'CORRECTING', stateClass: '', score: '93%', truth: 'CORRECTION APPLIED', truthClass: '', track: '86%', op1: 'rollback_to(A7F4)', op2: 'author.apply(delta)', rev: '2418', mesh: 'authoring', frame: 'proven', txn: 3, bars: 4, commit: 'rechecking'
    },
    {
      title: 'DELIVER', copy: 'Bind deterministic proof to the accepted state and retain the successful skill.', state: 'ACCEPTED', stateClass: 'accepted', score: '100%', truth: 'VERIFIED RESULT', truthClass: 'accepted', track: '100%', op1: 'transaction.commit()', op2: 'skill.distill(trace)', rev: '2419', mesh: 'proven', frame: 'proven', txn: 4, bars: 4, commit: 'delivered'
    }
  ];

  const phaseIndex = $('[data-phase-index]');
  const phaseTitle = $('[data-phase-title]');
  const phaseCopy = $('[data-phase-copy]');
  const phaseTrack = $('[data-phase-track]');
  const stateEl = $('[data-system-state]');
  const opPrimary = $('[data-op-primary]');
  const opSecondary = $('[data-op-secondary]');
  const opRevision = $('[data-op-revision]');
  const truthScore = $('[data-truth-score]');
  const truthState = $('[data-truth-state]');
  const truthBars = $$('.truth-bars i');
  const mesh = $('[data-primary-mesh]');
  const perceptionFrame = $('[data-perception-frame]');
  const txnSteps = $$('[data-txn]');
  const txnStrip = $('.transaction-strip');
  const commitLabel = $('[data-commit-label]');
  const proofBeam = $('[data-proof-beam]');
  let phase = 0;

  const renderPhase = i => {
    phase = i;
    const p = phases[i];
    if (phaseIndex) phaseIndex.textContent = String(i + 1).padStart(2,'0');
    if (phaseTitle) phaseTitle.textContent = p.title;
    if (phaseCopy) phaseCopy.textContent = p.copy;
    if (phaseTrack) phaseTrack.style.width = p.track;
    if (stateEl) { stateEl.textContent = p.state; stateEl.className = `chrome-state ${p.stateClass}`.trim(); }
    if (opPrimary) opPrimary.textContent = p.op1;
    if (opSecondary) opSecondary.textContent = p.op2;
    if (opRevision) opRevision.textContent = p.rev;
    if (truthScore) { truthScore.textContent = p.score; truthScore.style.color = p.truthClass === 'accepted' ? 'var(--green)' : p.truthClass === 'alert' ? 'var(--red)' : 'var(--text)'; }
    if (truthState) { truthState.textContent = p.truth; truthState.className = `truth-state ${p.truthClass}`.trim(); }
    truthBars.forEach((bar, idx) => bar.classList.toggle('on', idx < p.bars));
    if (mesh) mesh.className = `mesh mesh-primary ${p.mesh}`.trim();
    if (perceptionFrame) perceptionFrame.className = `perception-frame ${p.frame}`.trim();
    txnSteps.forEach((step, idx) => step.classList.toggle('active', idx <= p.txn));
    if (commitLabel) commitLabel.textContent = p.commit;
    if (proofBeam) proofBeam.classList.toggle('on', i >= 2);
    if (txnStrip) {
      txnStrip.classList.remove('flow');
      void txnStrip.offsetWidth;
      if (i > 0) txnStrip.classList.add('flow');
    }
  };
  renderPhase(0);
  setInterval(() => renderPhase((phase + 1) % phases.length), 3000);

  const loopModules = $$('[data-loop-module]');
  const loopEnergy = $('[data-loop-energy]');
  let loopIndex = 0;
  const renderLoop = i => {
    loopIndex = i;
    loopModules.forEach((m, idx) => m.classList.toggle('active', idx === i));
    if (loopEnergy) loopEnergy.style.transform = `translateY(${i * 100}%)`;
  };
  loopModules.forEach((m, i) => m.addEventListener('mouseenter', () => renderLoop(i)));
  setInterval(() => renderLoop((loopIndex + 1) % loopModules.length), 4400);

  const revision = $('[data-revision]');
  setInterval(() => {
    if (!revision || document.hidden) return;
    revision.textContent = String(Number(phases[phase].rev)).padStart(5,'0');
  }, 700);

  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const canvas = $('#field');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let w = 0, h = 0, dpr = 1, nodes = [], t = 0;
  const pointer = { x: .5, y: .5 };
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    w = innerWidth; h = innerHeight;
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    nodes = Array.from({ length: Math.max(18, Math.min(42, Math.floor(w / 34))) }, (_, i) => ({
      a: (Math.PI * 2 * i) / Math.max(18, Math.min(42, Math.floor(w / 34))),
      r: 150 + Math.random() * Math.max(180, w * .28),
      s: .0007 + Math.random() * .0008,
      z: .35 + Math.random() * .65,
      p: Math.random() * Math.PI * 2
    }));
  };
  resize();
  addEventListener('resize', resize, { passive: true });
  addEventListener('pointermove', e => { pointer.x = e.clientX / w; pointer.y = e.clientY / h; }, { passive: true });

  const draw = () => {
    t += 1;
    ctx.clearRect(0,0,w,h);
    const cx = w * (.68 + (pointer.x - .5) * .015);
    const cy = h * (.26 + (pointer.y - .5) * .015);
    ctx.lineWidth = .5;
    nodes.forEach((n, i) => {
      const a = n.a + t * n.s;
      const x = cx + Math.cos(a) * n.r;
      const y = cy + Math.sin(a) * n.r * .36;
      const pulse = .045 + (Math.sin(t * .01 + n.p) + 1) * .018;
      ctx.fillStyle = `rgba(115,218,240,${pulse * n.z})`;
      ctx.beginPath(); ctx.arc(x,y,1.1*n.z,0,Math.PI*2); ctx.fill();
      if (i % 3 === 0) {
        ctx.strokeStyle = `rgba(93,190,216,${.025*n.z})`;
        ctx.beginPath(); ctx.ellipse(cx,cy,n.r,n.r*.36,0,0,Math.PI*2); ctx.stroke();
      }
    });
    requestAnimationFrame(draw);
  };
  draw();
})();
