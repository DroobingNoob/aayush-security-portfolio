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
  // Prepared, fictional assessment: no scanners or AI services run in this preview.
  const obsFindings = [
    {title:'Debug page exposed', summary:'Two tools observed the same accessible debug page.',
      evidence:['OBSERVED IN SAMPLE','ZAP: GET /debug → 200 OK\nNuclei: debug-page match on /debug\nResponse: stack trace + internal file paths','Both reports point to the same endpoint and disclosure. They become one issue with two supporting sources.','Observed exposure; further access is not demonstrated.'],
      path:['POSSIBLE IMPACT','Public visitor → debug page → internal details\nFurther compromise → not demonstrated','Internal paths and framework details could help an attacker plan a more targeted attack. This is a possible next step, not proof of a successful attack.','Evidence supports information exposure, not account or database access.'],
      fix:['REMEDIATION','Disable production debug output\nRestrict diagnostic endpoints\nRetest /debug without authentication','Keep detailed errors in protected server logs. Return a generic error to visitors and check that internal paths are no longer exposed.','Success check: unauthenticated visitors cannot retrieve diagnostic details.']},
    {title:'Missing browser protection', summary:'Two reports identify the missing Content Security Policy on the same page.',
      evidence:['OBSERVED IN SAMPLE','ZAP: /account response has no CSP header\nNuclei: missing-csp match on /account','A Content Security Policy tells the browser which sources of scripts and other content are allowed. The sample response does not provide one.','A missing policy alone does not prove script injection is possible.'],
      path:['POSSIBLE IMPACT','Script injection flaw, if present → browser execution\nMissing CSP → fewer layers of protection','This is a hardening gap. It can increase the impact of a separate injection flaw, but neither scanner demonstrated such a flaw in this example.','No proven attack chain: the required injection flaw has not been observed.'],
      fix:['REMEDIATION','Inventory required script and content sources\nTrial a policy in Report-Only mode\nReview violations, then enforce','Develop a policy suited to the application. Test login, account pages, and integrations before enforcing it.','Success check: the policy is present and essential application flows still work.']},
    {title:'Old server banner', summary:'Two version-based reports may describe a patched server. Validate before treating them as a confirmed vulnerability.',
      evidence:['NEEDS VALIDATION','Nmap: older version string in server banner\nNuclei: version-based warning\nSample asset note: security fixes backported','A banner may retain an older version even when security fixes have been applied. The asset note is useful context, but must be checked against installed packages.','Potential false positive; not automatically dismissed.'],
      path:['POSSIBLE IMPACT','Older banner → suspected vulnerable version\nInstalled vulnerable code → not established','The report suggests a vulnerability based on a version string. There is no exploitation evidence, and the sample patch note creates uncertainty.','Do not equate a version match with a confirmed exploitable service.'],
      fix:['VALIDATION FIRST','Check installed package and build\nCompare vendor security advisory\nDocument whether the fix is present','If the fix is missing, patch and retest. If the backport is confirmed, record the supporting evidence when closing the warning.','Success check: a documented patch assessment replaces the banner-only assumption.']}
  ];
  let obsSelected = 0, obsView = 'evidence', obsPublic = true;
  function renderObsidian() {
    const finding = obsFindings[obsSelected], detail = finding[obsView];
    byId('obsFindingTitle').textContent = finding.title;
    byId('obsFindingSummary').textContent = finding.summary;
    ['Evidence','Path','Fix'].forEach((name,index) => byId('obs'+name).setAttribute('aria-pressed', String(obsView === ['evidence','path','fix'][index])));
    obsFindings.forEach((_,index) => byId('obsFinding'+index).setAttribute('aria-pressed', String(index === obsSelected)));
    byId('obsDetailLabel').textContent = detail[0];
    byId('obsEvidenceText').textContent = detail[1];
    byId('obsDetailText').textContent = detail[2];
    byId('obsVerdict').textContent = detail[3];
    byId('obsPublic').setAttribute('aria-pressed', String(obsPublic));
    byId('obsLab').setAttribute('aria-pressed', String(!obsPublic));
    byId('obsPriority0').textContent = obsPublic ? 'INVESTIGATE FIRST' : 'FIX BEFORE RELEASE';
    byId('obsPriority1').textContent = obsPublic ? 'HARDENING' : 'PREPARE FOR RELEASE';
    byId('obsContextNote').textContent = obsPublic
      ? 'Public exposure makes the debug page the first issue to investigate.'
      : 'In this isolated lab scenario, immediate exposure is lower. The findings remain: fix them before making the app public.';
  }
  function openObsidian(open) {
    byId('obsRaw').hidden = open;
    byId('obsAssessment').hidden = !open;
    byId('obsAnalyze').hidden = open;
    byId('obsReset').hidden = !open;
    byId('obsInstruction').textContent = open
      ? 'Choose an issue, inspect its evidence, then explore the impact and next action. Try changing the target context.'
      : 'Start with six reports from three scanners. See how Obsidian turns them into an investigation.';
    obsSelected = 0; obsView = 'evidence'; obsPublic = true;
    renderObsidian();
    byId(open ? 'obsFinding0' : 'obsAnalyze').focus({preventScroll:true});
  }
  byId('obsAnalyze').addEventListener('click', () => openObsidian(true));
  byId('obsReset').addEventListener('click', () => openObsidian(false));
  obsFindings.forEach((_,index) => byId('obsFinding'+index).addEventListener('click', () => {obsSelected=index;obsView='evidence';renderObsidian();}));
  ['Evidence','Path','Fix'].forEach((name,index) => byId('obs'+name).addEventListener('click', () => {obsView=['evidence','path','fix'][index];renderObsidian();}));
  byId('obsPublic').addEventListener('click', () => {obsPublic=true;renderObsidian();});
  byId('obsLab').addEventListener('click', () => {obsPublic=false;renderObsidian();});
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
  const credentialIndex = [...document.querySelectorAll('[data-credential-index]')];
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
    credentialIndex.forEach((button, index) => {
      const card = completeDeck[index];
      const visible = deck.includes(card);
      button.hidden = !visible;
      button.setAttribute('aria-pressed', String(card === deck[selected]));
    });
    document.getElementById('credentialCounter').textContent = (selected + 1) + ' / ' + deck.length;
  }
  document.getElementById('previousCredential').addEventListener('click', () => {selected = (selected - 1 + deck.length) % deck.length;renderDeck();});
  document.getElementById('nextCredential').addEventListener('click', () => {selected = (selected + 1) % deck.length;renderDeck();});
  credentialIndex.forEach((button, index) => button.addEventListener('click', () => {
    const position = deck.indexOf(completeDeck[index]);
    if (position >= 0) {selected = position;renderDeck();}
  }));
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
