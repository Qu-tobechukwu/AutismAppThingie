// Initialize Low-Stim and Voice
document.addEventListener('DOMContentLoaded', ()=>{
  const lowBtn = document.getElementById('low-stim-toggle');
  const voiceBtn = document.getElementById('voice-toggle');

  // Apply stored settings
  if(localStorage.getItem('low-stim')==='true') document.body.classList.add('low-stim');
  if(localStorage.getItem('voice-enabled')!=='true') window.voiceEnabled=false;
  else window.voiceEnabled=true;

  // Button listeners
  if(lowBtn) lowBtn.addEventListener('click', ()=>{
    document.body.classList.toggle('low-stim');
    const state = document.body.classList.contains('low-stim');
    localStorage.setItem('low-stim', state?'true':'false');
    if(window.voiceHint) window.voiceHint.info(state?"Low stimulation ON":"Low stimulation OFF");
  });
  if(voiceBtn) voiceBtn.addEventListener('click', ()=>{
    window.voiceEnabled = !window.voiceEnabled;
    localStorage.setItem('voice-enabled', window.voiceEnabled?'true':'false');
    if(window.voiceHint) window.voiceHint.info(window.voiceEnabled?"Voice hints ON":"Voice hints OFF");
  });
});

// Voice Hint Functions (stub for accessibility)
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
