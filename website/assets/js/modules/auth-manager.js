// auth-manager.js - 通用认证管理模块

class AuthManager {
    constructor() {
        this.users = this.loadUsers();
        this.init();
    }

    // 初始化认证管理器
    init() {
        this.updateNavigation();
        this.bindEvents();
        this.handleLoginRedirect();
    }

    // 加载用户数据
    loadUsers() {
        const users = localStorage.getItem('registeredUsers');
        return users ? JSON.parse(users) : [];
    }

    // 保存用户数据
    saveUsers() {
        localStorage.setItem('registeredUsers', JSON.stringify(this.users));
    }

    // 邮箱格式验证
    validateEmail(email) {
        // 测试账户admin不需要邮箱验证
        if (email === 'admin') return true;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 密码强度检测
    checkPasswordStrength(password) {
        let strength = 0;
        let feedback = [];
        
        // 长度检查
        if (password.length >= 8) {
            strength += 1;
        } else {
            feedback.push('至少8个字符');
        }
        
        // 包含小写字母
        if (/[a-z]/.test(password)) {
            strength += 1;
        } else {
            feedback.push('包含小写字母');
        }
        
        // 包含大写字母
        if (/[A-Z]/.test(password)) {
            strength += 1;
        } else {
            feedback.push('包含大写字母');
        }
        
        // 包含数字
        if (/[0-9]/.test(password)) {
            strength += 1;
        } else {
            feedback.push('包含数字');
        }
        
        // 包含特殊字符
        if (/[^A-Za-z0-9]/.test(password)) {
            strength += 1;
        } else {
            feedback.push('包含特殊字符');
        }
        
        let level, color, text;
        if (strength <= 1) {
            level = 'weak';
            color = '#ff4757';
            text = '弱';
        } else if (strength <= 3) {
            level = 'medium';
            color = '#ffa502';
            text = '中等';
        } else {
            level = 'strong';
            color = '#2ed573';
            text = '强';
        }
        
        return {
            strength,
            level,
            color,
            text,
            feedback,
            score: (strength / 5) * 100
        };
    }

    // 用户注册
    register(userData) {
        const { email, password, phone, gender, hobbies, region, intro } = userData;
        
        // 验证邮箱格式
        if (!this.validateEmail(email)) {
            return { success: false, message: '请输入正确的邮箱格式' };
        }
        
        // 检查邮箱是否已存在
        if (this.users.find(user => user.email === email)) {
            return { success: false, message: '该邮箱已被注册' };
        }
        
        // 检查密码强度
        const passwordCheck = this.checkPasswordStrength(password);
        if (passwordCheck.strength < 2) {
            return { 
                success: false, 
                message: `密码强度不足，建议：${passwordCheck.feedback.join('、')}` 
            };
        }
        
        // 创建新用户
        const newUser = {
            id: Date.now(),
            email,
            password, // 实际项目中应该加密存储
            phone,
            gender,
            hobbies,
            region,
            intro,
            registeredAt: new Date().toISOString()
        };
        
        this.users.push(newUser);
        this.saveUsers();
        
        return { success: true, message: '注册成功！' };
    }

    // 用户登录验证
    authenticate(email, password) {
        // 测试账户特殊处理
        if (email === 'admin' && password === 'admin') {
            return { 
                success: true, 
                user: { 
                    id: 0, 
                    email: 'admin', 
                    isAdmin: true 
                } 
            };
        }
        
        // 验证邮箱格式
        if (!this.validateEmail(email)) {
            return { success: false, message: '请输入正确的邮箱格式' };
        }
        
        // 查找用户
        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) {
            return { success: false, message: '邮箱或密码错误' };
        }
        
        return { success: true, user };
    }

    // 检查登录状态
    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    // 获取用户信息
    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    // 获取用户邮箱
    getUserEmail() {
        const user = this.getCurrentUser();
        return user ? user.email : null;
    }

    // 更新导航栏显示
    updateNavigation() {
        this.addAuthNavigation();
        
        const isLoggedIn = this.isLoggedIn();
        const currentUser = this.getCurrentUser();
        const loginBtn = document.getElementById('loginBtn');
        const userMenu = document.getElementById('userMenu');
        const userEmailSpan = document.getElementById('userEmail');
        
        if (isLoggedIn && currentUser) {
            // 用户已登录，显示用户菜单
            if (loginBtn) loginBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';
            if (userEmailSpan) {
                userEmailSpan.textContent = currentUser.isAdmin ? 'Admin' : currentUser.email;
            }
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
                <div class="user-menu" id="userMenu">
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
        });
    }

    // 退出登录
    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberLogin');
        
        // 显示退出消息
        alert('已退出登录');
        
        // 跳转到登录页面
        window.location.href = 'login.html';
    }

    // 登录
    login(user, rememberMe = false) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (rememberMe) {
            localStorage.setItem('rememberLogin', 'true');
        }
        
        this.updateNavigation();
    }

    // 处理登录重定向
    handleLoginRedirect() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('login') === 'success') {
            const currentUser = this.getCurrentUser();
            if (currentUser) {
                setTimeout(() => {
                    const welcomeMsg = currentUser.isAdmin ? '欢迎管理员！' : `欢迎回来，${currentUser.email}！`;
                    alert(welcomeMsg);
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

    // 获取密码强度指示器HTML
    getPasswordStrengthIndicator() {
        return `
            <div class="password-strength" id="passwordStrength" style="display: none;">
                <div class="strength-bar">
                    <div class="strength-fill" id="strengthFill"></div>
                </div>
                <div class="strength-text" id="strengthText"></div>
                <div class="strength-feedback" id="strengthFeedback"></div>
            </div>
        `;
    }

    // 更新密码强度显示
    updatePasswordStrength(password, containerId = null) {
        const container = containerId ? document.getElementById(containerId) : document.getElementById('passwordStrength');
        if (!container) return;

        if (!password) {
            container.style.display = 'none';
            return;
        }

        const strength = this.checkPasswordStrength(password);
        const fill = container.querySelector('.strength-fill') || container.querySelector('#strengthFill');
        const text = container.querySelector('.strength-text') || container.querySelector('#strengthText');
        const feedback = container.querySelector('.strength-feedback') || container.querySelector('#strengthFeedback');

        container.style.display = 'block';
        
        if (fill) {
            fill.style.width = `${strength.score}%`;
            fill.style.backgroundColor = strength.color;
        }
        
        if (text) {
            text.textContent = `密码强度：${strength.text}`;
            text.style.color = strength.color;
        }
        
        if (feedback && strength.feedback.length > 0) {
            feedback.textContent = `建议：${strength.feedback.join('、')}`;
            feedback.style.display = 'block';
        } else if (feedback) {
            feedback.style.display = 'none';
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