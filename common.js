/* common.js - Social Ease app logic (mobile-first) */

/* ---------- Utilities & Maps ---------- */
const keywordsMap = {
  "eye": ["eye","look","gaze","glance","stare"],
  "conversation": ["talk","speak","chat","question","conversation","opener"],
  "small": ["small talk","chat","brief","short"],
  "listen": ["listen","attention","hear","nod","active","repeat"],
  "nonverbal": ["gesture","body language","smile","nod","posture","expression"],
  "workplace": ["work","office","job","colleagues","manager","tasks","multitask"],
  "stress": ["stress","overwhelm","burnout","pressure","anxiety","worry"],
  "sensory": ["noise","light","touch","smell","sensory","stimuli","overload"],
  "masking": ["mask","pretend","hide","masking","adapt"],
  "emotions": ["feel","emotion","happy","sad","frustrated","angry","excited"],
  "relationship": ["partner","so","friend","communication","understand","support"]
};

const sensoryTips = {
  workplace: [
    "Use noise-cancelling headphones if the office is loud.",
    "Ask for a quieter desk or flexible options.",
    "Work in short focused blocks (e.g., 25min) with breaks.",
    "Use a short script to ask for help: 'Can I check a quick detail?'"
  ],
  family: [
    "Choose a seat near an exit and set a time limit.",
    "Bring a small calming object (fidget).",
    "Tell one trusted person you may need breaks."
  ],
  party: [
    "Arrive with one supportive person if possible.",
    "Plan short breaks outside or in a quiet room.",
    "Sit near exits; avoid standing near loud speakers."
  ],
  public: [
    "Go at quieter times when possible.",
    "Use headphones or earplugs.",
    "Plan route and escape options."
  ],
  new: [
    "Observe for a few minutes before engaging.",
    "Have an exit plan and a calming routine ready.",
    "Set one simple goal (e.g., say 'hi') and leave when ready."
  ]
};

const defaultChallenges = {
  workplace: [
    "Greet one colleague with a smile and a short greeting.",
    "Work in a focused block using a timer, then take a break.",
    "Identify one quiet spot you can use if overwhelmed."
  ],
  family: [
    "Arrive with a clear plan (e.g., stay 1 hour).",
    "Take a short outdoor break if overwhelmed."
  ],
  party: [
    "Introduce yourself to one person and ask a question.",
    "Step outside for a short break when needed."
  ],
  public: [
    "Plan a less busy time to go if possible.",
    "Use headphones and choose seating away from crowds."
  ],
  new: [
    "Observe for 5 minutes to get a sense of the place.",
    "Locate exits and a quiet spot before interacting."
  ]
};

/* ---------- Settings helpers ---------- */
function getSetting(k, defaultVal){
  const v = localStorage.getItem(k);
  if(v === null) return defaultVal;
  if(v === 'true') return true;
  if(v === 'false') return false;
  return v;
}
function setSetting(k, v){ localStorage.setItem(k, v); }

/* ---------- Voice helpers ---------- */
function isVoiceOn(){ return getSetting('voice-enabled', false); }
function isLowStim(){ return getSetting('low-stim', false); }
function areAnimationsOn(){ return getSetting('animations-enabled', true); }

function simplifyText(text){
  if(!text) return text;
  const cut = text.split(/[.:(]/)[0];
  return cut;
}

function speak(text){
  if(!('speechSynthesis' in window)) return;
  if(!isVoiceOn()) return;
  const msg = isLowStim() ? simplifyText(text) : text;
  const u = new SpeechSynthesisUtterance(msg);
  u.rate = 0.92; u.pitch = 1; u.volume = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
window.voiceHint = {
  info: (t)=> speak(t),
  challengeDone: ()=> speak("Nice job. Challenge completed."),
  reflectionSaved: ()=> speak("Reflection saved."),
  calmAffirm: ()=> speak("Take a slow breath in. Hold. Breathe out.")
};

/* ---------- Onboarding (first-run) ---------- */
function showOnboardingIfNeeded(){
  const seen = localStorage.getItem('seenOnboard');
  if(seen === 'true') return;
  // build onboarding modal
  const modal = document.createElement('div');
  modal.className = 'modal'; modal.id = 'onboard-modal';
  modal.innerHTML = `
    <div class="modal-panel">
      <div class="modal-header"><div style="font-weight:800">Welcome to Social Ease</div><div class="close-btn" role="button" id="onboard-close">✕</div></div>
      <div class="modal-body">
        <p>This is your personal companion for social events. Use Challenges, Social Cues, Calm Corner, and Reflections to practice and track progress.</p>
        <ol style="margin-top:8px;padding-left:18px">
          <li>Explore Challenges for event-based steps</li>
          <li>Use Social Cues to practice short examples</li>
          <li>Open Calm Corner when overwhelmed</li>
          <li>Save reflections and track progress</li>
        </ol>
        <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
          <button id="onboard-gotit" class="pill-btn">Got it</button>
          <button id="onboard-tour" class="pill-btn outline">Take a quick tour</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.style.display = 'block';
  document.getElementById('onboard-close').addEventListener('click', ()=> { dismissOnboard(); });
  document.getElementById('onboard-gotit').addEventListener('click', ()=> dismissOnboard());
  document.getElementById('onboard-tour').addEventListener('click', ()=> {
    // short guided voice tour if voice enabled
    speak('Tour: Open Challenges to practice. Open Social Cues to search examples. Use Calm Corner to relax.');
    dismissOnboard();
  });
}
function dismissOnboard(){ 
  const m = document.getElementById('onboard-modal'); 
  if(m) m.remove(); 
  localStorage.setItem('seenOnboard','true'); 
}

/* ---------- Modal (sensory) ---------- */
function showSensoryTips(eventType){
  const tips = sensoryTips[eventType] || ["No tips available for this event."];
  const low = isLowStim();
  const modal = document.getElementById('modal') || createModalContainer();
  modal.innerHTML = '';
  const panel = document.createElement('div'); panel.className = 'modal-panel';
  panel.innerHTML = `
    <div class="modal-header" style="${low ? 'background:#e6f5ee;color:#123;' : ''}">
      <div style="font-weight:800">${low ? 'Tips' : 'Sensory Tips — ' + capitalize(eventType)}</div>
      <div class="close-btn" role="button" onclick="closeModal()">✕</div>
    </div>
    <div class="modal-body">
      <ul style="${low ? 'list-style:none;padding:8px;margin:0;color:#123;' : ''}">
        ${tips.map(t=> `<li>${escapeHtml(t)}</li>`).join('')}
      </ul>
    </div>
  `;
  modal.appendChild(panel); modal.style.display='block'; modal.setAttribute('aria-hidden','false');
  if(isVoiceOn()) speak(low ? 'Tips' : `Sensory tips for ${eventType}`);
}
function closeModal(){ const m = document.getElementById('modal'); if(!m) return; m.style.display='none'; m.innerHTML=''; m.setAttribute('aria-hidden','true'); }
function createModalContainer(){ const m = document.createElement('div'); m.id='modal'; m.className='modal'; document.body.appendChild(m); return m; }

/* ---------- Social cues search + highlight ---------- */
function escapeRegExp(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function normalize(s){ return (s||'').toString().toLowerCase().trim(); }

function filterCues(){
  const q = normalize(document.getElementById('cue-search')?.value || '');
  document.querySelectorAll('.cue-card').forEach(card=>{
    const original = card.dataset.original || card.innerHTML;
    if(!card.dataset.original) card.dataset.original = original;
    const title = normalize(card.dataset.title || card.querySelector('h3')?.innerText || '');
    let matched = false;
    if(q && title.includes(q)) matched = true;
    if(!matched && q){
      // check keywords map
      Object.values(keywordsMap).forEach(arr => { if(arr.some(w=> w.includes(q))) matched = true; });
    }
    if(!q){
      card.style.display = 'block';
      card.innerHTML = original;
    } else if(matched){
      // highlight matches and keywords
      let html = original;
      const reQ = new RegExp(`(${escapeRegExp(q)})`, 'gi');
      html = html.replace(reQ, '<span class="highlight">$1</span>');
      Object.values(keywordsMap).forEach(words=>{
        words.forEach(w=>{
          const re = new RegExp(`(${escapeRegExp(w)})`, 'gi');
          html = html.replace(re, '<span class="highlight">$1</span>');
        });
      });
      card.innerHTML = html;
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
      card.innerHTML = original;
    }
  });
}

/* ---------- Reflections (save/load) ---------- */
function saveReflectionObj(obj){
  const arr = JSON.parse(localStorage.getItem('reflections') || '[]');
  arr.push(obj);
  localStorage.setItem('reflections', JSON.stringify(arr));
  if(isVoiceOn()) speak('Reflection saved.');
}
function loadReflectionsUI(){
  const list = document.getElementById('reflection-list');
  if(!list) return;
  const arr = JSON.parse(localStorage.getItem('reflections') || '[]');
  list.innerHTML = '';
  arr.slice().reverse().forEach(r=>{
    const li = document.createElement('li'); li.className='card';
    const date = new Date(r.ts || Date.now()).toLocaleString();
    li.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;"><div><strong>${escapeHtml(r.tag||'General')}</strong><div class="muted" style="font-size:12px">${date}</div></div></div>
      <div style="margin-top:8px">${escapeHtml(r.text)}</div>`;
    const del = document.createElement('button'); del.className='pill-btn small outline'; del.style.marginTop='8px'; del.textContent='Delete';
    del.addEventListener('click', ()=> {
      if(!confirm('Delete this reflection?')) return;
      const current = JSON.parse(localStorage.getItem('reflections')||'[]');
      const newArr = current.filter(item => !(item.ts===r.ts && item.text===r.text));
      localStorage.setItem('reflections', JSON.stringify(newArr));
      loadReflectionsUI();
    });
    li.appendChild(del);
    list.appendChild(li);
  });
}

/* ---------- Progress storage ---------- */
function storeCompleted(eventKey, idx, done){
  const key = `completed-${eventKey}`;
  let arr = JSON.parse(localStorage.getItem(key) || '[]');
  if(done && !arr.includes(idx)) arr.push(idx);
  if(!done) arr = arr.filter(i=> i!==idx);
  localStorage.setItem(key, JSON.stringify(arr));
  updateProgressUI();
}
function updateProgressUI(){
  const container = document.getElementById('progress-grid');
  if(!container) return;
  container.innerHTML = '';
  const events = Object.keys(sensoryTips);
  events.forEach(ev=>{
    const done = JSON.parse(localStorage.getItem(`completed-${ev}`) || '[]');
    const total = defaultChallenges[ev] ? defaultChallenges[ev].length : 3;
    const percent = Math.round((done.length / total) * 100);
    const card = document.createElement('div'); card.className='progress-card card';
    card.innerHTML = `<div style="font-weight:800;text-transform:capitalize">${ev}</div>
      <div style="font-size:18px;margin-top:8px">${done.length}/${total} completed</div>
      <div style="margin-top:8px"><div style="height:10px;background:#eef9f7;border-radius:8px;overflow:hidden">
        <div style="width:${percent}%;height:100%;background:linear-gradient(90deg,#A2D9CE,#AED6F1)"></div>
      </div></div>`;
    container.appendChild(card);
  });
}

/* ---------- Calm corner canvas animation ---------- */
let calmAnimationId = null;
let calmCircles = [];
function startCalmAnimation(){
  if(!areAnimationsOn()) return;
  const canvas = document.getElementById('calm-canvas'); if(!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
  resize(); window.addEventListener('resize', resize);
  calmCircles = Array.from({length: 12}, ()=>({
    x: Math.random()*canvas.width, y: Math.random()*canvas.height,
    r: 20 + Math.random()*60, vx: (-0.15 + Math.random()*0.3), vy: -0.2 - Math.random()*0.6,
    color: `rgba(${120+Math.random()*80},${180+Math.random()*40},${150+Math.random()*40},${0.2+Math.random()*0.35})`
  }));
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    calmCircles.forEach(c=>{
      c.x += c.vx; c.y += c.vy;
      if(c.y + c.r < -50) { c.y = canvas.height + 80; c.x = Math.random()*canvas.width; }
      if(c.x < -100) c.x = canvas.width + 100;
      if(c.x > canvas.width + 100) c.x = -100;
      ctx.beginPath(); ctx.arc(c.x,c.y,c.r,0,Math.PI*2); ctx.fillStyle=c.color; ctx.fill();
    });
    calmAnimationId = requestAnimationFrame(draw);
  }
  if(calmAnimationId) cancelAnimationFrame(calmAnimationId);
  draw();
}
function stopCalmAnimation(){ if(calmAnimationId) cancelAnimationFrame(calmAnimationId); calmAnimationId = null; const canvas = document.getElementById('calm-canvas'); if(canvas){ const ctx = canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); } }

/* ---------- Settings wiring ---------- */
function initSettingsPage(){
  const swLow = document.getElementById('switch-low');
  const swVoice = document.getElementById('switch-voice');
  const swAnim = document.getElementById('switch-anim');

  if(swLow) swLow.checked = isLowStim();
  if(swVoice) swVoice.checked = isVoiceOn();
  if(swAnim) swAnim.checked = areAnimationsOn();

  if(swLow) swLow.addEventListener('change', ()=> {
    setSetting('low-stim', swLow.checked); document.body.classList.toggle('low-stim', swLow.checked);
    speak(swLow.checked ? 'Low stimulation enabled' : 'Low stimulation disabled');
    if(swLow.checked) stopCalmAnimation(); else startCalmAnimation();
  });
  if(swVoice) swVoice.addEventListener('change', ()=> { setSetting('voice-enabled', swVoice.checked); speak(swVoice.checked ? 'Voice hints enabled' : 'Voice hints disabled'); });
  if(swAnim) swAnim.addEventListener('change', ()=> {
    setSetting('animations-enabled', swAnim.checked);
    if(!swAnim.checked){ stopCalmAnimation(); document.body.classList.add('no-anim'); } else { document.body.classList.remove('no-anim'); startCalmAnimation(); }
  });

  const reset = document.getElementById('reset-data');
  if(reset) reset.addEventListener('click', ()=> {
    if(!confirm('Reset all progress and reflections?')) return;
    Object.keys(localStorage).forEach(k=>{ if(k.startsWith('completed-') || k === 'reflections') localStorage.removeItem(k); });
    alert('Cleared progress & reflections.');
    loadReflectionsUI(); updateProgressUI();
  });
}

/* ---------- Helpers & Init ---------- */
function escapeHtml(s){ return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function capitalize(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

/* DOM ready */
document.addEventListener('DOMContentLoaded', ()=>{
  // onboarding
  showOnboardingIfNeeded();

  // nav toggle wires
  document.getElementById('nav-toggle')?.addEventListener('click', ()=>{
    document.querySelector('.main-nav')?.classList.toggle('open');
  });

  // set body states
  if(isLowStim()) document.body.classList.add('low-stim');
  if(!areAnimationsOn()) document.body.classList.add('no-anim');

  // wire header toggles present on pages
  document.querySelectorAll('#low-stim-toggle').forEach(btn => { btn.addEventListener('click', ()=> {
    const newVal = !isLowStim(); setSetting('low-stim', newVal); document.body.classList.toggle('low-stim', newVal); speak(newVal ? 'Low stimulation mode activated' : 'Low stimulation mode deactivated'); if(newVal) stopCalmAnimation(); else if(areAnimationsOn()) startCalmAnimation(); }); });

  document.querySelectorAll('#voice-toggle').forEach(btn => { btn.addEventListener('click', ()=> {
    const newVal = !isVoiceOn(); setSetting('voice-enabled', newVal); speak(newVal ? 'Voice hints on' : 'Voice hints off'); btn.setAttribute('aria-pressed', newVal); }); });

  // init settings page if present
  initSettingsPage();

  // load reflections/progress where relevant
  if(document.body.dataset.page === 'reflections') loadReflectionsUI();
  if(document.body.dataset.page === 'progress') updateProgressUI();

  // start calm if we're on calm page
  if(document.body.dataset.page === 'calm-corner' && areAnimationsOn()) startCalmAnimation();

  // store original innerHTML of cue cards for highlighting
  document.querySelectorAll('.cue-card').forEach(c=> { if(!c.dataset.original) c.dataset.original = c.innerHTML; });

  // close modal on background click
  document.addEventListener('click', (e)=> { const modal = document.getElementById('modal'); if(modal && modal.style.display === 'block' && e.target === modal) closeModal(); });
});
