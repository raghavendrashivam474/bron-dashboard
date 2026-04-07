export function initTimer() {
    const timeDisplay = document.getElementById('time-display');
    const startBtn = document.getElementById('timer-start-btn');
    const resetBtn = document.getElementById('timer-reset-btn');
    const modeBtn = document.getElementById('timer-mode-btn');
    const circle = document.querySelector('.progress-ring__circle');
    
    if(!timeDisplay) return;

    // Circumference = 2 * pi * r (110)
    const CIRCUMFERENCE = 2 * Math.PI * 110;
    
    let isRunning = false;
    let isWorkMode = true; // true = 25m, false = 5m
    const WORK_TIME = 25 * 60;
    const REST_TIME = 5 * 60;
    let timeRemaining = WORK_TIME;
    let timerInterval = null;

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function setProgress(percent) {
        const offset = CIRCUMFERENCE - percent / 100 * CIRCUMFERENCE;
        circle.style.strokeDashoffset = offset;
    }

    function updateDisplay() {
        timeDisplay.textContent = formatTime(timeRemaining);
        const totalTime = isWorkMode ? WORK_TIME : REST_TIME;
        const percent = (timeRemaining / totalTime) * 100;
        setProgress(percent);
    }

    function switchMode() {
        isWorkMode = !isWorkMode;
        if (isWorkMode) {
            timeRemaining = WORK_TIME;
            modeBtn.textContent = '☕ Rest Mode';
            modeBtn.title = 'Switch to Rest (5m)';
            circle.style.stroke = 'var(--accent-color)';
        } else {
            timeRemaining = REST_TIME;
            modeBtn.textContent = '💼 Work Mode';
            modeBtn.title = 'Switch to Work (25m)';
            circle.style.stroke = '#8bbd8b'; // A nice soft sage green for resting
        }
        updateDisplay();
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = 'Start';
    }

    function startTimer() {
        if (isRunning) {
            pauseTimer();
            return;
        }

        if (timeRemaining <= 0) {
            // Already finished, don't start
            return;
        }

        isRunning = true;
        startBtn.textContent = 'Pause';
        
        timerInterval = setInterval(() => {
            timeRemaining--;
            updateDisplay();

            if (timeRemaining <= 0) {
                pauseTimer();
                // Play a generic beep sound (optional via browser API)
                try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    osc.connect(ctx.destination);
                    osc.start();
                    setTimeout(() => osc.stop(), 500);
                } catch(e) {}
                
                alert(isWorkMode ? 'Time for a break!' : 'Time to get back to work!');
                switchMode();
            }
        }, 1000);
    }

    function resetTimer() {
        pauseTimer();
        timeRemaining = isWorkMode ? WORK_TIME : REST_TIME;
        updateDisplay();
    }

    startBtn.addEventListener('click', startTimer);
    resetBtn.addEventListener('click', resetTimer);
    modeBtn.addEventListener('click', () => {
        pauseTimer();
        switchMode();
    });

    // Initialize display on load
    updateDisplay();
}
