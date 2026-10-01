(() => {
  'use strict';
  const scroller = document.getElementById('studioScroll');
  const scenes = [...scroller.querySelectorAll('.scene')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const previous = document.getElementById('previousChapter');
  const next = document.getElementById('nextChapter');
  const counter = document.getElementById('chapterCounter');
  const progress = document.querySelector('.progress');
  let active = -1, frame = 0;

  // Observe the actual scrollport. Never write scroll position from a scroll event.
  function update() {
    frame = 0;
    const viewport = scroller.getBoundingClientRect();
    const focusLine = viewport.top + scroller.clientHeight * .45;
    let index = 0;
    scenes.forEach((scene, i) => {
      const bounds = scene.getBoundingClientRect();
      if (bounds.top <= focusLine) index = i;
      if (!reduced.matches && bounds.bottom > viewport.top && bounds.top < viewport.bottom) {
        scene.style.setProperty('--drift', Math.max(-45, Math.min(45, (viewport.top - bounds.top) * .09)) + 'px');
      }
    });
    if (index !== active) {
      active = index;
      scenes.forEach((scene, i) => scene.classList.toggle('is-active', i === active));
      counter.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(scenes.length).padStart(2, '0');
      previous.disabled = active === 0;
      next.disabled = active === scenes.length - 1;
    }
    const range = scroller.scrollHeight - scroller.clientHeight;
    progress.style.width = (range > 0 ? scroller.scrollTop / range * 100 : 0) + '%';
  }
  function scheduleUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  function goTo(index) {
    const scene = scenes[Math.max(0, Math.min(scenes.length - 1, index))];
    const top = scene.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
    scroller.scrollTo({top, behavior: reduced.matches ? 'instant' : 'smooth'});
  }
  scroller.addEventListener('scroll', scheduleUpdate, {passive: true});
  addEventListener('resize', scheduleUpdate);
  previous.addEventListener('click', () => goTo(active - 1));
  next.addEventListener('click', () => goTo(active + 1));
  scroller.addEventListener('keydown', event => {
    if (event.target !== scroller || event.altKey || event.ctrlKey || event.metaKey) return;
    const destinations = {PageDown: active + 1, PageUp: active - 1, Home: 0, End: scenes.length - 1};
    if (event.key in destinations) {
      event.preventDefault();
      goTo(destinations[event.key]);
    }
  });
  update();

  // Pointer depth affects surfaces only, never chapter geometry or scroll position.
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (reduced.matches || event.pointerType !== 'mouse') return;
      const box = card.getBoundingClientRect();
      card.style.setProperty('--rx', (-(event.clientY - box.top) / box.height * 10 + 5) + 'deg');
      card.style.setProperty('--ry', ((event.clientX - box.left) / box.width * 12 - 6) + 'deg');
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });
  const hero = document.querySelector('.hero');
  const portrait = hero.querySelector('img');
  hero.addEventListener('pointermove', event => {
    if (reduced.matches || event.pointerType !== 'mouse') return;
    const box = hero.getBoundingClientRect();
    portrait.style.setProperty('--px', ((event.clientX - box.left) / box.width - .5) * 18 + 'px');
    portrait.style.setProperty('--ry', ((event.clientX - box.left) / box.width - .5) * 12 + 'deg');
  });
  hero.addEventListener('pointerleave', () => {portrait.style.removeProperty('--px');portrait.style.removeProperty('--ry');});

  document.querySelectorAll('.project-action').forEach(button => {
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? 'HIDE BUILD NOTES −' : 'VIEW BUILD NOTES +';
      const note = document.getElementById(button.getAttribute('aria-controls'));
      note.hidden = !open;
      note.classList.toggle('open', open);
    });
  });

  const layers = [...document.querySelectorAll('.system-layer')];
  const descriptions = [
    'Collects findings from Nmap, OWASP ZAP, and Nuclei for authorized security assessments.',
    'Normalizes evidence across scanners and supports false-positive assessment.',
    'Brings findings into context with risk scoring and attack-path correlation.'
  ];
  const layerPickers = [...document.querySelectorAll('[data-select-layer]')];
  function selectLayer(index) {
    const button = layers[index];
    layers.forEach(layer => layer.setAttribute('aria-pressed', String(layer === button)));
    layerPickers.forEach((picker, i) => picker.setAttribute('aria-pressed', String(i === index)));
    document.getElementById('layerTag').textContent = button.querySelector('span').textContent;
    document.getElementById('layerTitle').textContent = button.querySelector('strong').textContent;
    document.getElementById('layerDescription').textContent = descriptions[index];
  }
  layers.forEach((button, index) => button.addEventListener('click', () => selectLayer(index)));
  layerPickers.forEach((button, index) => button.addEventListener('click', () => selectLayer(index)));
  const stack = document.getElementById('layerStack');
  document.getElementById('rotation').addEventListener('input', event => {
    stack.style.setProperty('--rotation', event.target.value + 'deg');
  });
  document.getElementById('explodeLayers').addEventListener('click', event => {
    const open = stack.classList.toggle('exploded');
    event.currentTarget.setAttribute('aria-pressed', String(open));
    event.currentTarget.textContent = open ? 'Stack layers' : 'Separate layers';
  });

  const deck = [...document.querySelectorAll('#credentialDeck article')];
  let selected = 0;
  function renderDeck() {
    deck.forEach((card, index) => {
      const slot = (index - selected + deck.length) % deck.length;
      card.style.setProperty('--slot', slot);
      card.style.zIndex = String(deck.length - slot);
      card.dataset.front = String(slot === 0);
      card.inert = slot !== 0;
      card.setAttribute('aria-hidden', String(slot !== 0));
    });
    document.getElementById('credentialCounter').textContent = (selected + 1) + ' / ' + deck.length;
  }
  document.getElementById('previousCredential').addEventListener('click', () => {selected = (selected - 1 + deck.length) % deck.length;renderDeck();});
  document.getElementById('nextCredential').addEventListener('click', () => {selected = (selected + 1) % deck.length;renderDeck();});
  renderDeck();

  const deckSurface = document.getElementById('credentialDeck');
  let swipe = null;
  deckSurface.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' || !event.isPrimary) return;
    swipe = {x: event.clientX, y: event.clientY, id: event.pointerId};
  });
  deckSurface.addEventListener('pointerup', event => {
    if (!swipe || swipe.id !== event.pointerId) return;
    const dx = event.clientX - swipe.x, dy = event.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    selected = (selected + (dx < 0 ? 1 : -1) + deck.length) % deck.length;
    renderDeck();
  });
  deckSurface.addEventListener('pointercancel', () => {swipe = null;});

})();
