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
        let completedTasks = tasks.filter(t => t.completed);
        let pendingCnt = pendingTasks.length; 
        
        let completionRate = tasks.length > 0 
            ? Math.round((completedTasks.length / tasks.length) * 100) 
            : 0;

        const habits = Storage.get('bron_habits', []);
        let totalRoutines = habits.length;

        // Empty state conditional microcopy
        let assignmentsHTML = pendingCnt === 0 && tasks.length > 0
            ? `<div class="card-stats empty-state">All Clear ✨</div><p>Enjoy your break!</p>`
            : pendingCnt === 0 
            ? `<div class="card-stats empty-state">0 Tasks</div><p>Add some assignments →</p>`
            : `<div class="card-stats">${pendingCnt} Pending</div><p>Manage your assignments</p>`;
            
        let routinesHTML = totalRoutines === 0
            ? `<div class="card-stats empty-state">New Routine</div><p>Start building consistency →</p>`
            : `<div class="card-stats">${totalRoutines} Habits</div><p>Keep the momentum</p>`;

        let todaysGoal = Storage.get('bron_today_goal', '');

        dashContainer.innerHTML = `
            <div class="dashboard-header-inline">
                <div class="dashboard-greeting">
                    <h2>Good Evening, Student</h2>
                    <input type="text" id="daily-goal-input" class="daily-goal-input" placeholder="🎯 What is your main goal for today?" value="${todaysGoal}">
                </div>
                <div class="dashboard-progress">
                    <div class="progress-label">Daily Progress</div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${completionRate}%"></div>
                    </div>
                    <div class="progress-value">${completionRate}%</div>
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
                ${assignmentsHTML}
                <div class="card-icon">📚</div>
            </div>

            <div class="summary-card" id="card-routine">
                <h3>Streaks</h3>
                ${routinesHTML}
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

        // Event listeners for routing
        document.getElementById('card-timer').addEventListener('click', () => window.navigateToView('timer-view'));
        document.getElementById('card-homework').addEventListener('click', () => { window.navigateToView('tasks-view'); setTimeout(() => document.getElementById('new-task-input').focus(), 150); });
        document.getElementById('card-routine').addEventListener('click', () => window.navigateToView('habits-view'));
        document.getElementById('card-notes').addEventListener('click', () => window.navigateToView('notes-view'));
        document.getElementById('card-calm').addEventListener('click', () => window.navigateToView('zen-view'));

        // Save daily goal 
        const goalInput = document.getElementById('daily-goal-input');
        if (goalInput) {
            goalInput.addEventListener('input', (e) => {
                Storage.set('bron_today_goal', e.target.value);
            });
        }
    }

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
