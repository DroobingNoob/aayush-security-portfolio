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

  // One project record: every system has a model that explains its security idea.
  const projectSlides = [...document.querySelectorAll('.project-slide')];
  const projectTabs = [...document.querySelectorAll('.project-tab')];
  const projectCounter = document.getElementById('projectCounter');
  let selectedProject = 0;
  function renderProject() {
    projectSlides.forEach((slide, index) => {
      const activeSlide = index === selectedProject;
      slide.classList.toggle('is-active', activeSlide);
      slide.inert = !activeSlide;
      slide.setAttribute('aria-hidden', String(!activeSlide));
    });
    projectTabs.forEach((tab, index) => tab.setAttribute('aria-pressed', String(index === selectedProject)));
    projectCounter.textContent = (selectedProject + 1) + ' / ' + projectSlides.length;
  }
  function chooseProject(index) {
    selectedProject = (index + projectSlides.length) % projectSlides.length;
    renderProject();
  }
  projectTabs.forEach((tab, index) => tab.addEventListener('click', () => chooseProject(index)));
  document.getElementById('previousProject').addEventListener('click', () => chooseProject(selectedProject - 1));
  document.getElementById('nextProject').addEventListener('click', () => chooseProject(selectedProject + 1));
  const projectSurface = document.getElementById('projectCarouselStage');
  let projectSwipe = null;
  projectSurface.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' || !event.isPrimary || event.target.closest('button, input, label')) return;
    projectSwipe = {x: event.clientX, y: event.clientY, id: event.pointerId};
  });
  projectSurface.addEventListener('pointerup', event => {
    if (!projectSwipe || projectSwipe.id !== event.pointerId) return;
    const dx = event.clientX - projectSwipe.x, dy = event.clientY - projectSwipe.y;
    projectSwipe = null;
    if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.5) chooseProject(selectedProject + (dx < 0 ? 1 : -1));
  });
  projectSurface.addEventListener('pointercancel', () => {projectSwipe = null;});
  renderProject();

  const byId = id => document.getElementById(id);
  const obsSteps = [
    ['THE PROBLEM', 'Six warnings. Where do you start?',
      'Three security tools checked a sample shop. Some warnings describe the same problem.',
      '6 scanner reports', 'From Nmap, ZAP, and Nuclei', 'Make sense of the results'],
    ['THE PRIORITY', 'Start with the exposed debug page.',
      'Obsidian groups repeated reports into three issues. The public debug page deserves attention first because it reveals internal details.',
      '6 reports → 3 issues', 'One priority: internal details visible to visitors', 'Show me what to do'],
    ['THE NEXT STEP', 'Close the exposure. Check again.',
      'Disable public debug output, then check that visitors can no longer see internal details. Keep the evidence from both scanners with the issue.',
      'A clear action, backed by evidence', 'The old-server warning still needs validation; a banner alone does not prove a vulnerability.', 'Try again']
  ];
  let obsStep = 0;
  function renderObsidian() {
    const step = obsSteps[obsStep];
    byId('obsStep').textContent = (obsStep + 1) + ' / 3 · ' + step[0];
    byId('obsTitle').textContent = step[1];
    byId('obsText').textContent = step[2];
    byId('obsResultTitle').textContent = step[3];
    byId('obsResultText').textContent = step[4];
    byId('obsNext').textContent = step[5];
    byId('obsBack').disabled = obsStep === 0;
    byId('obsidianDemo').dataset.step = String(obsStep);
  }
  byId('obsNext').addEventListener('click', () => {obsStep=(obsStep+1)%obsSteps.length;renderObsidian();});
  byId('obsBack').addEventListener('click', () => {obsStep=Math.max(0,obsStep-1);renderObsidian();});
  renderObsidian();
  function updateLocation() {
    const distance = Number(byId('fileLocation').value);
    const original = distance === 0;
    const key = byId('correctKey').checked;
    const unlocked = original && key;
    byId('locationBoard').style.setProperty('--distance', distance + '%');
    byId('locationBoard').classList.toggle('locked', !unlocked);
    byId('fileState').textContent = unlocked ? 'Unlocked' : 'Locked';
    byId('fileContent').textContent = unlocked ? 'Meeting at 10:00' : '•••• •••• ••••';
    byId('locationLabel').textContent = original ? 'At original location' : 'Away from original location';
    byId('geoFeedback').textContent = !key
      ? 'The key is wrong. Returning to the original location alone cannot unlock the file.'
      : original ? 'Correct key + original location: the file opens. Try moving it away.'
      : 'The key is correct, but the location has changed. Move all the way back to unlock the file.';
  }
  byId('fileLocation').addEventListener('input', updateLocation);
  byId('correctKey').addEventListener('change', updateLocation);
  const requests = {
    Safe: ['allowed', 'Allowed', 'Normal visit delivered. The request passes inspection and reaches the website.'],
    Sqli: ['blocked', 'Blocked · SQL injection', 'Stopped at the firewall. This sample tries to change a database query through user input.'],
    Xss: ['blocked', 'Blocked · script injection', 'Stopped at the firewall. This sample tries to insert a script into a page a visitor would open.']
  };
  Object.entries(requests).forEach(([name, detail]) => {
    byId('send' + name).addEventListener('click', () => {
      const board = byId('requestBoard');
      board.classList.toggle('allowed', detail[0] === 'allowed');
      board.classList.toggle('blocked', detail[0] === 'blocked');
      byId('requestPacket').textContent = detail[1];
      byId('requestArrow').textContent = detail[0] === 'allowed' ? '→' : '×';
      byId('websiteNode').textContent = detail[0] === 'allowed' ? 'Received' : 'Protected';
      byId('wafFeedback').textContent = detail[2];
    });
  });

  const completeDeck = [...document.querySelectorAll('#credentialDeck article')];
  const credentialFilters = [...document.querySelectorAll('[data-credential-filter]')];
  let deck = completeDeck, selected = 0;
  function renderDeck() {
    completeDeck.forEach(card => {
      const visible = deck.includes(card);
      card.hidden = !visible;
      if (!visible) card.setAttribute('aria-hidden', 'true');
    });
    deck.forEach((card, index) => {
      const slot = (index - selected + deck.length) % deck.length;
      card.style.setProperty('--slot', slot);
      card.style.zIndex = String(deck.length - slot);
      card.style.opacity = slot > 3 ? '0' : String(1 - slot * .18);
      card.style.visibility = slot > 3 ? 'hidden' : 'visible';
      card.dataset.front = String(slot === 0);
      card.inert = slot !== 0;
      card.setAttribute('aria-hidden', String(slot !== 0));
    });
    document.getElementById('credentialCounter').textContent = (selected + 1) + ' / ' + deck.length;
  }
  document.getElementById('previousCredential').addEventListener('click', () => {selected = (selected - 1 + deck.length) % deck.length;renderDeck();});
  document.getElementById('nextCredential').addEventListener('click', () => {selected = (selected + 1) % deck.length;renderDeck();});
  credentialFilters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.credentialFilter;
    credentialFilters.forEach(control => control.setAttribute('aria-pressed', String(control === button)));
    deck = filter === 'all' ? completeDeck : completeDeck.filter(card => card.dataset.kind === filter);
    selected = 0;
    renderDeck();
  }));
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
