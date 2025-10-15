// Initialize Low-Stim, Voice, and Mobile Nav
document.addEventListener('DOMContentLoaded', ()=>{
  const lowBtn = document.getElementById('low-stim-toggle');
  const voiceBtn = document.getElementById('voice-toggle');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.querySelector('.main-nav');

  // Apply stored settings
  if(localStorage.getItem('low-stim')==='true') document.body.classList.add('low-stim');
  window.voiceEnabled = localStorage.getItem('voice-enabled')==='true';

  // Low-Stim toggle
  if(lowBtn) lowBtn.addEventListener('click', ()=>{
    document.body.classList.toggle('low-stim');
    const state = document.body.classList.contains('low-stim');
    localStorage.setItem('low-stim', state?'true':'false');
    if(window.voiceHint) window.voiceHint.info(state?"Low stimulation ON":"Low stimulation OFF");
  });

  // Voice toggle
  if(voiceBtn) voiceBtn.addEventListener('click', ()=>{
    window.voiceEnabled = !window.voiceEnabled;
    localStorage.setItem('voice-enabled', window.voiceEnabled?'true':'false');
    if(window.voiceHint) window.voiceHint.info(window.voiceEnabled?"Voice hints ON":"Voice hints OFF");
  });

  // Mobile nav toggle
  if(navToggle && navMenu){
    navToggle.addEventListener('click', ()=>{
      navMenu.classList.toggle('open');
    });
  }
});

// Voice Hint Functions
window.voiceHint = {
  info: function(msg){
    if(window.voiceEnabled) {
      const utter = new SpeechSynthesisUtterance(msg);
      speechSynthesis.speak(utter);
    }
  },
  challengeDone: function(){ this.info("Challenge completed!"); },
  reflectionSaved: function(){ this.info("Reflection saved."); },
  calmAffirm: function(){ this.info("Take a deep breath and relax."); }
};
