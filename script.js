// ---------- Voice Hints ----------
function voiceHint(text){
    const voiceEnabled = localStorage.getItem("voiceHints") !== "false"; // default on
    if(!voiceEnabled) return;
    if('speechSynthesis' in window){
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'en-US';
        window.speechSynthesis.speak(msg);
    }
}

// ---------- Notes ----------
function saveNotes(){
    const notes = document.getElementById("userNotes");
    if(notes){
        localStorage.setItem("userNotes", notes.value);
        alert("Notes saved!");
        voiceHint("Notes saved.");
    }
}

function clearNotes(){
    const notes = document.getElementById("userNotes");
    if(notes){
        if(confirm("Clear all notes?")){
            notes.value = "";
            localStorage.removeItem("userNotes");
            voiceHint("Notes cleared.");
        }
    }
}

// ---------- Progress ----------
function updateProgress(){
    const daily = localStorage.getItem('dailyCompleted') || 0;
    const professional = localStorage.getItem('professionalCompleted') || 0;
    const social = localStorage.getItem('socialCompleted') || 0;

    const dp = document.getElementById('dailyProgress');
    if(dp) dp.innerText = daily + " / 3 completed";

    const pp = document.getElementById('professionalProgress');
    if(pp) pp.innerText = professional + " / 3 completed";

    const sp = document.getElementById('socialProgress');
    if(sp) sp.innerText = social + " / 3 completed";
}

// ---------- Calm Corner Animation ----------
function calmCornerAnimation(){
    const canvas = document.getElementById('calmCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const circles = [];
    const colors = ['#A7D9C2','#CDEEDD','#DDF0E8','#B2E2D0'];

    for(let i=0;i<15;i++){
        circles.push({
            x:Math.random()*canvas.width,
            y:Math.random()*canvas.height,
            r:Math.random()*25+10,
            dx:(Math.random()-0.5)*1,
            dy:(Math.random()-0.5)*1,
            color: colors[Math.floor(Math.random()*colors.length)]
        });
    }

    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        circles.forEach(c=>{
            ctx.beginPath();
            ctx.arc(c.x,c.y,c.r,0,Math.PI*2);
            ctx.fillStyle = c.color;
            ctx.fill();
            c.x += c.dx;
            c.y += c.dy;
            if(c.x<0||c.x>canvas.width) c.dx*=-1;
            if(c.y<0||c.y>canvas.height) c.dy*=-1;
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// ---------- App Installation ----------
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault();
    deferredPrompt = e;
    if(installBtn) installBtn.style.display = 'inline-block';
});

if(installBtn){
    installBtn.addEventListener('click', async ()=>{
        installBtn.style.display = 'none';
        if(deferredPrompt){
            deferredPrompt.prompt();
            const choice = await deferredPrompt.userChoice;
            if(choice.outcome==='accepted') console.log('User installed app');
            deferredPrompt = null;
        }
    });
}

// ---------- Load Settings on all pages ----------
window.addEventListener('DOMContentLoaded', ()=>{
    // Update progress if progress page
    updateProgress();

    // Load saved notes if notes page
    const notes = document.getElementById("userNotes");
    if(notes){
        const saved = localStorage.getItem("userNotes");
        if(saved) notes.value = saved;
    }

    // Start calm corner animation if on that page
    if(document.getElementById('calmCanvas')) calmCornerAnimation();
});
