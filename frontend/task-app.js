// Task Manager Application
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize app
function init() {
    renderTasks();
    updateStats();
}

// Add new task
function addTask() {
    debugger;
    const text = taskInput.value.trim();
    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    // Prevent adding the same task twice
    const isDuplicate = tasks.some(t => t.text.toLowerCase() === text.toLowerCase());
    if (isDuplicate) {
        alert('This task already exists!');
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    taskInput.value = '';
    renderTasks();
    updateStats();
}


// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks based on current filter
function renderTasks() {
    let filteredTasks = tasks;
    
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    taskList.innerHTML = '';
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
    updateStats();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

// Edit task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt("Edit your task:", task.text);

    if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

// Clear all completed tasks
function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
    updateStats();
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;

    document.getElementById("totalCount").textContent = total;
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("activeCount").textContent = active;
}

// Filter buttons click events
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Add task on Enter key
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

