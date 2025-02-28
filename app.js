// 获取DOM元素
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
const filters = document.querySelectorAll('.filter');
const tasksCounter = document.getElementById('tasks-counter');
const clearCompletedButton = document.getElementById('clear-completed');

// 初始化待办事项数组
let todos = [];
let currentFilter = 'all';

// 从本地存储加载待办事项
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
        renderTodos();
    }
}

// 保存待办事项到本地存储
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 渲染待办事项列表
function renderTodos() {
    // 清空列表
    todoList.innerHTML = '';
    
    // 根据当前过滤器筛选任务
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }
    
    // 渲染筛选后的任务
    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        if (todo.completed) {
            todoItem.classList.add('completed');
        }
        
        todoItem.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;
        
        // 为复选框添加事件监听器
        const checkbox = todoItem.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => toggleTodoComplete(todo.id));
        
        // 为删除按钮添加事件监听器
        const deleteBtn = todoItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
        
        todoList.appendChild(todoItem);
    });
    
    // 更新任务计数
    updateTasksCounter();
}

// 添加新的待办事项
function addTodo() {
    const text = taskInput.value.trim();
    if (text) {
        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false
        };
        
        todos.push(newTodo);
        taskInput.value = '';
        saveTodos();
        renderTodos();
    }
}

// 切换待办事项的完成状态
function toggleTodoComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    saveTodos();
    renderTodos();
}

// 删除待办事项
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// 清除已完成的待办事项
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
}

// 更新任务计数
function updateTasksCounter() {
    const activeTodos = todos.filter(todo => !todo.completed).length;
    tasksCounter.textContent = `${activeTodos} 个任务`;
}

// 切换过滤器
function setFilter(filter) {
    currentFilter = filter;
    
    // 更新过滤器按钮的活动状态
    filters.forEach(btn => {
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderTodos();
}

// 事件监听器
addButton.addEventListener('click', addTodo);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

filters.forEach(filter => {
    filter.addEventListener('click', () => {
        const filterType = filter.getAttribute('data-filter');
        setFilter(filterType);
    });
});

clearCompletedButton.addEventListener('click', clearCompleted);

// 初始化应用
loadTodos();