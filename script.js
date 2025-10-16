/* ===============================
  Voice Hints
=============================== */
function voiceHint(text){
  const voiceEnabled = JSON.parse(localStorage.getItem('voiceHints') || 'true');
  if(!voiceEnabled) return;
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

/* ===============================
  Service Worker & PWA Install
=============================== */
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log("Service Worker Registered"))
    .catch(err => console.log("SW registration failed: ", err));
}

let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if(installBtn) installBtn.style.display = 'inline-block';
});

if(installBtn){
  installBtn.addEventListener('click', async () => {
    installBtn.style.display = 'none';
    if(deferredPrompt){
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    }
  });
}

/* ===============================
  Desktop Fallback
=============================== */
if(window.innerWidth > 900){
  document.body.innerHTML = `
    <div style="text-align:center;padding:50px;">
      <h1>Social Ease is Mobile Friendly</h1>
      <p>This app is designed for mobile and tablet devices.</p>
      <p>Follow us on <a href="https://www.threads.net" target="_blank">Threads</a> or support us via <a href="https://www.patreon.com" target="_blank">Patreon</a>.</p>
    </div>
  `;
}

/* ===============================
  Low Stim & Voice Hints Toggles
=============================== */
const lowStimToggle = document.getElementById('lowStimToggle');
const voiceHintsToggle = document.getElementById('voiceHintsToggle');

if(lowStimToggle){
  lowStimToggle.checked = JSON.parse(localStorage.getItem('lowStim') || 'false');
  lowStimToggle.addEventListener('change', () => {
    localStorage.setItem('lowStim', lowStimToggle.checked);
    alert("Low Stim Mode is now " + (lowStimToggle.checked ? "ON" : "OFF"));
  });
}

if(voiceHintsToggle){
  voiceHintsToggle.checked = JSON.parse(localStorage.getItem('voiceHints') || 'true');
  voiceHintsToggle.addEventListener('change', () => {
    localStorage.setItem('voiceHints', voiceHintsToggle.checked);
    alert("Voice Hints are now " + (voiceHintsToggle.checked ? "ON" : "OFF"));
  });
}

/* ===============================
  Notes Page
=============================== */
function saveNotes(){
  const notes = document.getElementById('userNotes').value;
  localStorage.setItem('userNotes', notes);
  alert("Notes saved!");
}

function clearNotes(){
  if(confirm("Are you sure you want to clear all notes?")){
    document.getElementById('userNotes').value = "";
    localStorage.removeItem('userNotes');
  }
}

if(document.getElementById('userNotes')){
  document.getElementById('userNotes').value = localStorage.getItem('userNotes') || "";
}

/* ===============================
  Progress Page
=============================== */
function loadProgress(){
  const daily = localStorage.getItem('dailyCompleted') || 0;
  const professional = localStorage.getItem('professionalCompleted') || 0;
  if(document.getElementById('dailyCompleted')) document.getElementById('dailyCompleted').textContent = daily;
  if(document.getElementById('professionalCompleted')) document.getElementById('professionalCompleted').textContent = professional;
}

function resetProgress(){
  if(confirm("Are you sure you want to reset all progress?")){
    localStorage.setItem('dailyCompleted', 0);
    localStorage.setItem('professionalCompleted', 0);
    loadProgress();
  }
}

// Example: function to mark a challenge complete
function completeChallenge(type){
  let current = parseInt(localStorage.getItem(type) || 0);
  localStorage.setItem(type, current+1);
  loadProgress();
}

loadProgress();

/* ===============================
  Calm Corner Animation
=============================== */
if(document.getElementById('calmCanvas')){
  const canvas = document.getElementById('calmCanvas');
  const ctx = canvas.getContext('2d');
  let circles = [];
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for(let i=0;i<30;i++){
    circles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      radius: 10+Math.random()*20,
      dx: (Math.random()-0.5)*1,
      dy: (Math.random()-0.5)*1,
      color: `rgba(167, 217, 194, ${0.2+Math.random()*0.3})`
    });
  }

  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    circles.forEach(c => {
      c.x += c.dx;
      c.y += c.dy;
      if(c.x<0 || c.x>canvas.width) c.dx*=-1;
      if(c.y<0 || c.y>canvas.height) c.dy*=-1;
      ctx.beginPath();
      ctx.arc(c.x,c.y,c.radius,0,Math.PI*2);
      ctx.fillStyle=c.color;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}
