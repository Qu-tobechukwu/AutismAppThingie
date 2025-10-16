/* ====== Install PWA / Add to Home Screen ====== */
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn && installBtn.addEventListener('click', async () => {
  installBtn.style.display = 'none';
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to install: ${outcome}`);
  deferredPrompt = null;
});

/* Modal functionality */
document.querySelectorAll('.close').forEach(span => {
  span.addEventListener('click', () => {
    span.closest('.modal').style.display = 'none';
  });
});
document.querySelectorAll('#confirmInstall').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').style.display = 'none';
  });
});

/* ====== Navigation & Voice Hints ====== */
// Optional: can add consistent nav between pages

/* Function to play voice hint if toggled on */
function voiceHint(text){
  const voiceEnabled = JSON.parse(localStorage.getItem('voiceHints') || 'true');
  if('speechSynthesis' in window && voiceEnabled){
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }
}

/* Low Stim Mode toggle can also be accessed globally */
function lowStimMode(active){
  // Example: remove animated circles or bright colors if needed
  if(active){
    document.querySelectorAll('.circle').forEach(c => c.style.display='none');
  } else {
    document.querySelectorAll('.circle').forEach(c => c.style.display='block');
  }
}

// Load settings globally
const lowStim = JSON.parse(localStorage.getItem('lowStim') || 'false');
lowStimMode(lowStim);
