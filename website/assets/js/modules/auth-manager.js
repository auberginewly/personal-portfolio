// auth-manager.js - 通用认证管理模块

class AuthManager {
    constructor() {
        this.init();
    }

    // 初始化认证管理器
    init() {
        this.updateNavigation();
        this.bindEvents();
        this.handleLoginRedirect();
    }

    // 检查登录状态
    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    // 获取用户邮箱
    getUserEmail() {
        return localStorage.getItem('userEmail');
    }

    // 更新导航栏显示
    updateNavigation() {
        this.addAuthNavigation();
        
        const isLoggedIn = this.isLoggedIn();
        const userEmail = this.getUserEmail();
        const loginBtn = document.getElementById('loginBtn');
        const userMenu = document.getElementById('userMenu');
        const userEmailSpan = document.getElementById('userEmail');
        
        if (isLoggedIn && userEmail) {
            // 用户已登录，显示用户菜单
            if (loginBtn) loginBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            if (userEmailSpan) userEmailSpan.textContent = userEmail;
        } else {
            // 用户未登录，显示登录按钮
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    // 添加认证相关的导航元素（如果不存在）
    addAuthNavigation() {
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) return;

        // 检查是否已存在认证导航
        if (document.getElementById('authNav')) return;

        // 创建认证导航元素
        const authNavHtml = `
            <li class="auth-nav" id="authNav">
                <a href="login.html" class="login-btn" id="loginBtn">登录</a>
                <div class="user-menu" id="userMenu" style="display: none;">
                    <span class="user-email" id="userEmail">user@example.com</span>
                    <button class="logout-btn" id="logoutBtn">退出登录</button>
                </div>
            </li>
        `;

        navMenu.insertAdjacentHTML('beforeend', authNavHtml);
    }

    // 绑定事件
    bindEvents() {
        // 使用事件委托，因为元素可能是动态添加的
        document.addEventListener('click', (e) => {
            // 退出登录按钮
            if (e.target.id === 'logoutBtn') {
                this.logout();
            }
            
            // 点击页面其他地方关闭用户菜单
            const authNav = document.getElementById('authNav');
            const userMenu = document.getElementById('userMenu');
            
            if (authNav && userMenu && !authNav.contains(e.target)) {
                userMenu.style.display = 'none';
            }
        });

        // 用户邮箱点击事件（阻止冒泡）
        document.addEventListener('click', (e) => {
            if (e.target.id === 'userEmail') {
                e.stopPropagation();
            }
        });
    }

    // 退出登录
    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('rememberLogin');
        
        // 刷新导航显示
        this.updateNavigation();
        
        alert('已退出登录');
        
        // 如果当前页面需要登录才能访问，跳转到登录页
        this.checkPageAccess();
    }

    // 登录
    login(email, rememberMe = false) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        if (rememberMe) {
            localStorage.setItem('rememberLogin', 'true');
        }
        
        this.updateNavigation();
    }

    // 处理登录重定向
    handleLoginRedirect() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('login') === 'success') {
            const userEmail = this.getUserEmail();
            if (userEmail) {
                setTimeout(() => {
                    alert(`欢迎回来，${userEmail}！`);
                }, 500);
            }
            // 清理URL参数
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // 检查页面访问权限（可在需要登录的页面调用）
    checkPageAccess() {
        // 这里可以根据需要添加页面访问控制逻辑
        // 比如某些页面需要登录才能访问
    }

    // 显示用户菜单
    toggleUserMenu() {
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            const isVisible = userMenu.style.display === 'block';
            userMenu.style.display = isVisible ? 'none' : 'block';
        }
    }
}

// 创建全局认证管理器实例
let authManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();
});

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}

// 全局函数供其他脚本调用
window.AuthManager = AuthManager;
window.getAuthManager = () => authManager; 