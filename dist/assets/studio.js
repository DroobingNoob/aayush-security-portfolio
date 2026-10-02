(() => {
  'use strict';
  const scroller = document.getElementById('studioScroll');
  const scenes = [...scroller.querySelectorAll('.scene')].filter(scene => scene.id !== 'obsidian');
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
  const projectModels = [...document.querySelectorAll('.project-model')];
  const projectRotation = document.getElementById('projectRotation');
  const projectAction = document.getElementById('projectModelAction');
  const projectStatus = document.getElementById('projectModelStatus');
  const projectCounter = document.getElementById('projectCounter');
  const projectCopy = [
    {action: 'Separate architecture layers', active: 'Stack architecture layers', status: 'Three assessment layers, connected in one model.', activeStatus: 'The scanners, normalized evidence, and contextual risk are separated for inspection.'},
    {action: 'Show location boundary', active: 'Hide location boundary', status: 'A user key is paired with the original geographic context.', activeStatus: 'The illuminated boundary represents the location constraint required for decryption.'},
    {action: 'Trace blocked request', active: 'Reset request path', status: 'Each request is inspected before it can reach the destination.', activeStatus: 'The request is diverted at the inspection gate when a threat pattern is found.'}
  ];
  let selectedProject = 0, projectExpanded = false;
  function renderProject() {
    projectSlides.forEach((slide, index) => {
      const activeSlide = index === selectedProject;
      slide.classList.toggle('is-active', activeSlide);
      slide.inert = !activeSlide;
      slide.setAttribute('aria-hidden', String(!activeSlide));
    });
    projectTabs.forEach((tab, index) => tab.setAttribute('aria-pressed', String(index === selectedProject)));
    projectModels.forEach((model, index) => model.classList.toggle('is-expanded', index === selectedProject && projectExpanded));
    const detail = projectCopy[selectedProject];
    projectAction.setAttribute('aria-pressed', String(projectExpanded));
    projectAction.textContent = projectExpanded ? detail.active : detail.action;
    projectStatus.textContent = projectExpanded ? detail.activeStatus : detail.status;
    projectCounter.textContent = (selectedProject + 1) + ' / ' + projectSlides.length;
    projectRotation.value = '-12';
    projectModels[selectedProject].style.setProperty('--project-rotation', '-12deg');
  }
  function chooseProject(index) {
    selectedProject = (index + projectSlides.length) % projectSlides.length;
    projectExpanded = false;
    renderProject();
  }
  projectTabs.forEach((tab, index) => tab.addEventListener('click', () => chooseProject(index)));
  document.getElementById('previousProject').addEventListener('click', () => chooseProject(selectedProject - 1));
  document.getElementById('nextProject').addEventListener('click', () => chooseProject(selectedProject + 1));
  projectRotation.addEventListener('input', event => projectModels[selectedProject].style.setProperty('--project-rotation', event.target.value + 'deg'));
  projectAction.addEventListener('click', () => {projectExpanded = !projectExpanded;renderProject();});
  const projectSurface = document.getElementById('projectCarouselStage');
  let projectSwipe = null;
  projectSurface.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' || !event.isPrimary) return;
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
