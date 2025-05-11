const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date');
const prioritySelect = document.getElementById('todo-priority');
const list = document.getElementById('todo-list');
const emptyMsg = document.getElementById('empty-message');
const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');
const filterBtns = document.querySelectorAll('.filter-btn');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function init() {
  renderTodos();
  updateStats();
  updateEmptyMessage();
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function updateStats() {
  totalCount.textContent = todos.length;
  completedCount.textContent = todos.filter(todo => todo.completed).length;
}

function updateEmptyMessage() {
  const filteredTodos = filterTodos(todos);
  emptyMsg.style.display = filteredTodos.length === 0 ? 'block' : 'none';
}

function filterTodos(todos) {
  switch (currentFilter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

function createTodoItem(todo) {
  const li = document.createElement('li');
  li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
  li.dataset.id = todo.id;

  const content = document.createElement('div');
  content.className = 'todo-content';

  const text = document.createElement('div');
  text.className = 'todo-text';
  text.textContent = todo.text;

  const meta = document.createElement('div');
  meta.className = 'todo-meta';

  if (todo.date) {
    const date = document.createElement('span');
    date.textContent = new Date(todo.date).toLocaleDateString('tr-TR');
    meta.appendChild(date);
  }

  const priority = document.createElement('span');
  priority.className = `todo-priority priority-${todo.priority}`;
  priority.textContent = todo.priority === 'high' ? 'Yüksek' : 
                        todo.priority === 'low' ? 'Düşük' : 'Normal';
  meta.appendChild(priority);

  content.appendChild(text);
  content.appendChild(meta);

  const actions = document.createElement('div');
  actions.className = 'todo-actions';

  const completeBtn = document.createElement('button');
  completeBtn.className = 'action-btn complete';
  completeBtn.title = todo.completed ? 'Tamamlanmadı olarak işaretle' : 'Tamamlandı olarak işaretle';
  completeBtn.innerHTML = `<i class="fas ${todo.completed ? 'fa-undo' : 'fa-check'}"></i>`;
  completeBtn.onclick = () => toggleTodo(todo.id);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'action-btn delete';
  deleteBtn.title = 'Sil';
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBtn.onclick = () => deleteTodo(todo.id);

  actions.appendChild(completeBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(content);
  li.appendChild(actions);

  return li;
}

function renderTodos() {
  list.innerHTML = '';
  const filteredTodos = filterTodos(todos);
  filteredTodos.forEach(todo => {
    list.appendChild(createTodoItem(todo));
  });
  updateEmptyMessage();
}

function addTodo(e) {
  e.preventDefault();
  const text = input.value.trim();
  const date = dateInput.value;
  const priority = prioritySelect.value;

  if (text) {
    const todo = {
      id: Date.now(),
      text,
      date,
      priority,
      completed: false
    };

    todos.push(todo);
    saveTodos();
    renderTodos();
    updateStats();

    input.value = '';
    dateInput.value = '';
    prioritySelect.value = 'normal';
  }
}

function toggleTodo(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
  updateStats();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
  updateStats();
}

function setFilter(filter) {
  currentFilter = filter;
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderTodos();
}

form.addEventListener('submit', addTodo);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

init(); 