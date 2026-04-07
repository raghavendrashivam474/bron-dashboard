import { Storage } from '../core/storage.js';

export function initNotes() {
    const notesGrid = document.getElementById('notes-grid');
    const addNoteBtn = document.getElementById('add-note-btn');
    const saveStatus = document.getElementById('save-status');
    const searchInput = document.getElementById('search-input');
    
    if(!notesGrid) return;

    const STORAGE_KEY = 'bron_modular_notes';
    let saveTimeout;
    
    // Load state via central storage manager
    let notes = Storage.get(STORAGE_KEY, []);

    function saveNotesLocally() {
        Storage.set(STORAGE_KEY, notes);
    }

    function triggerSaveStatus() {
        saveNotesLocally();
        saveStatus.textContent = 'Saving...';
        saveStatus.classList.add('saving');
        
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveStatus.textContent = 'All changes saved locally';
            saveStatus.classList.remove('saving');
        }, 800);
    }

    function autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    function getRelativeTime(timestamp) {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        const daysDifference = Math.round((timestamp - Date.now()) / (1000 * 60 * 60 * 24));
        if (Math.abs(daysDifference) > 0) return rtf.format(daysDifference, 'day');
        
        const hoursDifference = Math.round((timestamp - Date.now()) / (1000 * 60 * 60));
        if (Math.abs(hoursDifference) > 0) return rtf.format(hoursDifference, 'hour');
        
        const minutesDifference = Math.round((timestamp - Date.now()) / (1000 * 60));
        if (Math.abs(minutesDifference) > 0) return rtf.format(minutesDifference, 'minute');
        
        return 'just now';
    }

    function createNoteElement(note) {
        const card = document.createElement('div');
        card.className = `note-card theme-${note.color || 'default'} ${note.isPinned ? 'pinned' : ''}`;
        card.dataset.id = note.id;
        
        const header = document.createElement('div');
        header.className = 'note-header';
        
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.className = 'note-title';
        titleInput.value = note.title || '';
        titleInput.placeholder = 'Note Title...';
        
        const actions = document.createElement('div');
        actions.className = 'note-actions';
        
        const pinBtn = document.createElement('button');
        pinBtn.className = `icon-btn icon-pin ${note.isPinned ? 'pin-active' : ''}`;
        pinBtn.innerHTML = '📌';
        
        const delBtn = document.createElement('button');
        delBtn.className = 'icon-btn icon-del';
        delBtn.innerHTML = '🗑️';
        
        actions.appendChild(pinBtn);
        actions.appendChild(delBtn);
        header.appendChild(titleInput);
        
        const textarea = document.createElement('textarea');
        textarea.className = 'note-textarea';
        textarea.value = note.text;
        textarea.placeholder = 'Type your note...';
        
        const footer = document.createElement('div');
        footer.className = 'note-footer';
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'timestamp';
        timeSpan.textContent = `Edited ${getRelativeTime(note.updatedAt)}`;
        
        const colorsContainer = document.createElement('div');
        colorsContainer.className = 'color-picker';
        
        const colors = ['default', 'sage', 'ochre', 'rose', 'dust'];
        colors.forEach(c => {
            const dot = document.createElement('div');
            dot.className = `color-dot dot-${c} ${note.color === c ? 'active' : ''}`;
            dot.dataset.color = c;
            dot.title = c.charAt(0).toUpperCase() + c.slice(1);
            
            dot.addEventListener('click', () => {
                note.color = c;
                note.updatedAt = Date.now();
                timeSpan.textContent = `Edited just now`;
                
                colorsContainer.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                card.className = `note-card theme-${c} ${note.isPinned ? 'pinned' : ''}`;
                triggerSaveStatus();
            });
            colorsContainer.appendChild(dot);
        });
        
        footer.appendChild(timeSpan);
        footer.appendChild(colorsContainer);

        const updateNoteState = () => {
            note.updatedAt = Date.now();
            timeSpan.textContent = `Edited just now`;
            triggerSaveStatus();
        };

        titleInput.addEventListener('input', (e) => {
            note.title = e.target.value;
            updateNoteState();
        });

        textarea.addEventListener('input', (e) => {
            note.text = e.target.value;
            updateNoteState();
            autoResize(textarea);
        });
        
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, start) + "\t" + textarea.value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 1;
                note.text = textarea.value;
                updateNoteState();
            }
        });

        pinBtn.addEventListener('click', () => {
            note.isPinned = !note.isPinned;
            note.updatedAt = Date.now();
            triggerSaveStatus();
            renderNotes();
        });

        delBtn.addEventListener('click', () => {
            if (textarea.value.trim() !== '' || titleInput.value.trim() !== '') {
                if (!confirm('Delete this note?')) return;
            }
            notes = notes.filter(n => n.id !== note.id);
            triggerSaveStatus();
            renderNotes();
        });

        card.appendChild(header);
        card.appendChild(actions);
        card.appendChild(textarea);
        card.appendChild(footer);
        
        return card;
    }

    function sortNotes(notesArr) {
        return [...notesArr].sort((a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
            return b.updatedAt - a.updatedAt;
        });
    }

    function renderNotes(searchTerm = '') {
        notesGrid.innerHTML = '';
        
        let filteredNotes = notes;
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            filteredNotes = notes.filter(n => 
                (n.title || '').toLowerCase().includes(term) || 
                (n.text || '').toLowerCase().includes(term)
            );
        }

        const sortedNotes = sortNotes(filteredNotes);

        sortedNotes.forEach(note => {
            const el = createNoteElement(note);
            notesGrid.appendChild(el);
            requestAnimationFrame(() => {
                const ta = el.querySelector('textarea');
                if (ta) autoResize(ta);
            });
        });
    }

    addNoteBtn.addEventListener('click', () => {
        const newNote = {
            id: Date.now(),
            title: '',
            text: '',
            color: 'default',
            isPinned: false,
            updatedAt: Date.now()
        };
        notes.push(newNote);
        triggerSaveStatus();
        renderNotes(searchInput.value);
        
        const newlyAddedCard = notesGrid.querySelector(`[data-id="${newNote.id}"]`);
        if (newlyAddedCard) {
            newlyAddedCard.querySelector('.note-title').focus();
        }
    });

    searchInput.addEventListener('input', (e) => {
        renderNotes(e.target.value);
    });

    renderNotes();
}
