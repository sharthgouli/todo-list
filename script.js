const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search');
const dateTime = document.getElementById('date-time');
const darkModeToggle = document.getElementById('dark-mode-toggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Load saved theme
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
  darkModeToggle.textContent = '☀️';
}

// Update date & time every second
function updateDateTime() {
  const now = new Date();
  dateTime.textContent = now.toLocaleString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(text, completed = false) {
  const li = document.createElement('li');
  li.textContent = text;
  if (completed) li.classList.add('completed');

  li.addEventListener('click', () => {
    li.classList.toggle('completed');
    const index = tasks.findIndex(t => t.text === text);
    tasks[index].completed = li.classList.contains('completed');
    saveTasks();
  });

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.className = 'delete-btn';
  delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    tasks = tasks.filter(t => t.text !== text);
    taskList.removeChild(li);
    saveTasks();
  });

  li.appendChild(delBtn);
  taskList.appendChild(li);
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  const newTask = { text: taskText, completed: false };
  tasks.push(newTask);
  saveTasks();
  renderTask(taskText);

  taskInput.value = '';
  taskInput.focus();
}

function filterTasks() {
  const searchTerm = searchInput.value.toLowerCase();
  Array.from(taskList.children).forEach(li => {
    const text = li.firstChild.textContent.toLowerCase();
    li.style.display = text.includes(searchTerm) ? '' : 'none';
  });
}

// Dark mode toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('darkMode', isDark);
  darkModeToggle.textContent = isDark ? '☀️' : '🌙';
});

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });
searchInput.addEventListener('input', filterTasks);

// Render saved tasks
tasks.forEach(task => renderTask(task.text, task.completed));

// Auto-focus on input
taskInput.focus();
