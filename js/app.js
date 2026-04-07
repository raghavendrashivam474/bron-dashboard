import { initNotes } from './components/notes.js';
import { initTimer } from './components/timer.js';
import { initTasks } from './components/tasks.js';
import { initHabits } from './components/habits.js';
import { initSounds } from './components/sounds.js';
import { initZen } from './components/zen.js';
import { initDashboard } from './components/dashboard.js'; 

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.view-section');
    const backBtn = document.getElementById('global-back-btn');

    // Spatial layered navigation controller 
    window.navigateToView = (viewId) => {
        sections.forEach(s => s.classList.remove('active'));
        const target = document.getElementById(viewId);
        if(target) target.classList.add('active');
        
        // Show immersive escape hatch if we drill down past the dashboard
        if(viewId !== 'dashboard-view') {
            backBtn.classList.add('visible');
        } else {
            backBtn.classList.remove('visible');
        }
    };

    backBtn.addEventListener('click', () => {
        window.navigateToView('dashboard-view');
    });

    // Invisible escape hatch
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') {
            window.navigateToView('dashboard-view');
        }
    });

    // Initialize all modular feature components
    initNotes();
    initTimer();
    initTasks();
    initHabits();
    initSounds();
    initZen();
    initDashboard();
});
