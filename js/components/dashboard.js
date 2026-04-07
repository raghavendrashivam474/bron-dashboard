import { Storage } from '../core/storage.js';
import { SyntheticAudio } from '../core/audio.js';

export function initDashboard() {
    const dashContainer = document.getElementById('master-bento'); // Reusing ID, but it's now dropping a hud inside
    const appContainer = document.querySelector('.app-container');
    const sfxEngine = new SyntheticAudio();
    
    if(!dashContainer) return;

    // --- Cyberpunk Terminal Entrance Stage ---
    const landing = document.createElement('div');
    landing.className = 'minimal-landing';
    landing.innerHTML = `
        <h1 class="landing-title cyber-glitch" data-text=""></h1>
        <p class="landing-subtitle">[AWAITING_AUTHORIZATION]</p>
    `;
    document.body.appendChild(landing);
    document.body.style.overflow = 'hidden';

    const titleObj = landing.querySelector('.landing-title');
    const textToType = "SYSTEM.OS_INITIALIZED";
    let i = 0;
    let typeInterval = setInterval(() => {
        if (i < textToType.length) {
            titleObj.textContent += textToType.charAt(i);
            titleObj.setAttribute('data-text', titleObj.textContent);
            if(i % 3 === 0) sfxEngine.playSFX('click');
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 60);

    landing.addEventListener('click', () => {
        sfxEngine.playSFX('hover');
        landing.style.opacity = '0';
        landing.style.filter = 'blur(10px)';
        setTimeout(() => {
            landing.remove();
            appContainer.classList.add('revealed');
            document.body.style.overflow = '';
        }, 800);
    });

    // --- Core HUD Rendering Engine ---
    function renderHUD() {
        dashContainer.innerHTML = '';
        dashContainer.className = ''; 
        
        const hud = document.createElement('div');
        hud.className = 'hud-container';

        // 1. Decorative Reactor Rings
        hud.innerHTML += `<div class="hud-ring massive"></div>`;
        hud.innerHTML += `<div class="hud-ring outer"></div>`;
        hud.innerHTML += `<div class="hud-ring inner"></div>`;

        // 2. Central Core (Timer Module)
        const core = document.createElement('div');
        core.className = 'hud-core';
        core.innerHTML = `
            <div class="dashboard-timer-display">25:00</div>
            <div class="hud-core-label">[ CORE_UPLINK ]</div>
        `;
        core.addEventListener('click', () => {
            sfxEngine.playSFX('click');
            window.navigateToView('timer-view');
        });
        core.addEventListener('mouseenter', () => sfxEngine.playSFX('hover'));
        hud.appendChild(core);

        // Fetch Live States for Satellites
        let tasks = Storage.get('bron_tasks', []);
        let pendingTasks = tasks.filter(t => !t.completed);
        let pendingCnt = pendingTasks.length; 
        let lastTask = pendingTasks.length > 0 ? pendingTasks[0].text : 'NONE';

        const habits = Storage.get('bron_habits', []);
        let highestStreak = 0;
        let topHabit = 'NONE';
        habits.forEach(h => {
             if(h.completedDays && h.completedDays.length >= highestStreak) {
                 highestStreak = h.completedDays.length;
                 topHabit = h.title;
             }
        });

        let notes = Storage.get('bron_modular_notes', []);
        let rn = notes.length > 0 ? (notes[notes.length-1].title || "DATA") : "EMPTY";
        let displayRn = rn.length > 6 ? rn.substring(0, 6) + '..' : rn;

        // 3. Orbital Satellites (Physical Trigonometry Math)
        const radius = 270; 
        const satellites = [
            { 
               id: 'tasks', label: '[TSK]', data: `${pendingCnt} PND`, target: 'tasks-view',
               preview: `NXT: ${lastTask.substring(0, 12)}`, allowAdd: true, 
               addAction: () => { window.navigateToView('tasks-view'); setTimeout(() => document.getElementById('new-task-input').focus(), 150); }
            },
            { 
               id: 'habits', label: '[HBT]', data: `${highestStreak} STR`, target: 'habits-view',
               preview: `TOP: ${topHabit.substring(0,12)}`, allowAdd: true,
               addAction: () => { window.navigateToView('habits-view'); setTimeout(() => document.getElementById('add-habit-btn').click(), 150); }
            },
            { 
               id: 'sounds', label: '[AUD]', data: `ACTIVE`, target: 'sounds-view',
               preview: `FREQ_MIXER`, allowAdd: false
            },
            { 
               id: 'notes', label: '[MEM]', data: `${displayRn}`, target: 'notes-view',
               preview: `ID: ${rn.substring(0,14)}`, allowAdd: true,
               addAction: () => { window.navigateToView('notes-view'); setTimeout(() => document.getElementById('add-note-btn').click(), 150); }
            },
            { 
               id: 'zen', label: '[ZEN]', data: `RGLTR`, target: 'zen-view',
               preview: `[SYS_READY]`, allowAdd: false
            }
        ];

        satellites.forEach((sat, index) => {
            // Start at top (-90deg), distribute evenly across 360
            const angleDeg = (index * (360 / satellites.length)) - 90; 
            const angleRad = angleDeg * (Math.PI / 180);
            
            const x = radius * Math.cos(angleRad);
            const y = radius * Math.sin(angleRad);

            const wrapper = document.createElement('div');
            wrapper.className = 'hud-sat-wrapper';
            wrapper.style.transform = `translate(${x}px, ${y}px)`;

            const orb = document.createElement('div');
            orb.className = 'hud-satellite';
            orb.innerHTML = `
                <div class="hud-sat-icon">${sat.label}</div>
                <div class="hud-sat-data">${sat.data}</div>
            `;
            orb.addEventListener('click', () => {
                sfxEngine.playSFX('click');
                window.navigateToView(sat.target);
            });
            orb.addEventListener('mouseenter', () => sfxEngine.playSFX('hover'));
            
            // Inject Contextual Hover Modals
            const modal = document.createElement('div');
            modal.className = 'hud-sat-modal';
            
            let modalHtml = `<span class="hud-modal-text">${sat.preview}</span>`;
            if (sat.allowAdd) {
                modalHtml += `<button class="hud-modal-add" title="Quick Add Session">+</button>`;
            }
            modal.innerHTML = modalHtml;
            
            if(sat.allowAdd) {
                 modal.querySelector('.hud-modal-add').addEventListener('click', (e) => {
                      sfxEngine.playSFX('click');
                      sat.addAction();
                 });
            }

            wrapper.appendChild(orb);
            wrapper.appendChild(modal);
            hud.appendChild(wrapper);
        });

        // Experimental: 3D Parallax Tracking across the entire HUD
        hud.addEventListener('mousemove', (e) => {
            const rect = hud.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top; 
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -15; 
            const rotateY = ((x - centerX) / centerX) * 15;
            
            hud.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        hud.addEventListener('mouseleave', () => {
            hud.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });

        dashContainer.appendChild(hud);
    }

    renderHUD();
}
