import { Storage } from '../core/storage.js';

export function initDashboard() {
    const dashContainer = document.getElementById('master-bento'); 
    const appContainer = document.querySelector('.app-container');
    
    if(!dashContainer) return;

    // Show app interface immediately (skip cyber landing stage)
    appContainer.classList.add('revealed');
    document.body.style.overflow = '';

    function renderHUD() {
        dashContainer.innerHTML = '';
        dashContainer.className = 'student-dashboard-grid'; 
        
        // Fetch Live States
        let tasks = Storage.get('bron_tasks', []);
        let pendingTasks = tasks.filter(t => !t.completed);
        let pendingCnt = pendingTasks.length; 

        const habits = Storage.get('bron_habits', []);
        let highestStreak = 0;
        let totalRoutines = habits.length;
        habits.forEach(h => {
             if(h.completedDays && h.completedDays.length >= highestStreak) {
                 highestStreak = h.completedDays.length;
             }
        });

        dashContainer.innerHTML = `
            <div class="dashboard-header-inline">
                <div class="dashboard-greeting">
                    <h2>Good Evening, Student</h2>
                    <p>Ready to focus today?</p>
                </div>
                <div class="dashboard-progress">
                    <div class="progress-label">Highest Streak</div>
                    <div class="progress-value">${highestStreak} 🔥</div>
                </div>
            </div>
            
            <div class="summary-card hero-card" id="card-timer">
                <div class="hero-content">
                    <h3>Study Timer</h3>
                    <p>Start your next focused session</p>
                    <div class="timer-quick-info">25:00</div>
                    <button class="hero-cta btn btn-primary">Start Studying</button>
                </div>
                <div class="card-icon">⏱️</div>
            </div>

            <div class="summary-card" id="card-homework">
                <h3>Assignments</h3>
                <div class="card-stats">${pendingCnt} Pending</div>
                <p>Manage your tasks</p>
                <div class="card-icon">📚</div>
            </div>

            <div class="summary-card" id="card-routine">
                <h3>Streaks</h3>
                <div class="card-stats">${totalRoutines} Habits</div>
                <p>Keep the momentum</p>
                <div class="card-icon">📈</div>
            </div>
            
            <div class="summary-card" id="card-notes">
                <h3>Notes</h3>
                <p>Quick references</p>
                <div class="card-icon">📝</div>
            </div>
            
            <div class="summary-card" id="card-calm">
                <h3>Focus Reset</h3>
                <p>Take a deep breath</p>
                <div class="card-icon">🧘</div>
            </div>
        `;

        document.getElementById('card-timer').addEventListener('click', () => window.navigateToView('timer-view'));
        document.getElementById('card-homework').addEventListener('click', () => { window.navigateToView('tasks-view'); setTimeout(() => document.getElementById('new-task-input').focus(), 150); });
        document.getElementById('card-routine').addEventListener('click', () => window.navigateToView('habits-view'));
        document.getElementById('card-notes').addEventListener('click', () => window.navigateToView('notes-view'));
        document.getElementById('card-calm').addEventListener('click', () => window.navigateToView('zen-view'));
    }

    // Since localStorage may get updated when returning to dashboard via ESC,
    // we should re-render or at least listen for updates if necessary, 
    // but just calling renderHUD() once works for initial load. We can hook it into navigation.
    // Let's hook into the global navigation event if it existed...
    // But right now just rendering once is what the old system implicitly did (actually old system had 'hudEnter' trigger only once).
    renderHUD();

    // Re-render when navigating back to update counts
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class' && dashContainer.parentElement.classList.contains('active')) {
                renderHUD(); // Re-fresh counts when returning to the dashboard view
            }
        });
    });
    observer.observe(dashContainer.parentElement, { attributes: true });
}
