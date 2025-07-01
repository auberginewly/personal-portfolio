// theme-toggle.js - 主题切换功能（已禁用深色模式）

let currentTheme = 'light';

// 获取当前主题（始终返回白天模式）
function getCurrentTheme() {
    return 'light';
}

// 设置主题（始终设置为白天模式）
function setTheme(theme) {
    currentTheme = 'light'; // 强制使用白天模式
    document.body.setAttribute('data-theme', 'light');
    document.body.classList.remove('dark-theme');
    localStorage.removeItem('theme'); // 移除主题设置
    localStorage.removeItem('darkTheme'); // 移除旧的主题设置
    updateThemeToggleButton();
}

// 切换主题（已禁用）
function toggleTheme() {
    // 不执行任何操作，始终保持白天模式
    console.log('主题切换已禁用，始终使用白天模式');
}

// 更新主题切换按钮
function updateThemeToggleButton() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        // 隐藏主题切换按钮
        themeToggle.style.display = 'none';
        
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-moon';
            themeToggle.setAttribute('aria-label', '主题切换已禁用');
        }
    }
}

// 初始化主题切换（强制白天模式）
function initThemeToggle() {
    // 强制设置为白天模式
    currentTheme = 'light';
    setTheme('light');
    
    // 主题切换按钮事件（禁用）
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        // 移除点击事件，隐藏按钮
        themeToggle.style.display = 'none';
        themeToggle.removeEventListener('click', toggleTheme);
    }
    
    // 忽略系统主题变化，始终使用白天模式
    console.log('主题系统已初始化，强制使用白天模式');
}

// 导出函数
export { initThemeToggle, toggleTheme, setTheme, getCurrentTheme };
