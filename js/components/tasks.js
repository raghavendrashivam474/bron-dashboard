import { Storage } from '../core/storage.js';

export function initTasks() {
    const taskInput = document.getElementById('new-task-input');
    const taskSubject = document.getElementById('new-task-subject');
    const tasksList = document.getElementById('tasks-list');
    const clearBtn = document.getElementById('clear-tasks-btn');
    
    if(!tasksList) return;

    const STORAGE_KEY = 'bron_tasks';
    let tasks = Storage.get(STORAGE_KEY, []);

    function saveTasks() {
        Storage.set(STORAGE_KEY, tasks);
    }

    function renderTasks() {
        tasksList.innerHTML = '';
        tasks.forEach((task, index) => {
            const item = document.createElement('div');
            item.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            
            const subjectTag = document.createElement('span');
            subjectTag.className = `task-subject tag-${(task.subject || 'General').toLowerCase()}`;
            subjectTag.textContent = task.subject || 'Gen';
            
            const text = document.createElement('span');
            text.className = 'task-text';
            text.textContent = task.text;
            
            const delBtn = document.createElement('button');
            delBtn.className = 'task-del-btn';
            delBtn.innerHTML = '🗑️';
            delBtn.title = 'Delete Task';

            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                saveTasks();
                renderTasks(); 
            });

            delBtn.addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            item.appendChild(checkbox);
            item.appendChild(subjectTag);
            item.appendChild(text);
            item.appendChild(delBtn);
            
            tasksList.appendChild(item);
        });
    }

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && taskInput.value.trim() !== '') {
            // Add new tasks to the beginning
            tasks.unshift({
                text: taskInput.value.trim(),
                subject: taskSubject ? taskSubject.value : 'General',
                completed: false
            });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        }
    });

    clearBtn.addEventListener('click', () => {
        const hasCompleted = tasks.some(t => t.completed);
        if(!hasCompleted) {
            alert('No completed homework to clear.');
            return;
        }
        
        if (confirm('Clear all completed homework?')) {
            tasks = tasks.filter(t => !t.completed);
            saveTasks();
            renderTasks();
        }
    });

    renderTasks();
}
