import { SyntheticAudio } from '../core/audio.js';
import { Storage } from '../core/storage.js';

export function initSounds() {
    const syntheticCards = document.querySelectorAll('.synthetic-card');
    const customGrid = document.getElementById('custom-sounds-grid');
    const customInput = document.getElementById('custom-audio-input');
    const customBtn = document.getElementById('custom-audio-btn');

    let audioEngine = null;
    const STORAGE_KEY = 'bron_custom_audio';
    let customAudios = Storage.get(STORAGE_KEY, []);

    // 1. Synthetic Audio Wiring
    syntheticCards.forEach(card => {
        const type = card.dataset.sound;
        const toggleBtn = card.querySelector('.sound-toggle-btn');
        const volumeInput = card.querySelector('.sound-volume');
        let isPlaying = false;

        toggleBtn.addEventListener('click', () => {
            if(!audioEngine) audioEngine = new SyntheticAudio(); 
            
            isPlaying = !isPlaying;
            if (isPlaying) {
                audioEngine.play(type, parseFloat(volumeInput.value));
                toggleBtn.textContent = 'Stop';
                card.classList.add('playing');
            } else {
                audioEngine.stop(type);
                toggleBtn.textContent = 'Play';
                card.classList.remove('playing');
            }
        });

        volumeInput.addEventListener('input', (e) => {
            if (isPlaying && audioEngine) {
                audioEngine.setVolume(type, parseFloat(e.target.value));
            }
        });
    });

    // 2. Custom Audio Wiring (Bring Your Own Audio engine)
    if(!customGrid) return;

    function renderCustomAudios() {
        customGrid.innerHTML = '';
        customAudios.forEach(item => {
            const card = document.createElement('div');
            card.className = 'sound-card custom-card';

            const header = document.createElement('div');
            header.className = 'custom-card-header';
            
            const title = document.createElement('h3');
            title.textContent = item.type === 'youtube' ? 'YouTube Stream' : 'Custom Web Audio';

            const delBtn = document.createElement('button');
            delBtn.className = 'delete-custom-btn';
            delBtn.innerHTML = '🗑️';
            delBtn.title = 'Remove';
            delBtn.addEventListener('click', () => {
                customAudios = customAudios.filter(a => a.id !== item.id);
                Storage.set(STORAGE_KEY, customAudios);
                renderCustomAudios();
            });

            header.appendChild(title);
            header.appendChild(delBtn);
            card.appendChild(header);

            if (item.type === 'youtube') {
                const iframe = document.createElement('iframe');
                // Construct a sleek headless youtube embed
                const origin = window.location.origin;
                iframe.src = `https://www.youtube.com/embed/${item.mediaId}?controls=1&origin=${origin}`;
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                iframe.setAttribute('allowfullscreen', '');
                card.appendChild(iframe);
                
                const warningMsg = document.createElement('p');
                warningMsg.style.fontSize = '0.75rem';
                warningMsg.style.color = 'var(--text-secondary)';
                warningMsg.style.marginTop = '0.5rem';
                warningMsg.textContent = "Note: If it says 'Video Unavailable', the creator has explicitly blocked outside embedding.";
                card.appendChild(warningMsg);
            } else {
                const audio = document.createElement('audio');
                audio.controls = true;
                audio.src = item.url;
                
                const subtitle = document.createElement('p');
                subtitle.style.fontSize = '0.8rem';
                subtitle.style.wordBreak = 'break-all';
                subtitle.style.lineHeight = '1.2';
                subtitle.textContent = item.url;
                
                card.appendChild(subtitle);
                card.appendChild(audio);
            }

            customGrid.appendChild(card);
        });
    }

    customBtn.addEventListener('click', () => {
        const url = customInput.value.trim();
        if(!url) return;

        // Rock-solid Regex to capture standard YouTube, short YouTu.be, or Embed URLs
        const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(ytRegex);

        const newItem = {
            id: Date.now(),
            url: url
        };

        if (match && match[1]) {
            newItem.type = 'youtube';
            newItem.mediaId = match[1];
        } else {
            newItem.type = 'mp3'; 
        }

        // Avoid exact duplicates
        if(!customAudios.find(a => a.url === url)) {
            customAudios.push(newItem);
            Storage.set(STORAGE_KEY, customAudios);
        }
        
        customInput.value = '';
        renderCustomAudios();
    });

    customInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') customBtn.click();
    });

    renderCustomAudios();
}
