// theme-toggle.js - 主题切换功能

let currentTheme = 'light';

// 获取当前主题
function getCurrentTheme() {
    return localStorage.getItem('theme') || 'light';
}

// 设置主题
function setTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeToggleButton();
}

// 切换主题
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// 更新主题切换按钮
function updateThemeToggleButton() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (currentTheme === 'dark') {
                icon.className = 'fas fa-sun';
                themeToggle.setAttribute('aria-label', '切换到浅色主题');
            } else {
                icon.className = 'fas fa-moon';
                themeToggle.setAttribute('aria-label', '切换到深色主题');
            }
        }
    }
}

// 初始化主题切换
function initThemeToggle() {
    // 设置初始主题
    currentTheme = getCurrentTheme();
    setTheme(currentTheme);
    
    // 主题切换按钮事件
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // 监听系统主题变化
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// 导出函数
export { initThemeToggle, toggleTheme, setTheme, getCurrentTheme };
