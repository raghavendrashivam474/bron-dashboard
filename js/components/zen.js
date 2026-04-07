export function initZen() {
    const zenContainer = document.getElementById('zen-view');
    const circle = document.getElementById('breathe-circle');
    const text = document.getElementById('breathe-text');
    const btn = document.getElementById('zen-toggle-btn');
    
    if(!zenContainer || !circle) return;

    let isBreathing = false;
    let intervalId = null;
    let stepTimeout = null;

    // Box Breathing (4s Inhale, 4s Hold, 4s Exhale, 4s Hold)
    const PHASE_TIME = 4000;

    function breathCycle() {
        // Phase 1: Inhale
        text.textContent = "Breathe In";
        circle.style.transform = "scale(1.5)";
        
        stepTimeout = setTimeout(() => {
            if(!isBreathing) return;
            // Phase 2: Hold
            text.textContent = "Hold";
            // scale stays 1.5
            
            stepTimeout = setTimeout(() => {
                if(!isBreathing) return;
                // Phase 3: Exhale
                text.textContent = "Breathe Out";
                circle.style.transform = "scale(1)";
                
                stepTimeout = setTimeout(() => {
                    if(!isBreathing) return;
                    // Phase 4: Hold
                    text.textContent = "Hold";
                    // scale stays 1
                }, PHASE_TIME);
            }, PHASE_TIME);
        }, PHASE_TIME);
    }

    function startBreathing() {
        isBreathing = true;
        btn.textContent = "Stop Session";
        btn.classList.add('active');
        breathCycle();
        intervalId = setInterval(breathCycle, PHASE_TIME * 4);
    }

    function stopBreathing() {
        isBreathing = false;
        clearInterval(intervalId);
        clearTimeout(stepTimeout);
        btn.textContent = "Start Box Breathing";
        btn.classList.remove('active');
        text.textContent = "Ready";
        circle.style.transform = "scale(1)";
    }

    btn.addEventListener('click', () => {
        if(isBreathing) {
            stopBreathing();
        } else {
            startBreathing();
        }
    });
}
