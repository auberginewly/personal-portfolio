// main.js - 主要JavaScript逻辑

document.addEventListener('DOMContentLoaded', () => {
    // 移动端导航菜单
    initMobileNavigation();
    
    // 表单验证
    initFormValidation();
    
    // Todo功能
    initTodoFunctionality();
    
    // 博客搜索
    initBlogSearch();
    
    // 滚动动画
    initScrollAnimations();
    
    // 主题切换
    initThemeToggle();
    
    // 博客iframe功能
    initBlogIframe();
    
    // 加载用户信息 (XSS测试相关)
    loadUserInfo();
});

// 移动端导航菜单
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // 点击菜单项时关闭菜单
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// 表单验证
function initFormValidation() {
    // 登录表单验证
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    // 注册表单验证 (包含XSS测试点)
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
    
    // 实时密码强度检测
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        if (input.id === 'regPassword') {
            input.addEventListener('input', checkPasswordStrength);
        }
    });
}

// 处理登录表单提交
function handleLoginSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // 基本验证
    if (!email || !password) {
        showMessage('请填写所有必填字段', 'error');
        return;
    }
    
    // 邮箱格式验证
    if (!isValidEmail(email)) {
        showMessage('请输入有效的邮箱地址', 'error');
        return;
    }
    
    // 模拟登录过程
    const loginBtn = document.querySelector('#loginFormElement .auth-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登录中...';
    loginBtn.disabled = true;
    
    setTimeout(() => {
        // 模拟登录成功
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        if (rememberMe) {
            localStorage.setItem('rememberUser', 'true');
        }
        
        showMessage('登录成功！欢迎回来', 'success');
        
        // 恢复按钮状态
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
        
        // 跳转到首页
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 2000);
}

// 处理注册表单提交 (XSS测试点)
function handleRegisterSubmit(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const intro = document.getElementById('intro').value; // XSS测试点
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    let isValid = true;
    let errorMessage = '';
    
    // 基本验证
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        errorMessage += '请填写所有必填字段。\\n';
        isValid = false;
    }
    
    // 邮箱格式验证
    if (!isValidEmail(email)) {
        errorMessage += '邮箱格式不正确。\\n';
        isValid = false;
    }
    
    // 手机号格式验证
    if (!isValidPhone(phone)) {
        errorMessage += '手机号必须是11位数字。\\n';
        isValid = false;
    }
    
    // 密码长度验证
    if (password.length < 6) {
        errorMessage += '密码至少需要6位。\\n';
        isValid = false;
    }
    
    // 确认密码一致性
    if (password !== confirmPassword) {
        errorMessage += '两次输入的密码不一致。\\n';
        isValid = false;
    }
    
    // 同意条款验证
    if (!agreeTerms) {
        errorMessage += '请同意用户协议和隐私政策。\\n';
        isValid = false;
    }
    
    if (!isValid) {
        showMessage('注册失败：\\n' + errorMessage, 'error');
        return;
    }
    
    // 模拟注册过程
    const registerBtn = document.querySelector('#registerFormElement .auth-btn');
    const originalText = registerBtn.innerHTML;
    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 创建中...';
    registerBtn.disabled = true;
    
    setTimeout(() => {
        // 故意不进行编码来模拟存储型XSS漏洞
        // 正确的防护应该在这里对 intro 进行编码
        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            intro: intro, // 模拟存储型XSS注入点
            registeredAt: new Date().toISOString()
        };
        
        localStorage.setItem('registeredUser', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        showMessage('注册成功！欢迎加入我们', 'success');
        
        // 恢复按钮状态
        registerBtn.innerHTML = originalText;
        registerBtn.disabled = false;
        
        // 跳转到首页
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 2000);
}

// 密码强度检测
function checkPasswordStrength(event) {
    const password = event.target.value;
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (!strengthIndicator) {
        // 创建密码强度指示器
        const indicator = document.createElement('div');
        indicator.id = 'passwordStrength';
        indicator.className = 'password-strength';
        event.target.parentNode.parentNode.appendChild(indicator);
    }
    
    const strength = calculatePasswordStrength(password);
    const indicator = document.getElementById('passwordStrength');
    
    indicator.className = `password-strength ${strength.level}`;
    indicator.innerHTML = `<div class="strength-bar"><div class="strength-fill" style="width: ${strength.score}%"></div></div><span>${strength.text}</span>`;
}

// 计算密码强度
function calculatePasswordStrength(password) {
    let score = 0;
    let level = 'weak';
    let text = '弱';
    
    if (password.length >= 6) score += 20;
    if (password.length >= 8) score += 20;
    if (/[a-z]/.test(password)) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^\\w\\s]/.test(password)) score += 10;
    
    if (score >= 80) {
        level = 'strong';
        text = '强';
    } else if (score >= 60) {
        level = 'medium';
        text = '中';
    }
    
    return { score, level, text };
}

// 项目筛选功能
// Todo功能
function initTodoFunctionality() {
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoInput = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');
    
    if (addTodoBtn && todoInput) {
        addTodoBtn.addEventListener('click', addNewTodo);
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addNewTodo();
            }
        });
    }
    
    // Todo筛选
    const todoFilterBtns = document.querySelectorAll('.todo-filters .filter-btn');
    todoFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterTodos(filter);
            
            // 更新按钮状态
            todoFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // 初始化现有todo项的事件监听
    initExistingTodos();
    
    // 更新统计
    updateTodoStats();
}

// 添加新的Todo
function addNewTodo() {
    const todoInput = document.getElementById('todoInput');
    const categorySelect = document.getElementById('todoCategory');
    const prioritySelect = document.getElementById('todoPriority');
    
    const text = todoInput.value.trim();
    const category = categorySelect.value;
    const priority = prioritySelect.value;
    
    if (!text) {
        showMessage('请输入任务内容', 'error');
        return;
    }
    
    const todoId = 'todo_' + Date.now();
    const todoHTML = createTodoHTML(todoId, text, category, priority);
    
    // 找到对应的分类区域并添加
    const categorySection = document.querySelector(`[data-category="${category}"]`);
    if (categorySection) {
        categorySection.insertAdjacentHTML('beforeend', todoHTML);
    }
    
    // 清空输入
    todoInput.value = '';
    
    // 重新初始化事件监听
    initTodoEvents(todoId);
    
    // 更新统计
    updateTodoStats();
    
    showMessage('任务添加成功', 'success');
}

// 创建Todo HTML
function createTodoHTML(id, text, category, priority) {
    const now = new Date();
    const dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30天后
    
    return `
        <div class="todo-item" data-status="pending" data-category="${category}" data-priority="${priority}">
            <div class="todo-checkbox">
                <input type="checkbox" id="${id}">
                <label for="${id}"></label>
            </div>
            <div class="todo-content">
                <h3>${escapeHtml(text)}</h3>
                <p>新添加的任务</p>
                <div class="todo-meta">
                    <span class="priority ${priority}">${getPriorityText(priority)}</span>
                    <span class="category">${getCategoryText(category)}</span>
                    <span class="due-date">目标: ${dueDate.toLocaleDateString()}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: 0%;"></div>
                    <span class="progress-text">0%</span>
                </div>
            </div>
            <div class="todo-actions">
                <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
}

// 初始化现有Todo事件
function initExistingTodos() {
    document.querySelectorAll('.todo-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const editBtn = item.querySelector('.edit-btn');
        const deleteBtn = item.querySelector('.delete-btn');
        
        if (checkbox) {
            checkbox.addEventListener('change', () => toggleTodoStatus(item, checkbox.checked));
        }
        
        if (editBtn) {
            editBtn.addEventListener('click', () => editTodo(item));
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteTodo(item));
        }
    });
}

// 初始化特定Todo事件
function initTodoEvents(todoId) {
    const item = document.querySelector(`#${todoId}`).closest('.todo-item');
    const checkbox = item.querySelector('input[type="checkbox"]');
    const editBtn = item.querySelector('.edit-btn');
    const deleteBtn = item.querySelector('.delete-btn');
    
    if (checkbox) {
        checkbox.addEventListener('change', () => toggleTodoStatus(item, checkbox.checked));
    }
    
    if (editBtn) {
        editBtn.addEventListener('click', () => editTodo(item));
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deleteTodo(item));
    }
}

// 切换Todo状态
function toggleTodoStatus(item, isCompleted) {
    const content = item.querySelector('.todo-content');
    const progressBar = item.querySelector('.progress');
    const progressText = item.querySelector('.progress-text');
    
    if (isCompleted) {
        item.dataset.status = 'completed';
        content.classList.add('completed');
        progressBar.style.width = '100%';
        progressText.textContent = '100%';
        
        // 更新完成日期
        const metaElement = item.querySelector('.due-date');
        if (metaElement) {
            metaElement.textContent = `完成: ${new Date().toLocaleDateString()}`;
            metaElement.className = 'completed-date';
        }
    } else {
        item.dataset.status = 'pending';
        content.classList.remove('completed');
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        
        // 恢复目标日期
        const metaElement = item.querySelector('.completed-date');
        if (metaElement) {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 30);
            metaElement.textContent = `目标: ${futureDate.toLocaleDateString()}`;
            metaElement.className = 'due-date';
        }
    }
    
    updateTodoStats();
}

// 编辑Todo
function editTodo(item) {
    const titleElement = item.querySelector('h3');
    const currentTitle = titleElement.textContent;
    
    const newTitle = prompt('编辑任务标题:', currentTitle);
    if (newTitle && newTitle.trim() !== currentTitle) {
        titleElement.textContent = newTitle.trim();
        showMessage('任务已更新', 'success');
    }
}

// 删除Todo
function deleteTodo(item) {
    if (confirm('确定要删除这个任务吗？')) {
        item.style.transition = 'all 0.3s ease-out';
        item.style.opacity = '0';
        item.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            item.remove();
            updateTodoStats();
            showMessage('任务已删除', 'success');
        }, 300);
    }
}

// 筛选Todo
function filterTodos(filter) {
    const todoItems = document.querySelectorAll('.todo-item');
    
    todoItems.forEach(item => {
        let shouldShow = false;
        
        switch (filter) {
            case 'all':
                shouldShow = true;
                break;
            case 'pending':
                shouldShow = item.dataset.status === 'pending';
                break;
            case 'completed':
                shouldShow = item.dataset.status === 'completed';
                break;
            default:
                shouldShow = item.dataset.category === filter;
        }
        
        if (shouldShow) {
            item.style.display = 'flex';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// 更新Todo统计
function updateTodoStats() {
    const totalTasks = document.querySelectorAll('.todo-item').length;
    const completedTasks = document.querySelectorAll('.todo-item[data-status="completed"]').length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const totalElement = document.getElementById('totalTasks');
    const pendingElement = document.getElementById('pendingTasks');
    const completedElement = document.getElementById('completedTasks');
    const rateElement = document.getElementById('completionRate');
    
    if (totalElement) totalElement.textContent = totalTasks;
    if (pendingElement) pendingElement.textContent = pendingTasks;
    if (completedElement) completedElement.textContent = completedTasks;
    if (rateElement) rateElement.textContent = completionRate + '%';
}

// 博客搜索功能 (XSS测试点 - 反射型)
function initBlogSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const articlesContainer = document.getElementById('articlesContainer');
    const searchResults = document.getElementById('searchResults');
    const blogGrid = document.getElementById('blogGrid');
    
    if (searchForm && searchInput && articlesContainer) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const query = searchInput.value.trim();
            
            if (query) {
                // 跳转到带参数的URL，模拟反射型XSS
                const currentUrl = new URL(window.location);
                currentUrl.searchParams.set('query', query);
                window.history.pushState({}, '', currentUrl);
                
                // 显示搜索结果
                displaySearchResults(query);
            }
        });
        
        // 页面加载时检查URL参数并显示
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('query');
        
        if (searchQuery) {
            searchInput.value = searchQuery;
            displaySearchResults(searchQuery);
        }
    }
    
    // 博客卡片筛选
    const categoryFilter = document.getElementById('categoryFilter');
    const tagFilter = document.getElementById('tagFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterBlogs);
    }
    
    if (tagFilter) {
        tagFilter.addEventListener('change', filterBlogs);
    }
}

// 显示搜索结果 (XSS漏洞点)
function displaySearchResults(query) {
    const articlesContainer = document.getElementById('articlesContainer');
    const searchResults = document.getElementById('searchResults');
    const blogGrid = document.getElementById('blogGrid');
    
    if (!articlesContainer || !searchResults) return;
    
    // 故意使用 innerHTML 模拟反射型XSS漏洞
    // 正确防护应该使用 textContent 或者对内容进行HTML编码
    articlesContainer.innerHTML = `<div class="search-result-header"><h2>搜索结果：${decodeURIComponent(query)}</h2><p>找到相关文章...</p></div>`;
    
    // 模拟搜索结果
    const mockResults = `
        <div class="search-result-item">
            <h3><a href="blog-detail.html?id=github-actions">GitHub Actions 自动化工作流</a></h3>
            <p>探索 GitHub Actions 的强大功能，实现博客自动部署、代码质量检查等自动化工作流程。关键词: <mark>${escapeHtml(decodeURIComponent(query))}</mark></p>
            <div class="search-meta">
                <span>2025-05-05</span>
                <span>琐碎问题解决</span>
            </div>
        </div>
        <div class="search-result-item">
            <h3><a href="blog-detail.html?id=50projects">50 Projects 50 Days（持续更新）</a></h3>
            <p>前端学习挑战项目，通过50个小项目练习和提升前端开发技能。匹配内容: <mark>${escapeHtml(decodeURIComponent(query))}</mark></p>
            <div class="search-meta">
                <span>2025-04-29</span>
                <span>学习笔记</span>
            </div>
        </div>
    `;
    
    articlesContainer.innerHTML += mockResults;
    
    // 显示搜索结果区域，隐藏博客网格
    searchResults.style.display = 'block';
    if (blogGrid) {
        blogGrid.style.display = 'none';
    }
}

// 博客筛选
function filterBlogs() {
    const categoryFilter = document.getElementById('categoryFilter');
    const tagFilter = document.getElementById('tagFilter');
    const blogCards = document.querySelectorAll('.blog-card');
    
    const selectedCategory = categoryFilter ? categoryFilter.value : '';
    const selectedTag = tagFilter ? tagFilter.value : '';
    
    blogCards.forEach(card => {
        const cardCategory = card.dataset.category;
        const cardTags = card.dataset.tags;
        
        let shouldShow = true;
        
        if (selectedCategory && cardCategory !== selectedCategory) {
            shouldShow = false;
        }
        
        if (selectedTag && (!cardTags || !cardTags.includes(selectedTag))) {
            shouldShow = false;
        }
        
        if (shouldShow) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    document.querySelectorAll('.skill-card, .project-card, .blog-card, .stat-card, .todo-item').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// 主题切换（禁用深色模式）
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // 移除主题切换功能，始终使用白天模式
        themeToggle.style.display = 'none';
        
        // 确保始终是白天模式
        document.body.classList.remove('dark-theme');
        localStorage.removeItem('darkTheme');
        
        // 确保图标为月亮（表示可以切换到夜间，但我们禁用了功能）
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
    
    // 强制移除任何可能存在的深色主题类
    document.body.classList.remove('dark-theme');
}

// 博客iframe功能初始化
function initBlogIframe() {
    // 初始化视图切换
    initViewToggle();
    
    // 初始化文章点击事件
    initArticleClick();
    
    // 初始化返回按钮
    initBackButton();
    
    // 尝试加载博客统计数据
    loadBlogStats();
}

// 视图切换功能
function initViewToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const articlesContainer = document.getElementById('articlesContainer');
    const articlesFallback = document.getElementById('articlesFallback');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有active类
            toggleBtns.forEach(b => b.classList.remove('active'));
            // 添加当前按钮的active类
            btn.classList.add('active');
            
            const view = btn.dataset.view;
            
            // 切换视图
            if (articlesContainer.style.display !== 'none') {
                articlesContainer.className = `articles-container ${view}-view`;
            } else {
                articlesFallback.className = `articles-fallback ${view}-view`;
            }
        });
    });
}

// 文章点击事件
function initArticleClick() {
    // 监听文章卡片点击
    document.addEventListener('click', (e) => {
        const articleCard = e.target.closest('.article-card');
        if (articleCard) {
            const url = articleCard.dataset.url;
            const title = articleCard.querySelector('.article-title').textContent;
            
            if (url) {
                showArticleInIframe(url, title);
            }
        }
        
        // 监听作者链接点击
        const blogLinkBtn = e.target.closest('.blog-link-btn');
        if (blogLinkBtn) {
            e.preventDefault();
            const url = blogLinkBtn.dataset.url;
            showArticleInIframe(url, '博客首页');
        }
    });
}

// 在iframe中显示文章
function showArticleInIframe(url, title) {
    const articlesSection = document.querySelector('.blog-articles-section');
    const authorSection = document.querySelector('.blog-author-section');
    const iframeSection = document.getElementById('iframeSection');
    const iframe = document.getElementById('blogIframe');
    const iframeTitle = document.getElementById('iframeTitle');
    const openNewTab = document.getElementById('openNewTab');
    
    // 隐藏文章列表和作者信息
    articlesSection.style.display = 'none';
    authorSection.style.display = 'none';
    
    // 显示iframe区域
    iframeSection.style.display = 'block';
    
    // 设置iframe源和标题
    iframe.src = url;
    iframeTitle.textContent = title;
    openNewTab.href = url;
    
    // 滚动到iframe区域
    iframeSection.scrollIntoView({ behavior: 'smooth' });
    
    console.log(`正在加载文章: ${title} - ${url}`);
}

// 返回按钮功能
function initBackButton() {
    const backBtn = document.getElementById('backToList');
    
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const articlesSection = document.querySelector('.blog-articles-section');
            const authorSection = document.querySelector('.blog-author-section');
            const iframeSection = document.getElementById('iframeSection');
            const iframe = document.getElementById('blogIframe');
            
            // 显示文章列表和作者信息
            articlesSection.style.display = 'block';
            authorSection.style.display = 'block';
            
            // 隐藏iframe区域
            iframeSection.style.display = 'none';
            
            // 清空iframe源
            iframe.src = 'about:blank';
            
            // 滚动到页面顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            console.log('返回文章列表');
        });
    }
}

// 加载博客统计数据
function loadBlogStats() {
    // 模拟加载统计数据（实际应该从API获取）
    setTimeout(() => {
        const totalPosts = document.getElementById('totalPosts');
        const totalViews = document.getElementById('totalViews');
        const totalTags = document.getElementById('totalTags');
        
        if (totalPosts) totalPosts.textContent = '15';
        if (totalViews) totalViews.textContent = '3.2k';
        if (totalTags) totalTags.textContent = '18';
        
        console.log('博客统计数据加载完成');
    }, 1000);
}

// 初始化页面状态
function initBlogPageState() {
    // 检查是否有URL参数指定要显示的文章
    const urlParams = new URLSearchParams(window.location.search);
    const articleUrl = urlParams.get('article');
    const articleTitle = urlParams.get('title');
    
    if (articleUrl) {
        // 如果有指定文章，直接显示
        setTimeout(() => {
            showArticleInIframe(decodeURIComponent(articleUrl), decodeURIComponent(articleTitle || '博客文章'));
        }, 500);
    } else {
        // 否则显示文章列表
        showArticlesList();
    }
}

// 显示文章列表
function showArticlesList() {
    const articlesLoading = document.querySelector('.articles-loading');
    const articlesContainer = document.getElementById('articlesContainer');
    const articlesFallback = document.getElementById('articlesFallback');
    
    // 尝试从API加载文章（这里模拟API调用失败，使用备用内容）
    setTimeout(() => {
        // 隐藏加载状态
        articlesLoading.style.display = 'none';
        
        // 显示备用文章列表
        articlesFallback.style.display = 'grid';
        
        console.log('文章列表加载完成');
    }, 1500);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.blog-articles-section')) {
        initBlogPageState();
    }
});

// 为iframe添加响应式高度调整
function adjustIframeHeight() {
    const iframe = document.querySelector('.iframe-container iframe');
    if (!iframe) return;
    
    // 根据窗口大小调整iframe高度
    const adjustHeight = () => {
        const windowHeight = window.innerHeight;
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const pageHeaderHeight = document.querySelector('.page-header')?.offsetHeight || 0;
        const quickLinksHeight = document.querySelector('.blog-quick-links')?.offsetHeight || 0;
        const footerHeight = document.querySelector('footer')?.offsetHeight || 0;
        
        // 计算可用高度
        const availableHeight = windowHeight - headerHeight - pageHeaderHeight - quickLinksHeight - footerHeight - 120; // 120px为额外边距
        
        // 设置最小高度
        const minHeight = Math.max(availableHeight, 600);
        iframe.style.height = `${minHeight}px`;
    };
    
    // 页面加载时调整
    adjustHeight();
    
    // 窗口大小变化时调整
    window.addEventListener('resize', adjustHeight);
}

// 在页面加载完成后调整iframe高度
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(adjustIframeHeight, 1000); // 延迟1秒以确保所有元素都已渲染
});

// 加载用户信息 (XSS测试相关)
function loadUserInfo() {
    const storedUser = localStorage.getItem('registeredUser');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (storedUser && isLoggedIn === 'true') {
        try {
            const userData = JSON.parse(storedUser);
            displayUserInfo(userData);
        } catch (e) {
            console.error("Failed to parse stored user data:", e);
        }
    }
}

// 显示用户信息 (XSS漏洞点 - 存储型)
function displayUserInfo(userData) {
    const introDisplayElement = document.getElementById('introDisplay');
    const userInfoSection = document.getElementById('userInfo');
    
    if (introDisplayElement && userData.intro && userInfoSection) {
        // 故意使用 innerHTML 模拟存储型XSS漏洞
        // 正确防护应该使用 textContent 或者对内容进行HTML编码
        introDisplayElement.innerHTML = `
            <div class="user-profile">
                <h3>欢迎回来，${escapeHtml(userData.firstName)} ${escapeHtml(userData.lastName)}！</h3>
                <div class="user-intro">
                    <h4>个人简介：</h4>
                    <div class="intro-content">${userData.intro}</div>
                </div>
                <div class="user-meta">
                    <p><strong>邮箱：</strong> ${escapeHtml(userData.email)}</p>
                    <p><strong>注册时间：</strong> ${new Date(userData.registeredAt).toLocaleDateString()}</p>
                </div>
            </div>
        `;
        
        userInfoSection.style.display = 'block';
    }
}

// 工具函数

// 邮箱验证
function isValidEmail(email) {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
}

// 手机号验证
function isValidPhone(phone) {
    const phoneRegex = /^\\d{11}$/;
    return phoneRegex.test(phone);
}

// HTML转义 (安全函数)
function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 获取优先级文本
function getPriorityText(priority) {
    const priorityMap = {
        'high': '高优先级',
        'medium': '中优先级',
        'low': '低优先级'
    };
    return priorityMap[priority] || priority;
}

// 获取分类文本
function getCategoryText(category) {
    const categoryMap = {
        'learning': '学习',
        'project': '项目',
        'blog': '博客',
        'skill': '技能'
    };
    return categoryMap[category] || category;
}

// 消息提示
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.innerHTML = `
        <div class="message-content">
            <i class="fas ${getMessageIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="message-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // 添加样式
    messageEl.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getMessageColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // 添加到页面
    document.body.appendChild(messageEl);
    
    // 关闭按钮事件
    const closeBtn = messageEl.querySelector('.message-close');
    closeBtn.addEventListener('click', () => {
        messageEl.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    });
    
    // 自动关闭
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }
    }, 5000);
}

function getMessageIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getMessageColor(type) {
    const colors = {
        'success': '#4CAF50',
        'error': '#f44336',
        'warning': '#ff9800',
        'info': '#2196F3'
    };
    return colors[type] || colors.info;
}

// 添加必要的CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .message-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .message-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: 1rem;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .message-close:hover {
        opacity: 1;
    }
    
    .password-strength {
        margin-top: 0.5rem;
    }
    
    .strength-bar {
        height: 4px;
        background-color: #e0e0e0;
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 0.3rem;
    }
    
    .strength-fill {
        height: 100%;
        transition: width 0.3s ease;
        border-radius: 2px;
    }
    
    .password-strength.weak .strength-fill {
        background-color: #f44336;
    }
    
    .password-strength.medium .strength-fill {
        background-color: #ff9800;
    }
    
    .password-strength.strong .strength-fill {
        background-color: #4CAF50;
    }
    
    .password-strength span {
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .password-strength.weak span {
        color: #f44336;
    }
    
    .password-strength.medium span {
        color: #ff9800;
    }
    
    .password-strength.strong span {
        color: #4CAF50;
    }
    
    .search-result-header {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--border-color);
    }
    
    .search-result-header h2 {
        color: var(--dark-color);
        margin-bottom: 0.5rem;
    }
    
    .search-result-item {
        padding: 1.5rem;
        background: white;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        margin-bottom: 1rem;
        transition: var(--transition);
    }
    
    .search-result-item:hover {
        box-shadow: var(--shadow-hover);
        transform: translateY(-2px);
    }
    
    .search-result-item h3 {
        margin-bottom: 0.5rem;
    }
    
    .search-result-item h3 a {
        color: var(--dark-color);
        text-decoration: none;
        transition: var(--transition);
    }
    
    .search-result-item h3 a:hover {
        color: var(--primary-color);
    }
    
    .search-result-item p {
        color: var(--text-light);
        line-height: 1.6;
        margin-bottom: 1rem;
    }
    
    .search-result-item mark {
        background-color: var(--primary-color);
        color: white;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
    }
    
    .search-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.9rem;
        color: var(--text-muted);
    }
    
    .user-profile {
        text-align: center;
    }
    
    .user-intro {
        margin: 2rem 0;
        text-align: left;
    }
    
    .intro-content {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: var(--border-radius);
        border-left: 4px solid var(--primary-color);
        margin-top: 0.5rem;
    }
    
    .user-meta {
        text-align: left;
        background: rgba(135, 206, 235, 0.1);
        padding: 1rem;
        border-radius: var(--border-radius);
    }
`;

document.head.appendChild(style);

// 博客统计实时更新功能
function initBlogStatsUpdate() {
    // 检查是否在项目页面且有博客项目卡片
    const blogProjectCard = document.querySelector('.project-card:nth-child(3)'); // 第三个项目卡片是博客
    if (!blogProjectCard) return;

    // 定期更新博客统计数据
    function updateBlogStats() {
        // 使用代理服务或直接获取博客统计（由于跨域限制，这里提供一个框架）
        // 实际实现时可能需要后端代理或使用JSONP
        
        // 模拟更新（实际应该从博客API获取）
        const statsElements = blogProjectCard.querySelectorAll('.project-stats span');
        
        // 这里可以添加实际的API调用
        // fetch('https://api.auberginewly.site/stats') // 假设的API端点
        //     .then(response => response.json())
        //     .then(data => {
        //         // 更新浏览量
        //         if (statsElements[0]) {
        //             statsElements[0].innerHTML = `<i class="fas fa-eye"></i> ${data.pageViews} 浏览`;
        //         }
        //         // 更新访客数
        //         if (statsElements[1]) {
        //             statsElements[1].innerHTML = `<i class="fas fa-users"></i> ${data.visitors} 访客`;
        //         }
        //     })
        //     .catch(error => console.log('博客统计更新失败:', error));

        console.log('博客统计数据检查完成');
    }

    // 页面加载时立即更新一次
    updateBlogStats();
    
    // 每5分钟更新一次统计数据
    setInterval(updateBlogStats, 5 * 60 * 1000);
}

// 在DOMContentLoaded事件中添加博客统计更新
document.addEventListener('DOMContentLoaded', () => {
    // ...existing code...
    
    // 博客统计实时更新
    initBlogStatsUpdate();
});
