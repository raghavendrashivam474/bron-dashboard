import { Storage } from '../core/storage.js';

export function initHabits() {
    const habitsList = document.getElementById('habits-list');
    const addHabitBtn = document.getElementById('add-habit-btn');
    
    if(!habitsList) return;

    const STORAGE_KEY = 'bron_habits';
    let habits = Storage.get(STORAGE_KEY, []);

    // Generate accurate 'today' stripped of time for ISO key matching
    function getNormalizedDate(offsetDays = 0) {
        const d = new Date();
        d.setHours(0, 0, 0, 0); // normalize local time
        d.setDate(d.getDate() - offsetDays);
        return d.getTime(); 
    }
    
    // We will save days as absolute timestamps (midnight local time) to avoid TZ bugs over ISO strings
    
    // Upgrade existing ISO string state if any
    habits = habits.map(h => {
        if(h.completedDays && typeof h.completedDays[0] === 'string') {
            h.completedDays = h.completedDays.map(str => {
                const parts = str.split('-');
                if(parts.length === 3) {
                    const d = new Date(parts[0], parts[1]-1, parts[2]);
                    d.setHours(0,0,0,0);
                    return d.getTime();
                }
                return 0;
            });
        }
        return h;
    });

    const DAYS_TO_SHOW = 14;

    function saveHabits() {
        Storage.set(STORAGE_KEY, habits);
    }

    function renderHabits() {
        habitsList.innerHTML = '';
        
        habits.forEach((habit, index) => {
            const row = document.createElement('div');
            row.className = 'habit-row';

            const infoDiv = document.createElement('div');
            infoDiv.className = 'habit-info';
            
            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.className = 'habit-title-input';
            titleInput.value = habit.title;
            titleInput.placeholder = 'e.g. Read 10 Pages';

            titleInput.addEventListener('input', (e) => {
                habit.title = e.target.value;
                saveHabits();
            });
            
            const streakSpan = document.createElement('div');
            streakSpan.className = 'habit-streak';

            infoDiv.appendChild(titleInput);
            infoDiv.appendChild(streakSpan);

            const daysContainer = document.createElement('div');
            daysContainer.className = 'habit-days';

            let currentStreakCounter = 0;
            let streakActive = true;

            // Render from 13 days ago up to today
            for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
                const targetTimestamp = getNormalizedDate(i);
                
                const dayBox = document.createElement('div');
                dayBox.className = 'habit-day-box';
                if(i === 0) dayBox.classList.add('today');
                
                const isCompleted = habit.completedDays.includes(targetTimestamp);
                if (isCompleted) {
                    dayBox.classList.add('completed');
                    dayBox.textContent = '✓';
                }

                if(streakActive) {
                    if(isCompleted) currentStreakCounter++;
                    else if(i !== 0) streakActive = false; // Missing a day breaks streak (unless it's today)
                }

                dayBox.addEventListener('click', () => {
                    if (isCompleted) {
                        habit.completedDays = habit.completedDays.filter(d => d !== targetTimestamp);
                    } else {
                        habit.completedDays.push(targetTimestamp);
                    }
                    saveHabits();
                    renderHabits();
                });

                daysContainer.appendChild(dayBox);
            }

            streakSpan.textContent = `Current Streak: ${currentStreakCounter} days`;

            const delBtn = document.createElement('button');
            delBtn.className = 'habit-del-btn';
            delBtn.innerHTML = '🗑️';
            delBtn.title = 'Delete Habit';
            
            delBtn.addEventListener('click', () => {
                if(confirm('Delete this habit sequence?')) {
                    habits.splice(index, 1);
                    saveHabits();
                    renderHabits();
                }
            });

            row.appendChild(infoDiv);
            row.appendChild(daysContainer);
            row.appendChild(delBtn);

            habitsList.appendChild(row);
        });
    }

    addHabitBtn.addEventListener('click', () => {
        habits.push({
            id: Date.now(),
            title: '',
            completedDays: []
        });
        saveHabits();
        renderHabits();
        
        const inputs = habitsList.querySelectorAll('.habit-title-input');
        if(inputs.length > 0) {
            inputs[inputs.length - 1].focus();
        }
    });

    renderHabits();
}
