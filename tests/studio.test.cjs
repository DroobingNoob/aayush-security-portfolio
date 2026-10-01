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
    }};
  }
  addEventListener(type, callback) {(this.listeners[type] ||= []).push(callback);}
  dispatch(type, extra={}) {(this.listeners[type] || []).forEach(callback=>callback({target:this,currentTarget:this,...extra}));}
  setAttribute(key,value) {this.attrs[key]=value;}
  getAttribute(key) {return this.attrs[key];}
  getBoundingClientRect() {return {top:0,bottom:800,left:0,width:500,height:800};}
}
function setup(reduced=false) {
  const nodes = Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(match=>[match[1],new Element()]));
  const scroller = nodes.studioScroll;
  scroller.scrollTop=0;scroller.clientHeight=800;scroller.scrollHeight=6000;
  const scenes = ['intro','frontend','obsidian','projects','credentials','delivery','connect'].map((id,index)=>{
    const el = nodes[id];
    el.getBoundingClientRect=()=>({top:index*800-scroller.scrollTop,bottom:(index+1)*800-scroller.scrollTop});
    return el;
  });
  const requests=[];scroller.scrollTo=value=>requests.push(value);
  scroller.querySelectorAll=()=>scenes;
  const layers=Array.from({length:3},(_,index)=>{
    const el=new Element();el.querySelector=()=>({textContent:'Layer '+index});return el;
  });
  const cards=Array.from({length:3},()=>new Element());
  const buttons=[new Element(),new Element()];
  buttons.forEach((el,index)=>el.setAttribute('aria-controls','project-note-'+(index+1)));
  const hero=new Element();hero.querySelector=()=>new Element();
  const progress=new Element();
  const document={
    getElementById:id=>{assert.ok(nodes[id], 'Missing ID: '+id);return nodes[id];},
    querySelector:selector=>selector==='.hero'?hero:progress,
    querySelectorAll:selector=>({'.tilt-card':cards,'.project-action':buttons,'.system-layer':layers,'#credentialDeck article':cards}[selector])
  };
  const frames=[];
  vm.runInNewContext(script,{document,matchMedia:()=>({matches:reduced}),addEventListener:()=>{},requestAnimationFrame:callback=>{frames.push(callback);return frames.length;}});
  return {nodes,scroller,requests,layers,cards,buttons,flush:()=>{while(frames.length)frames.shift()();}};
}
for(const reduced of [false,true]) {
  const state=setup(reduced);
  const {nodes,scroller,requests,layers,cards,buttons}=state;
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
  layers[0].dispatch('click');
  assert.equal(layers[0].attrs['aria-pressed'],'true');
  assert.equal(layers[2].attrs['aria-pressed'],'false');
  nodes.explodeLayers.dispatch('click');
  assert.equal(nodes.explodeLayers.attrs['aria-pressed'],'true');
  nodes.rotation.value='24';nodes.rotation.dispatch('input');
  assert.equal(nodes.layerStack.styles['--rotation'],'24deg');
  buttons[0].dispatch('click');
  assert.equal(nodes['project-note-1'].hidden,false);
  buttons[0].dispatch('click');
  assert.equal(nodes['project-note-1'].hidden,true);
}
assert.equal((html.match(/<script/g)||[]).length,1,'A single controller owns Studio');
assert.ok(!/settleTimer|scrollend|setTimeout|scrollIntoView/.test(script),'No trailing scroll feedback loop');
assert.match(css,/#studioScroll\{[^}]*height:100dvh[^}]*overflow-y:auto[^}]*scroll-snap-type:y mandatory/);
assert.match(css,/scroll-snap-align:start;scroll-snap-stop:always/);
console.log('PASS: scroll has no feedback loop; chapter navigation, project layers, rotation, deck, and disclosures work with normal and reduced motion.');
