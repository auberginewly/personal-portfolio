// main.js - 主入口文件，负责模块导入和初始化

// 强制白天模式
function forceWhiteMode() {
    document.body.classList.remove('dark-theme');
    document.body.removeAttribute('data-theme');
    localStorage.removeItem('darkTheme');
    localStorage.removeItem('theme');
}

// 立即执行强制白天模式
forceWhiteMode();

// 检查是否支持ES6模块
const supportsModules = 'noModule' in HTMLScriptElement.prototype;

// 如果不支持模块，则使用传统方式
if (!supportsModules) {
    console.warn('浏览器不支持ES6模块，使用传统加载方式');
    // 可以在这里添加polyfill或降级方案
}

// 动态导入模块（支持现代浏览器）
async function initializeApp() {
    try {
        // 确保白天模式
        forceWhiteMode();
        
        // 动态导入所有模块
        const [
            { initMobileNavigation },
            { initContactForm },
            { initBlogFunctions },
            { initThemeToggle },
            { initTodoManager },
            { initNotifications, showNotification },
            { debounce, throttle, isMobile },
            AuthManagerModule
        ] = await Promise.all([
            import('./modules/navigation.js'),
            import('./modules/form-validation.js'),
            import('./modules/blog-functions.js'),
            import('./modules/theme-toggle.js'),
            import('./modules/todo-manager.js'),
            import('./modules/notifications.js'),
            import('./modules/utils.js'),
            import('./modules/auth-manager.js')
        ]);

        // 初始化所有模块
        await initializeModules({
            initMobileNavigation,
            initContactForm,
            initBlogFunctions,
            initThemeToggle,
            initTodoManager,
            initNotifications,
            showNotification
        });

        // 再次确保白天模式
        forceWhiteMode();

        // 初始化基础功能
        initBasicFeatures({ debounce, throttle, isMobile });

        // 根据页面类型初始化特定功能
        initPageSpecificFeatures();

        console.log('个人作品集网站模块化初始化完成');
        
    } catch (error) {
        console.error('模块初始化失败，使用降级方案:', error);
        // 降级到传统初始化方式
        initLegacyMode();
    }
}

// 传统模式初始化（降级方案）
function initLegacyMode() {
    console.log('使用传统模式初始化');
    
    // 移动端导航
    initMobileNavigationLegacy();
    
    // 基础功能
    initBasicFeaturesLegacy();
    
    // 页面特定功能
    initPageSpecificFeaturesLegacy();
    
    console.log('传统模式初始化完成');
}

// 初始化所有模块
async function initializeModules(modules) {
    const {
        initMobileNavigation,
        initContactForm,
        initBlogFunctions,
        initThemeToggle,
        initTodoManager,
        initNotifications,
        showNotification
    } = modules;

    try {
        // 初始化导航
        initMobileNavigation();
        
        // 初始化表单验证
        initContactForm();
        
        // 初始化主题切换
        initThemeToggle();
        
        // 初始化通知系统
        initNotifications();
        
        // 博客页面特定功能
        if (window.location.pathname.includes('blog-list.html')) {
            initBlogFunctions();
        }
        
        // Todo管理功能（如果存在相关元素）
        if (document.getElementById('todoList') || document.querySelector('.todo-form') || window.location.pathname.includes('todo.html')) {
            initTodoManager();
        }
        
        console.log('所有模块初始化完成');
    } catch (error) {
        console.error('模块初始化失败:', error);
        showNotification('部分功能初始化失败，请刷新页面重试', 'error');
    }
}

// 初始化基础功能
function initBasicFeatures(utils = {}) {
    const { debounce, throttle, isMobile } = utils;
    
    // 平滑滚动效果
    initSmoothScroll();
    
    // 导航栏背景模糊效果
    initNavbarScroll(throttle);
    
    // 技能进度条动画
    initSkillBars(throttle);
    
    // 项目卡片悬停效果
    initProjectCards(isMobile);
    
    // 返回顶部按钮
    initBackToTop(throttle);
}

// 平滑滚动效果
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 导航栏背景模糊效果
function initNavbarScroll(throttle) {
    const handleNavScroll = throttle ? throttle(() => {
        const nav = document.querySelector('.navbar');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    }, 100) : function() {
        const nav = document.querySelector('.navbar');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    };
    
    window.addEventListener('scroll', handleNavScroll);
}

// 技能进度条动画
function initSkillBars(throttle) {
    const animateSkillBars = throttle ? throttle(() => {
        const skillBars = document.querySelectorAll('.skill-bar');
        skillBars.forEach(bar => {
            const progress = bar.querySelector('.skill-progress');
            if (!progress) return;
            
            const percentage = progress.getAttribute('data-skill');
            
            // 检查元素是否在视口中
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            
            if (isVisible && !progress.classList.contains('animated')) {
                progress.style.width = percentage + '%';
                progress.classList.add('animated');
            }
        });
    }, 100) : function() {
        const skillBars = document.querySelectorAll('.skill-bar');
        skillBars.forEach(bar => {
            const progress = bar.querySelector('.skill-progress');
            if (!progress) return;
            
            const percentage = progress.getAttribute('data-skill');
            
            // 检查元素是否在视口中
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            
            if (isVisible && !progress.classList.contains('animated')) {
                progress.style.width = percentage + '%';
                progress.classList.add('animated');
            }
        });
    };
    
    // 监听滚动事件来触发技能条动画
    window.addEventListener('scroll', animateSkillBars);
    animateSkillBars(); // 初始检查
}

// 项目卡片悬停效果
function initProjectCards(isMobile) {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!isMobile || !isMobile()) {
                this.style.transform = 'translateY(-10px)';
                this.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!isMobile || !isMobile()) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// 返回顶部按钮
function initBackToTop(throttle) {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    const handleScroll = throttle ? throttle(() => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    }, 100) : function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 根据页面类型初始化特定功能
function initPageSpecificFeatures() {
    const pathname = window.location.pathname;
    
    // 根据页面路径执行特定初始化
    if (pathname.includes('index.html') || pathname === '/' || pathname.endsWith('/')) {
        initHomePage();
    } else if (pathname.includes('about.html')) {
        initAboutPage();
    } else if (pathname.includes('portfolio.html')) {
        initPortfolioPage();
    } else if (pathname.includes('blog-list.html')) {
        initBlogListPage();
    } else if (pathname.includes('contact.html')) {
        initContactPage();
    }
}

// 首页特定功能
function initHomePage() {
    console.log('首页功能已初始化');
    // 可以添加首页特有的功能
}

// 关于页面特定功能
function initAboutPage() {
    console.log('关于页面功能已初始化');
    // 可以添加关于页面特有的功能
}

// 作品集页面特定功能
function initPortfolioPage() {
    console.log('作品集页面功能已初始化');
    // 可以添加作品集页面特有的功能
}

// 博客列表页面特定功能
function initBlogListPage() {
    console.log('博客列表页面功能已初始化');
    // 博客相关功能已在 initBlogFunctions 中处理
}

// 联系页面特定功能
function initContactPage() {
    console.log('联系页面功能已初始化');
    // 联系表单功能已在 initContactForm 中处理
}

// 传统模式的初始化函数
function initMobileNavigationLegacy() {
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

function initBasicFeaturesLegacy() {
    // 基础功能的传统实现
    initSmoothScroll();
    initNavbarScroll();
    initSkillBars();
    initProjectCards();
    initBackToTop();
}

function initPageSpecificFeaturesLegacy() {
    // 页面特定功能的传统实现
    initPageSpecificFeatures();
}

// 错误处理
window.addEventListener('error', (event) => {
    console.error('页面错误:', event.error);
    // 在传统模式下显示简单的错误提示
    if (typeof showNotification === 'function') {
        showNotification('页面出现错误，部分功能可能受影响', 'error');
    } else {
        console.warn('部分功能可能受影响');
    }
});

// 未处理的Promise拒绝
window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason);
    event.preventDefault();
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('个人作品集网站已加载');
    
    // 检测浏览器支持并选择初始化方式
    if (supportsModules && window.Promise) {
        initializeApp();
    } else {
        initLegacyMode();
    }
});
