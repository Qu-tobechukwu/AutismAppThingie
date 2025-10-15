// Voice Hint toggle
let voiceEnabled = false;
document.getElementById('voice-toggle')?.addEventListener('click', () => {
  voiceEnabled = !voiceEnabled;
  alert('Voice hints ' + (voiceEnabled ? 'enabled' : 'disabled'));
});

// Low Stim toggle
let lowStim = false;
document.getElementById('low-stim-toggle')?.addEventListener('click', () => {
  lowStim = !lowStim;
  document.body.style.backgroundColor = lowStim ? '#f0f7f7' : '#e8f0f2';
});

// Reflections save/load
const reflectionInput = document.getElementById('reflection-input');
const reflectionList = document.getElementById('reflection-list');
document.getElementById('save-reflection')?.addEventListener('click', () => {
  if(reflectionInput.value.trim() === '') return;
  const li = document.createElement('li');
  li.textContent = reflectionInput.value;
  reflectionList.appendChild(li);
  reflectionInput.value = '';
});

// Social cues search
function filterCues() {
  const filter = document.getElementById('cue-search').value.toLowerCase();
  document.querySelectorAll('.cue-card').forEach(card => {
    const title = card.dataset.title.toLowerCase();
    card.style.display = title.includes(filter) ? 'block' : 'none';
  });
}

// Calm Corner Animation
const canvas = document.getElementById('calm-canvas');
if(canvas){
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const circles = Array.from({length: 20}, () => ({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: 10 + Math.random()*20,
    dx: -0.5 + Math.random(),
    dy: -0.5 + Math.random(),
    color: `rgba(${50+Math.random()*100},${150+Math.random()*50},${150+Math.random()*50},0.5)`
  }));

  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    circles.forEach(c => {
      c.x += c.dx;
      c.y += c.dy;
      if(c.x<0||c.x>canvas.width) c.dx*=-1;
      if(c.y<0||c.y>canvas.height) c.dy*=-1;
      ctx.beginPath();
      ctx.arc(c.x,c.y,c.r,0,Math.PI*2);
      ctx.fillStyle = c.color;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}
