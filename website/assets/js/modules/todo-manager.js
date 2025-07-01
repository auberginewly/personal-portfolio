// todo-manager.js - Todo管理功能

let todos = [];
let currentFilter = 'all';
let currentSearchTerm = '';

// 初始化静态数据
function initStaticTodos() {
    const staticTodos = [
        {
            id: 1,
            title: '深入学习 Java Spring Boot 框架',
            description: '完成 Spring Boot 官方教程，掌握微服务架构设计',
            category: 'learning',
            priority: 'high',
            status: 'pending',
            progress: 65,
            dueDate: '2025-08-01',
            createdAt: '2025-06-01'
        },
        {
            id: 2,
            title: '学习 React.js 前端框架',
            description: '掌握组件化开发思想，学习 Hooks 和状态管理',
            category: 'learning',
            priority: 'medium',
            status: 'pending',
            progress: 40,
            dueDate: '2025-09-01',
            createdAt: '2025-06-05'
        },
        {
            id: 3,
            title: '完成 JavaScript ES6+ 语法学习',
            description: '掌握箭头函数、Promise、async/await 等现代JavaScript特性',
            category: 'learning',
            priority: 'medium',
            status: 'completed',
            progress: 100,
            completedDate: '2025-06-15',
            createdAt: '2025-05-01'
        },
        {
            id: 4,
            title: '完善个人作品集网站',
            description: '添加更多项目展示，优化用户体验，完成XSS安全测试',
            category: 'project',
            priority: 'high',
            status: 'pending',
            progress: 80,
            dueDate: '2025-07-15',
            createdAt: '2025-05-20'
        },
        {
            id: 5,
            title: '开发 Java Web 项目',
            description: '使用 Spring Boot 开发一个完整的Web应用，包含用户管理、数据持久化等功能',
            category: 'project',
            priority: 'medium',
            status: 'pending',
            progress: 25,
            dueDate: '2025-10-01',
            createdAt: '2025-06-10'
        },
        {
            id: 6,
            title: '50 Projects 50 Days 挑战',
            description: '完成前端学习挑战项目，提升JavaScript和CSS技能',
            category: 'project',
            priority: 'medium',
            status: 'completed',
            progress: 60,
            completedDate: '持续更新',
            createdAt: '2025-04-01'
        }
    ];
    
    // 清除旧数据，强制使用新的静态数据
    localStorage.removeItem('todos');
    todos = staticTodos;
    saveTodos();
}

// 保存Todo数据
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 添加Todo
function addTodo() {
    const titleInput = document.getElementById('todoInput');
    const categorySelect = document.getElementById('todoCategory');
    const prioritySelect = document.getElementById('todoPriority');
    
    if (!titleInput || !titleInput.value.trim()) return false;
    
    const todo = {
        id: Date.now(),
        title: titleInput.value.trim(),
        description: '',
        category: categorySelect.value,
        priority: prioritySelect.value,
        status: 'pending',
        progress: 0,
        dueDate: '',
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    todos.unshift(todo);
    saveTodos();
    renderTodos();
    updateStats();
    
    // 清空输入框
    titleInput.value = '';
    
    return true;
}

// 删除Todo
function deleteTodo(id) {
    if (confirm('确定要删除这个任务吗？')) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// 切换Todo完成状态
function toggleTodoStatus(checkbox, id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.status = checkbox.checked ? 'completed' : 'pending';
        if (checkbox.checked) {
            todo.progress = 100;
            todo.completedDate = new Date().toISOString().split('T')[0];
        } else {
            todo.progress = Math.max(0, todo.progress);
            delete todo.completedDate;
        }
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// 过滤功能
function filterTodos(filter) {
    currentFilter = filter;
    
    // 更新过滤按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    renderTodos();
}

// 搜索功能
function searchTodos() {
    const searchInput = document.getElementById('searchInput');
    currentSearchTerm = searchInput.value.toLowerCase();
    renderTodos();
}

// 获取过滤后的todos
function getFilteredTodos() {
    let filteredTodos = todos;
    
    // 按状态和分类过滤
    if (currentFilter !== 'all') {
        if (currentFilter === 'pending' || currentFilter === 'completed') {
            filteredTodos = filteredTodos.filter(todo => todo.status === currentFilter);
        } else {
            filteredTodos = filteredTodos.filter(todo => todo.category === currentFilter);
        }
    }
    
    // 按搜索词过滤
    if (currentSearchTerm) {
        filteredTodos = filteredTodos.filter(todo => 
            todo.title.toLowerCase().includes(currentSearchTerm) ||
            todo.description.toLowerCase().includes(currentSearchTerm)
        );
    }
    
    return filteredTodos;
}

// 按分类分组todos
function groupTodosByCategory(filteredTodos) {
    const categories = {
        learning: { name: '学习任务', icon: 'fas fa-graduation-cap', todos: [] },
        project: { name: '项目任务', icon: 'fas fa-project-diagram', todos: [] }
    };
    
    filteredTodos.forEach(todo => {
        if (categories[todo.category]) {
            categories[todo.category].todos.push(todo);
        }
    });
    
    return categories;
}

// 渲染单个todo项
function renderTodoItem(todo) {
    const isCompleted = todo.status === 'completed';
    const dateInfo = isCompleted 
        ? `完成: ${todo.completedDate}` 
        : `目标: ${todo.dueDate || '未设定'}`;
    
    return `
        <div class="todo-item" data-status="${todo.status}" data-category="${todo.category}" data-priority="${todo.priority}">
            <div class="todo-checkbox">
                <input type="checkbox" id="todo${todo.id}" ${isCompleted ? 'checked' : ''} 
                       onchange="toggleTodoStatus(this, ${todo.id})">
                <label for="todo${todo.id}"></label>
            </div>
            <div class="todo-content ${isCompleted ? 'completed' : ''}">
                <h3>${todo.title}</h3>
                <p>${todo.description}</p>
                <div class="todo-meta">
                    <span class="priority ${todo.priority}">${getPriorityText(todo.priority)}</span>
                    <span class="category">${getCategoryText(todo.category)}</span>
                    <span class="${isCompleted ? 'completed-date' : 'due-date'}">${dateInfo}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${todo.progress}%;"></div>
                    <span class="progress-text">${todo.progress}%</span>
                </div>
            </div>
            <div class="todo-actions">
                <button class="action-btn edit-btn" onclick="editTodo(${todo.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteTodo(${todo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

// 渲染Todo列表
function renderTodos() {
    const todoList = document.getElementById('todoList');
    if (!todoList) return;
    
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<div class="empty-state">没有找到匹配的任务</div>';
        return;
    }
    
    const groupedTodos = groupTodosByCategory(filteredTodos);
    
    let html = '';
    Object.entries(groupedTodos).forEach(([categoryKey, categoryData]) => {
        if (categoryData.todos.length > 0) {
            html += `
                <div class="todo-category-section" data-category="${categoryKey}">
                    <h2><i class="${categoryData.icon}"></i> ${categoryData.name}</h2>
                    ${categoryData.todos.map(todo => renderTodoItem(todo)).join('')}
                </div>
            `;
        }
    });
    
    todoList.innerHTML = html;
}

// 更新统计信息
function updateStats() {
    const totalTasks = todos.length;
    const pendingTasks = todos.filter(todo => todo.status === 'pending').length;
    const completedTasks = todos.filter(todo => todo.status === 'completed').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    console.log('更新统计信息:', { totalTasks, pendingTasks, completedTasks, completionRate });
    
    const totalElement = document.getElementById('totalTasks');
    const pendingElement = document.getElementById('pendingTasks');
    const completedElement = document.getElementById('completedTasks');
    const rateElement = document.getElementById('completionRate');
    
    if (totalElement) totalElement.textContent = totalTasks;
    if (pendingElement) pendingElement.textContent = pendingTasks;
    if (completedElement) completedElement.textContent = completedTasks;
    if (rateElement) rateElement.textContent = completionRate + '%';
}

// 辅助函数
function getPriorityText(priority) {
    const priorities = {
        'high': '高优先级',
        'medium': '中优先级',
        'low': '低优先级'
    };
    return priorities[priority] || priority;
}

function getCategoryText(category) {
    const categories = {
        'learning': '学习',
        'project': '项目'
    };
    return categories[category] || category;
}

// 编辑Todo（简单实现）
function editTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        const newTitle = prompt('编辑任务标题:', todo.title);
        if (newTitle && newTitle.trim()) {
            todo.title = newTitle.trim();
            const newDescription = prompt('编辑任务描述:', todo.description);
            if (newDescription !== null) {
                todo.description = newDescription.trim();
            }
            saveTodos();
            renderTodos();
        }
    }
}

// 初始化Todo管理
function initTodoManager() {
    console.log('初始化Todo管理器');
    initStaticTodos();
    console.log('当前todos数量:', todos.length);
    renderTodos();
    updateStats();
    
    // 绑定添加按钮事件
    const addBtn = document.getElementById('addTodoBtn');
    if (addBtn) {
        addBtn.addEventListener('click', addTodo);
    }
    
    // 绑定回车键添加
    const todoInput = document.getElementById('todoInput');
    if (todoInput) {
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodo();
            }
        });
    }
    
    // 绑定过滤按钮事件
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterTodos(btn.dataset.filter);
        });
    });
    
    // 绑定搜索事件
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchTodos);
    }
}

// 全局函数挂载（用于HTML中的onclick事件）
window.toggleTodoStatus = toggleTodoStatus;
window.deleteTodo = deleteTodo;
window.editTodo = editTodo;
window.searchTodos = searchTodos;

// 导出函数
export { 
    initTodoManager,
    addTodo,
    deleteTodo,
    toggleTodoStatus,
    editTodo,
    filterTodos,
    searchTodos
};
