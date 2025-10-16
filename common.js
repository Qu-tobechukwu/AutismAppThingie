/* common.js - Shared logic for Social Ease
   - Low-Stim, Voice Hints
   - Sensory tips modal
   - Social cues fuzzy search & highlight
   - Reflections storage
   - Progress tracking
   - Calm Corner animation (canvas)
*/

/* === State & maps === */
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
    "Ask for a quieter desk or flexible work options.",
    "Use a timer to break tasks into short focused sessions.",
    "Prepare a short script to ask for help: 'Can I check a quick detail with you?'"
  ],
  family: [
    "Choose a seat near an exit and plan a time limit.",
    "Bring a small calming object (fidget, soft cloth).",
    "Let a trusted family member know if you may need breaks."
  ],
  party: [
    "Arrive with a friend for support.",
    "Plan regular short breaks outside or in a quiet room.",
    "Sit near exits and avoid loud speakers."
  ],
  public: [
    "Go at quieter times where possible.",
    "Use headphones to reduce background noise.",
    "Plan route and escape options before you go."
  ],
  new: [
    "Observe the space first for a few minutes.",
    "Have an exit plan and a calming routine ready.",
    "Tell yourself one simple goal (e.g. say hi) and leave when ready."
  ]
};

/* === Utility: storage-backed settings === */
function getSetting(key, defaultVal){
  const v = localStorage.getItem(key);
  if(v===null) return defaultVal;
  return v === 'true' ? true : v === 'false' ? false : v;
}

/* === Voice helpers === */
function isVoiceOn(){ return getSetting('voice-enabled', false); }
function isLowStim(){ return getSetting('low-stim', false); }
function areAnimationsOn(){ return getSetting('animations-enabled', true); }

function simplifyText(text){
  // Very simple simplifier: cut at colon or parentheses, keep first sentence
  let t = text.split(/[:(]/)[0];
  const first = t.split('. ')[0];
  return first;
}

function speak(text){
  if(!('speechSynthesis' in window)) return;
  if(!isVoiceOn()) return;
  const message = isLowStim() ? simplifyText(text) : text;
  const u = new SpeechSynthesisUtterance(message);
  u.rate = 0.92;
  u.pitch = 1;
  u.volume = 0.8;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

window.voiceHint = {
  info: (txt)=> speak(txt),
  challengeDone: ()=> speak("Nice job. Challenge completed."),
  reflectionSaved: ()=> speak("Reflection saved."),
  calmAffirm: ()=> speak("Take a slow breath in. Hold. Breathe out.")
};

/* === Nav toggle (mobile) === */
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.querySelector('.main-nav');
  if(navToggle && nav){
    navToggle.addEventListener('click', ()=> nav.classList.toggle('open'));
  }

  // Apply stored settings visually
  if(isLowStim()) document.body.classList.add('low-stim');
  if(!areAnimationsOn()) document.body.classList.add('no-anim');

  // wire header toggles (they exist on many pages)
  document.querySelectorAll('#low-stim-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const newVal = !isLowStim();
      localStorage.setItem('low-stim', newVal);
      document.body.classList.toggle('low-stim', newVal);
      speak(newVal ? "Low stimulation mode activated." : "Low stimulation mode deactivated.");
      // If Low-Stim on, stop calm animation
      if(newVal) stopCalmAnimation(); else if(areAnimationsOn()) startCalmAnimation();
    });
    // set aria-pressed
    btn.setAttribute('aria-pressed', isLowStim());
  });

  document.querySelectorAll('#voice-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const newVal = !isVoiceOn();
      localStorage.setItem('voice-enabled', newVal);
      btn.setAttribute('aria-pressed', newVal);
      speak(newVal ? "Voice hints turned on." : "Voice hints turned off.");
    });
    btn.setAttribute('aria-pressed', isVoiceOn());
  });

  // Initialize switches on settings page if present
  initSettingsPage();

  // Load progress UI if on progress page
  if(document.body.dataset.page === 'progress') updateProgressUI();

  // Start calm animation if we're on calm page and animations allowed
  if(document.body.dataset.page === 'calm-corner' && areAnimationsOn()){
    startCalmAnimation();
  }

  // Setup modal close on outside click
  document.addEventListener('click', (e)=>{
    const modal = document.getElementById('modal');
    if(modal && modal.style.display === 'block' && e.target === modal) closeModal();
  });

  // Initialize social cue original HTML storage for highlighting
  document.querySelectorAll('.cue-card').forEach(card=>{
    if(!card.dataset.original) card.dataset.original = card.innerHTML;
  });

});

/* === Sensory Tips modal === */
function showSensoryTips(eventType){
  const tips = sensoryTips[eventType] || ["No tips available for this event"];
  const low = isLowStim();
  const modal = document.getElementById('modal');
  if(!modal) return;
  const title = low ? "Tips" : `Sensory Tips — ${eventType.charAt(0).toUpperCase()+eventType.slice(1)}`;
  const listHtml = tips.map(t=> `<li>${t}</li>`).join('');
  const panel = document.createElement('div');
  panel.className = 'modal-panel';
  panel.innerHTML = `
    <div class="modal-header" style="${low ? 'background:#e6f5ee;color:#123;':''}">
      <div>${title}</div><div class="close-btn" role="button" onclick="closeModal()">✕</div>
    </div>
    <div class="modal-body">
      <ul style="${low ? 'list-style:none;padding:8px;margin:0;color:#123;' : ''}">${listHtml}</ul>
    </div>
  `;
  modal.innerHTML = '';
  modal.appendChild(panel);
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden','false');
  if(isVoiceOn()) speak(low ? "Tips" : `Sensory tips for ${eventType}`);
}

function closeModal(){
  const modal = document.getElementById('modal');
  if(!modal) return;
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden','true');
  modal.innerHTML = '';
}

/* === Social cues fuzzy search & highlight === */
function normalize(s){ return (s||'').toString().toLowerCase().trim(); }

function filterCues(){
  const q = normalize(document.getElementById('cue-search')?.value || '');
  document.querySelectorAll('.cue-card').forEach(card=>{
    const original = card.dataset.original || card.innerHTML;
    card.dataset.original = original;
    const title = normalize(card.dataset.title || card.querySelector('h3')?.innerText || '');
    let matched = false;
    // direct title match
    if(q && title.includes(q)) matched = true;
    // keyword map
    if(!matched && q){
      Object.values(keywordsMap).forEach(arr=>{
        if(arr.some(w => w.includes(q))) matched = true;
      });
    }
    // show/hide
    if(!q) {
      card.style.display = 'block';
      card.innerHTML = original;
    } else if(matched){
      // highlight occurrences of q or keywords inside the card
      const re = new RegExp(`(${escapeRegExp(q)})`, 'gi');
      const highlighted = original.replace(re, '<span class="highlight">$1</span>');
      // also map synonyms: highlight keywords that matched
      let html = highlighted;
      Object.values(keywordsMap).forEach(words => {
        words.forEach(w=>{
          const re2 = new RegExp(`(${escapeRegExp(w)})`, 'gi');
          html = html.replace(re2, '<span class="highlight">$1</span>');
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

function escapeRegExp(string) {
  return String(string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* === Reflections (save/load) === */
function saveReflection(obj){
  const cur = JSON.parse(localStorage.getItem('reflections') || '[]');
  cur.push(obj);
  localStorage.setItem('reflections', JSON.stringify(cur));
  if(isVoiceOn()) speak("Reflection saved");
}

function loadReflectionsUI(){
  const list = document.getElementById('reflection-list');
  if(!list) return;
  const arr = JSON.parse(localStorage.getItem('reflections') || '[]');
  list.innerHTML = '';
  arr.slice().reverse().forEach((r, idx)=>{
    const li = document.createElement('li');
    li.className = 'card';
    const date = new Date(r.ts || Date.now()).toLocaleString();
    li.innerHTML = `<strong>${r.tag || 'General'}</strong> <div class="muted" style="font-size:12px">${date}</div><div style="margin-top:8px">${escapeHtml(r.text)}</div>`;
    // delete button
    const del = document.createElement('button'); del.textContent='Delete'; del.className='pill-btn small outline';
    del.addEventListener('click', ()=>{
      if(!confirm('Delete this reflection?')) return;
      const current = JSON.parse(localStorage.getItem('reflections')||'[]');
      // find and remove by ts and text
      const newArr = current.filter(item => !(item.ts===r.ts && item.text===r.text));
      localStorage.setItem('reflections', JSON.stringify(newArr));
      loadReflectionsUI();
    });
    li.appendChild(del);
    list.appendChild(li);
  });
}

function escapeHtml(s){ return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* === Progress: store and show completed challenges per event === */
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
  const events = Object.keys(sensoryTips); // [workplace, family, ...]
  container.innerHTML = '';
  events.forEach(ev=>{
    const done = JSON.parse(localStorage.getItem(`completed-${ev}`) || '[]');
    // total approximated by length of default challenge arrays if exist else 4
    const total = (document.querySelectorAll(`.event-card[data-event="${ev}"]`).length>0) ? 3 : (defaultChallengeCount(ev) || 3);
    const percent = Math.round((done.length / (total||1))*100);
    const card = document.createElement('div');
    card.className = 'progress-card';
    card.innerHTML = `<div style="font-weight:800">${ev.charAt(0).toUpperCase()+ev.slice(1)}</div>
                      <div style="font-size:18px;margin-top:8px">${done.length}/${total} completed</div>
                      <div style="margin-top:8px"><div style="height:10px;background:#e6f7f5;border-radius:8px;overflow:hidden">
                        <div style="width:${percent}%;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent-2));"></div>
                      </div></div>`;
    container.appendChild(card);
  });
}

function defaultChallengeCount(ev){
  // fallback mapping of estimated challenges
  const map = {workplace:3,family:2,party:2,public:2,new:2};
  return map[ev] || 3;
}

function clearAllProgress(){
  if(!confirm('Clear all challenge progress?')) return;
  Object.keys(localStorage).forEach(k=>{
    if(k.startsWith('completed-')) localStorage.removeItem(k);
  });
  updateProgressUI();
}

/* === Calm Corner animation (canvas) === */
let calmAnimationId = null;
let calmCircles = [];
function startCalmAnimation(){
  if(!areAnimationsOn()) return;
  const canvas = document.getElementById('calm-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize(){
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // create circles
  calmCircles = Array.from({length: 12}, ()=>({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: 20 + Math.random()*60,
    vx: (-0.2 + Math.random()*0.4),
    vy: -0.2 - Math.random()*0.6,
    color: `rgba(${130+Math.random()*80},${190+Math.random()*40},${170+Math.random()*40},${0.25+Math.random()*0.35})`,
    rot: Math.random()*360
  }));

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    calmCircles.forEach(c=>{
      c.x += c.vx;
      c.y += c.vy;
      c.rot += 0.1;
      // wrap around vertically
      if(c.y + c.r < -50) { c.y = canvas.height + 80; c.x = Math.random()*canvas.width; }
      if(c.x < -100) c.x = canvas.width + 100;
      if(c.x > canvas.width + 100) c.x = -100;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI*2);
      ctx.fillStyle = c.color;
      ctx.fill();
    });
    calmAnimationId = requestAnimationFrame(draw);
  }
  if(calmAnimationId) cancelAnimationFrame(calmAnimationId);
  draw();
}

function stopCalmAnimation(){
  if(calmAnimationId) cancelAnimationFrame(calmAnimationId);
  calmAnimationId = null;
  // clear canvas
  const canvas = document.getElementById('calm-canvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }
}

/* === Settings page wiring === */
function initSettingsPage(){
  const swLow = document.getElementById('switch-low');
  const swVoice = document.getElementById('switch-voice');
  const swAnim = document.getElementById('switch-anim');

  if(swLow) swLow.checked = isLowStim();
  if(swVoice) swVoice.checked = isVoiceOn();
  if(swAnim) swAnim.checked = areAnimationsOn();

  if(swLow) swLow.addEventListener('change', ()=>{
    const v = swLow.checked;
    localStorage.setItem('low-stim', v);
    document.body.classList.toggle('low-stim', v);
    speak(v ? 'Low stimulation mode enabled' : 'Low stimulation mode disabled');
    if(v) stopCalmAnimation(); else startCalmAnimation();
  });

  if(swVoice) swVoice.addEventListener('change', ()=>{
    const v = swVoice.checked;
    localStorage.setItem('voice-enabled', v);
    speak(v ? 'Voice hints enabled' : 'Voice hints disabled');
  });

  if(swAnim) swAnim.addEventListener('change', ()=>{
    const v = swAnim.checked;
    localStorage.setItem('animations-enabled', v);
    if(!v) { stopCalmAnimation(); document.body.classList.add('no-anim'); }
    else { document.body.classList.remove('no-anim'); startCalmAnimation(); }
  });

  const reset = document.getElementById('reset-data');
  if(reset) reset.addEventListener('click', ()=>{
    if(!confirm('Reset all progress and reflections?')) return;
    Object.keys(localStorage).forEach(k=>{
      if(k.startsWith('completed-') || k === 'reflections') localStorage.removeItem(k);
    });
    alert('Progress & reflections cleared.');
    updateProgressUI();
    loadReflectionsUI();
  });
}

/* === Reflection UI helpers used by pages === */
function loadReflectionsUI(); // defined above
function saveReflection(obj); // defined above

/* === Helper: initialize certain UIs on demand === */
document.addEventListener('DOMContentLoaded', ()=>{
  // load reflection list if on reflections page
  if(document.body.dataset.page === 'reflections') loadReflectionsUI();

  // progress UI
  if(document.body.dataset.page === 'progress') updateProgressUI();

  // render any event challenges if desired (no auto)
});
