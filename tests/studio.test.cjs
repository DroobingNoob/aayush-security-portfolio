const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('dist/studio.html', 'utf8');
const script = fs.readFileSync('dist/assets/studio.js', 'utf8');
const css = fs.readFileSync('dist/assets/studio.css', 'utf8');

class Element {
  constructor() {
    this.listeners = {};
    this.attrs = {};
    this.dataset = {};
    this.styles = {};
    this.style = {setProperty:(key,value)=>this.styles[key]=value, removeProperty:key=>delete this.styles[key]};
    this.classes = new Set();
    this.classList = {toggle:(key,force)=>{
      const value = force === undefined ? !this.classes.has(key) : force;
      value ? this.classes.add(key) : this.classes.delete(key);
      return value;
    },contains:key=>this.classes.has(key)};
  }
  addEventListener(type, callback) {(this.listeners[type] ||= []).push(callback);}
  dispatch(type, extra={}) {(this.listeners[type] || []).forEach(callback=>callback({target:this,currentTarget:this,...extra}));}
  setAttribute(key,value) {this.attrs[key]=value;}
  getAttribute(key) {return this.attrs[key];}
  closest() {return null;}
  getBoundingClientRect() {return {top:0,bottom:800,left:0,width:500,height:800};}
}
function setup(reduced=false) {
  const nodes = Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(match=>[match[1],new Element()]));
  const scroller = nodes.studioScroll;
  scroller.scrollTop=0;scroller.clientHeight=800;scroller.scrollHeight=6000;
  const scenes = ['intro','frontend','projects','credentials','delivery','connect'].map((id,index)=>{
    const el = nodes[id];
    el.getBoundingClientRect=()=>({top:index*800-scroller.scrollTop,bottom:(index+1)*800-scroller.scrollTop});
    return el;
  });
  const requests=[];scroller.scrollTo=value=>requests.push(value);
  scroller.querySelectorAll=()=>scenes;
  const cards=Array.from({length:3},()=>new Element());
  const projectSlides=Array.from({length:3},()=>new Element());
  const projectTabs=Array.from({length:3},()=>new Element());
  const projectModels=Array.from({length:3},()=>new Element());
  const hero=new Element();hero.querySelector=()=>new Element();
  const progress=new Element();
  const document={
    getElementById:id=>{assert.ok(nodes[id], 'Missing ID: '+id);return nodes[id];},
    querySelector:selector=>selector==='.hero'?hero:progress,
    querySelectorAll:selector=>({'.tilt-card':cards,'.project-slide':projectSlides,'.project-tab':projectTabs,'.project-model':projectModels,'#credentialDeck article':cards}[selector])
  };
  const frames=[];
  vm.runInNewContext(script,{document,matchMedia:()=>({matches:reduced}),addEventListener:()=>{},requestAnimationFrame:callback=>{frames.push(callback);return frames.length;}});
  return {nodes,scroller,requests,cards,projectSlides,projectTabs,projectModels,flush:()=>{while(frames.length)frames.shift()();}};
}
for(const reduced of [false,true]) {
  const state=setup(reduced);
  const {nodes,scroller,requests,cards,projectSlides,projectTabs,projectModels}=state;
  // Repeated momentum and externally repositioned scrolls must never start a new scroll.
  for(const position of [230,780,1200,803,2700,0]) {
    scroller.scrollTop=position;scroller.dispatch('scroll');state.flush();
  }
  assert.equal(requests.length,0,'Scroll listener must never initiate scrolling');
  nodes.nextChapter.dispatch('click');
  assert.equal(requests.at(-1).top,800);
  assert.equal(requests.at(-1).behavior,reduced?'instant':'smooth');
  nodes.nextCredential.dispatch('click');
  assert.equal(cards[1].dataset.front,'true');
  nodes.previousCredential.dispatch('click');
  assert.equal(cards[0].dataset.front,'true');
  nodes.nextProject.dispatch('click');
  assert.equal(projectTabs[1].attrs['aria-pressed'],'true','Carousel changes the selected project');
  assert.equal(projectSlides[1].attrs['aria-hidden'],'false');
  nodes.combineEvidence.dispatch('click');
  assert.match(nodes.evidenceResult.textContent,/1 issue.*2 supporting sources/);
  nodes.resetEvidence.dispatch('click');
  assert.equal(nodes.combineEvidence.disabled,false);
  for (const [distance,key,expected] of [[0,true,'Unlocked'],[1,true,'Locked'],[100,true,'Locked'],[0,false,'Locked'],[50,false,'Locked'],[0,true,'Unlocked']]) {
    nodes.fileLocation.value=String(distance);nodes.correctKey.checked=key;
    nodes.fileLocation.dispatch('input');
    assert.equal(nodes.fileState.textContent,expected,'Both location and key must match');
  }
  nodes.correctKey.checked=false;nodes.correctKey.dispatch('change');
  assert.equal(nodes.fileState.textContent,'Locked');
  nodes.sendSafe.dispatch('click');
  assert.equal(nodes.websiteNode.textContent,'Received');
  nodes.sendSqli.dispatch('click');
  assert.equal(nodes.websiteNode.textContent,'Protected');
  nodes.sendXss.dispatch('click');
  assert.match(nodes.requestPacket.textContent,/script injection/);
  nodes.sendSafe.dispatch('click');
  assert.equal(nodes.requestBoard.classList.contains('blocked'),false);
  nodes.projectCarouselStage.dispatch('pointerdown',{pointerType:'touch',isPrimary:true,pointerId:9,clientX:180,clientY:40});
  nodes.projectCarouselStage.dispatch('pointerup',{pointerId:9,clientX:80,clientY:45});
  assert.equal(projectTabs[2].attrs['aria-pressed'],'true','Horizontal swipe advances the project carousel');
  nodes.credentialDeck.dispatch('pointerdown',{pointerType:'touch',isPrimary:true,pointerId:1,clientX:180,clientY:40});
  nodes.credentialDeck.dispatch('pointerup',{pointerId:1,clientX:80,clientY:45});
  assert.equal(cards[1].dataset.front,'true','Horizontal touch swipe advances the deck');
  nodes.credentialDeck.dispatch('pointerdown',{pointerType:'touch',isPrimary:true,pointerId:2,clientX:80,clientY:45});
  nodes.credentialDeck.dispatch('pointerup',{pointerId:2,clientX:85,clientY:170});
  assert.equal(cards[1].dataset.front,'true','Vertical gestures remain page scrolling');
  nodes.credentialDeck.dispatch('pointerdown',{pointerType:'touch',isPrimary:true,pointerId:3,clientX:180,clientY:40});
  nodes.credentialDeck.dispatch('pointercancel');
  nodes.credentialDeck.dispatch('pointerup',{pointerId:3,clientX:80,clientY:45});
  assert.equal(cards[1].dataset.front,'true','Canceled gestures do not advance the deck');
}
assert.equal((html.match(/<script/g)||[]).length,1,'A single controller owns Studio');
assert.ok(!/settleTimer|scrollend|setTimeout|scrollIntoView/.test(script),'No trailing scroll feedback loop');
assert.match(css,/#studioScroll\{[^}]*height:100dvh[^}]*overflow-y:auto[^}]*scroll-snap-type:y mandatory/);
assert.match(css,/scroll-snap-align:start;scroll-snap-stop:always/);
console.log('PASS: scroll, chapter navigation, project carousel models, and touch swipe/cancel controls work with normal and reduced motion.');
