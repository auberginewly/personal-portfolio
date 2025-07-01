// security.js - Web安全实践与XSS攻击模拟/防护

// ---------------------------------------------------
// XSS 攻击模拟部分 (在 main.js 中故意留下的漏洞)
// ---------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔒 Security.js loaded - XSS 安全测试模块');
    console.log('⚠️  本模块包含用于教学目的的XSS漏洞演示');
    
    // 初始化安全测试
    initSecurityTests();
    
    // 检查并处理DOM型XSS
    handleDOMBasedXSS();
    
    // 输出HTTP协议分析提示
    logHTTPAnalysisInfo();
});

// 初始化安全测试
function initSecurityTests() {
    console.group('🛡️ XSS 安全测试初始化');
    
    // 检查当前页面的XSS测试点
    checkXSSTestPoints();
    
    // 添加安全测试工具
    addSecurityTestTools();
    
    console.groupEnd();
}

// 检查XSS测试点
function checkXSSTestPoints() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
        case 'blog-list.html':
            console.log('📍 检测到反射型XSS测试点: URL参数搜索功能');
            checkReflectedXSS();
            break;
            
        case 'blog-detail.html':
            console.log('📍 检测到DOM型XSS测试点: URL hash动态内容');
            break;
            
        case 'login.html':
            console.log('📍 检测到存储型XSS测试点: 注册表单个人简介');
            checkStoredXSS();
            break;
            
        case 'index.html':
            console.log('📍 检测到存储型XSS显示点: 用户信息展示');
            checkStoredXSSDisplay();
            break;
            
        default:
            console.log('📍 当前页面无XSS测试点');
    }
}

// 检查反射型XSS
function checkReflectedXSS() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    
    if (query) {
        console.warn('⚠️ 反射型XSS检测：');
        console.log('🔍 URL参数 query:', query);
        console.log('💡 测试方法: 在URL中添加 ?query=<script>alert("反射型XSS")</script>');
        console.log('🛡️ 防护状态: 当前使用innerHTML - 存在漏洞');
        
        // 显示安全建议
        showSecurityAdvice('reflected', {
            vulnerable: 'innerHTML 直接插入用户输入',
            secure: 'textContent 或 HTML实体编码'
        });
    }
}

// 检查存储型XSS
function checkStoredXSS() {
    console.warn('⚠️ 存储型XSS检测：');
    console.log('🔍 测试点: 注册表单个人简介字段');
    console.log('💡 测试方法: 在个人简介中输入 <img src=x onerror=alert("存储型XSS");>');
    console.log('🛡️ 防护状态: 当前直接存储 - 存在漏洞');
    
    // 显示安全建议
    showSecurityAdvice('stored', {
        vulnerable: '直接存储用户输入到localStorage',
        secure: '存储前进行HTML实体编码'
    });
}

// 检查存储型XSS显示
function checkStoredXSSDisplay() {
    const storedUser = localStorage.getItem('registeredUser');
    
    if (storedUser) {
        try {
            const userData = JSON.parse(storedUser);
            if (userData.intro) {
                console.warn('⚠️ 存储型XSS显示检测：');
                console.log('🔍 发现存储的用户简介:', userData.intro);
                console.log('💡 显示方式: innerHTML 直接渲染');
                console.log('🛡️ 防护状态: 当前使用innerHTML - 存在漏洞');
                
                // 显示安全建议
                showSecurityAdvice('stored-display', {
                    vulnerable: 'innerHTML 直接显示存储的内容',
                    secure: 'textContent 或显示前进行HTML实体编码'
                });
            }
        } catch (e) {
            console.error('解析用户数据失败:', e);
        }
    }
}

// 处理DOM型XSS (在 blog-detail.html 中根据 URL hash 动态更新内容)
function handleDOMBasedXSS() {
    const articleContentElement = document.getElementById('articleContent');
    const dynamicContentElement = document.getElementById('dynamicContent');
    
    if (articleContentElement && window.location.hash && dynamicContentElement) {
        const hashContent = decodeURIComponent(window.location.hash.substring(1)); // 移除 #
        
        if (hashContent) {
            console.warn('⚠️ DOM型XSS检测：');
            console.log('🔍 URL hash内容:', hashContent);
            console.log('💡 测试方法: 在URL后添加 #<img src=x onerror=alert("DOM型XSS");>');
            console.log('🛡️ 防护状态: 当前使用innerHTML - 存在漏洞');
            
            // 故意使用 innerHTML 模拟 DOM型XSS 漏洞
            // 正确防护应该使用 textContent
            const dynamicDiv = document.createElement('div');
            dynamicDiv.innerHTML = `<div class="dynamic-content-item"><h3>🔍 动态加载内容：</h3><div class="content">${hashContent}</div><p class="warning">⚠️ 此内容通过URL hash动态加载，存在DOM型XSS风险</p></div>`;
            dynamicContentElement.appendChild(dynamicDiv);
            
            // 显示安全建议
            showSecurityAdvice('dom', {
                vulnerable: 'innerHTML 直接插入URL hash内容',
                secure: 'textContent 或对内容进行验证和编码'
            });
        }
    }
}

// 显示安全建议
function showSecurityAdvice(type, details) {
    const adviceContainer = createSecurityAdviceContainer();
    
    const typeNames = {
        'reflected': '反射型XSS',
        'stored': '存储型XSS',
        'stored-display': '存储型XSS显示',
        'dom': 'DOM型XSS'
    };
    
    const adviceHTML = `
        <div class="security-advice ${type}">
            <div class="advice-header">
                <h4><i class="fas fa-shield-alt"></i> ${typeNames[type]} 安全分析</h4>
                <button class="close-advice" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="advice-content">
                <div class="vulnerability">
                    <h5><i class="fas fa-exclamation-triangle"></i> 当前漏洞：</h5>
                    <p>${details.vulnerable}</p>
                </div>
                <div class="solution">
                    <h5><i class="fas fa-check-circle"></i> 安全防护：</h5>
                    <p>${details.secure}</p>
                </div>
                <div class="test-info">
                    <h5><i class="fas fa-flask"></i> 测试说明：</h5>
                    <p>此漏洞仅用于教学演示，实际应用中应立即修复此类安全问题。</p>
                </div>
            </div>
        </div>
    `;
    
    adviceContainer.insertAdjacentHTML('beforeend', adviceHTML);
}

// 创建安全建议容器
function createSecurityAdviceContainer() {
    let container = document.getElementById('securityAdviceContainer');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'securityAdviceContainer';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            left: 20px;
            max-width: 400px;
            z-index: 9999;
        `;
        document.body.appendChild(container);
    }
    
    return container;
}

// 添加安全测试工具
function addSecurityTestTools() {
    // 只在开发环境或特定条件下显示
    if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
        createSecurityTestPanel();
    }
}

// 创建安全测试面板
function createSecurityTestPanel() {
    const panel = document.createElement('div');
    panel.id = 'securityTestPanel';
    panel.innerHTML = `
        <div class="security-panel">
            <div class="panel-header">
                <h3><i class="fas fa-bug"></i> XSS 安全测试面板</h3>
                <button class="toggle-panel" onclick="toggleSecurityPanel()">
                    <i class="fas fa-minus"></i>
                </button>
            </div>
            <div class="panel-content">
                <div class="test-section">
                    <h4>反射型XSS测试</h4>
                    <button onclick="testReflectedXSS()" class="test-btn">
                        <i class="fas fa-search"></i> 测试搜索XSS
                    </button>
                    <button onclick="demonstrateReflectedXSSFix()" class="fix-btn">
                        <i class="fas fa-shield-alt"></i> 演示修复
                    </button>
                </div>
                
                <div class="test-section">
                    <h4>存储型XSS测试</h4>
                    <button onclick="testStoredXSS()" class="test-btn">
                        <i class="fas fa-database"></i> 测试存储XSS
                    </button>
                    <button onclick="demonstrateStoredXSSFix()" class="fix-btn">
                        <i class="fas fa-shield-alt"></i> 演示修复
                    </button>
                </div>
                
                <div class="test-section">
                    <h4>DOM型XSS测试</h4>
                    <button onclick="testDOMXSS()" class="test-btn">
                        <i class="fas fa-code"></i> 测试DOM XSS
                    </button>
                    <button onclick="demonstrateDOMXSSFix()" class="fix-btn">
                        <i class="fas fa-shield-alt"></i> 演示修复
                    </button>
                </div>
                
                <div class="test-section">
                    <h4>清理测试</h4>
                    <button onclick="cleanupXSSTests()" class="cleanup-btn">
                        <i class="fas fa-broom"></i> 清理所有测试
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // 添加样式
    panel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        font-family: monospace;
    `;
    
    document.body.appendChild(panel);
}

// 安全测试函数

// 测试反射型XSS
function testReflectedXSS() {
    const maliciousQuery = '<img src=x onerror=alert("反射型XSS攻击成功！检查blog-list.html")>';
    const currentUrl = new URL(window.location);
    currentUrl.pathname = '/blog-list.html';
    currentUrl.searchParams.set('query', maliciousQuery);
    
    console.log('🧪 执行反射型XSS测试');
    console.log('🔗 测试URL:', currentUrl.href);
    
    if (confirm('即将跳转到blog-list.html进行反射型XSS测试，是否继续？')) {
        window.location.href = currentUrl.href;
    }
}

// 测试存储型XSS
function testStoredXSS() {
    const maliciousPayload = '<img src=x onerror=alert("存储型XSS攻击成功！数据已存储到localStorage");>';
    
    console.log('🧪 执行存储型XSS测试');
    console.log('💾 恶意载荷:', maliciousPayload);
    
    if (confirm('即将向localStorage存储恶意脚本用于存储型XSS测试，是否继续？')) {
        const testUserData = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '12345678901',
            intro: maliciousPayload,
            registeredAt: new Date().toISOString()
        };
        
        localStorage.setItem('registeredUser', JSON.stringify(testUserData));
        localStorage.setItem('isLoggedIn', 'true');
        
        alert('存储型XSS测试数据已保存，请访问首页查看效果');
    }
}

// 测试DOM型XSS
function testDOMXSS() {
    const maliciousHash = '<img src=x onerror=alert("DOM型XSS攻击成功！检查blog-detail.html");>';
    const currentUrl = new URL(window.location);
    currentUrl.pathname = '/blog-detail.html';
    currentUrl.hash = maliciousHash;
    
    console.log('🧪 执行DOM型XSS测试');
    console.log('🔗 测试URL:', currentUrl.href);
    
    if (confirm('即将跳转到blog-detail.html进行DOM型XSS测试，是否继续？')) {
        window.location.href = currentUrl.href;
    }
}

// 演示修复函数

// 演示反射型XSS修复
function demonstrateReflectedXSSFix() {
    console.group('🛡️ 反射型XSS修复演示');
    
    const vulnerableCode = `
// 漏洞代码：
articlesContainer.innerHTML = \`<h2>搜索结果：\${decodeURIComponent(searchQuery)}</h2>\`;
    `;
    
    const secureCode = `
// 安全代码：
articlesContainer.textContent = \`搜索结果：\${decodeURIComponent(searchQuery)}\`;
// 或者：
articlesContainer.innerHTML = \`<h2>搜索结果：\${encodeHTML(decodeURIComponent(searchQuery))}</h2>\`;
    `;
    
    console.log('❌ 漏洞代码:', vulnerableCode);
    console.log('✅ 安全代码:', secureCode);
    console.log('📋 修复要点:');
    console.log('   1. 使用 textContent 替代 innerHTML');
    console.log('   2. 对用户输入进行HTML实体编码');
    console.log('   3. 验证和过滤用户输入');
    
    console.groupEnd();
}

// 演示存储型XSS修复
function demonstrateStoredXSSFix() {
    console.group('🛡️ 存储型XSS修复演示');
    
    const vulnerableCode = `
// 漏洞代码：
localStorage.setItem('userData', JSON.stringify({intro: userInput}));
// 显示时：
element.innerHTML = userData.intro;
    `;
    
    const secureCode = `
// 安全代码：
localStorage.setItem('userData', JSON.stringify({intro: encodeHTML(userInput)}));
// 显示时：
element.textContent = userData.intro;
// 或者：
element.innerHTML = encodeHTML(userData.intro);
    `;
    
    console.log('❌ 漏洞代码:', vulnerableCode);
    console.log('✅ 安全代码:', secureCode);
    console.log('📋 修复要点:');
    console.log('   1. 存储前对用户输入进行编码');
    console.log('   2. 显示时使用 textContent');
    console.log('   3. 实施输入验证和内容安全策略');
    
    console.groupEnd();
}

// 演示DOM型XSS修复
function demonstrateDOMXSSFix() {
    console.group('🛡️ DOM型XSS修复演示');
    
    const vulnerableCode = `
// 漏洞代码：
const hashContent = decodeURIComponent(window.location.hash.substring(1));
element.innerHTML = \`<div>\${hashContent}</div>\`;
    `;
    
    const secureCode = `
// 安全代码：
const hashContent = decodeURIComponent(window.location.hash.substring(1));
element.textContent = hashContent;
// 或者：
element.innerHTML = encodeHTML(hashContent);
    `;
    
    console.log('❌ 漏洞代码:', vulnerableCode);
    console.log('✅ 安全代码:', secureCode);
    console.log('📋 修复要点:');
    console.log('   1. 验证URL参数和hash值');
    console.log('   2. 使用 textContent 替代 innerHTML');
    console.log('   3. 对动态内容进行编码');
    
    console.groupEnd();
}

// 清理XSS测试
function cleanupXSSTests() {
    if (confirm('确定要清理所有XSS测试数据吗？')) {
        localStorage.removeItem('registeredUser');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        
        // 清理动态内容
        const dynamicContent = document.getElementById('dynamicContent');
        if (dynamicContent) {
            dynamicContent.innerHTML = '';
        }
        
        // 清理用户信息显示
        const userInfo = document.getElementById('userInfo');
        if (userInfo) {
            userInfo.style.display = 'none';
        }
        
        // 清理URL参数
        const url = new URL(window.location);
        url.searchParams.delete('query');
        url.hash = '';
        window.history.replaceState({}, document.title, url.pathname);
        
        console.log('🧹 XSS测试数据已清理');
        alert('XSS测试数据已清理完成！');
        
        // 刷新页面
        window.location.reload();
    }
}

// 切换安全测试面板
function toggleSecurityPanel() {
    const panel = document.querySelector('.panel-content');
    const toggleBtn = document.querySelector('.toggle-panel i');
    
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        toggleBtn.className = 'fas fa-minus';
    } else {
        panel.style.display = 'none';
        toggleBtn.className = 'fas fa-plus';
    }
}

// ---------------------------------------------------
// XSS 防护函数 (安全的替代方案)
// ---------------------------------------------------

// HTML 实体编码函数
function encodeHTML(str) {
    if (typeof str !== 'string') return str;
    
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// 安全的搜索结果显示函数
function safeDisplaySearchResults(query) {
    const articlesContainer = document.getElementById('articlesContainer');
    if (!articlesContainer) return;
    
    // 使用安全的方式显示搜索结果
    const headerElement = document.createElement('div');
    headerElement.className = 'search-result-header';
    
    const titleElement = document.createElement('h2');
    titleElement.textContent = `搜索结果：${decodeURIComponent(query)}`; // 安全的textContent
    
    const descElement = document.createElement('p');
    descElement.textContent = '找到相关文章...';
    
    headerElement.appendChild(titleElement);
    headerElement.appendChild(descElement);
    
    articlesContainer.innerHTML = ''; // 清空容器
    articlesContainer.appendChild(headerElement);
    
    console.log('✅ 使用安全的方式显示搜索结果');
}

// 安全的用户信息显示函数
function safeDisplayUserInfo(userData) {
    const introDisplayElement = document.getElementById('introDisplay');
    const userInfoSection = document.getElementById('userInfo');
    
    if (introDisplayElement && userData.intro && userInfoSection) {
        // 创建安全的DOM结构
        const profileDiv = document.createElement('div');
        profileDiv.className = 'user-profile';
        
        const welcomeTitle = document.createElement('h3');
        welcomeTitle.textContent = `欢迎回来，${userData.firstName} ${userData.lastName}！`;
        
        const introSection = document.createElement('div');
        introSection.className = 'user-intro';
        
        const introTitle = document.createElement('h4');
        introTitle.textContent = '个人简介：';
        
        const introContent = document.createElement('div');
        introContent.className = 'intro-content';
        introContent.textContent = userData.intro; // 安全的textContent
        
        const metaSection = document.createElement('div');
        metaSection.className = 'user-meta';
        
        const emailP = document.createElement('p');
        const emailStrong = document.createElement('strong');
        emailStrong.textContent = '邮箱：';
        emailP.appendChild(emailStrong);
        emailP.appendChild(document.createTextNode(userData.email));
        
        const dateP = document.createElement('p');
        const dateStrong = document.createElement('strong');
        dateStrong.textContent = '注册时间：';
        dateP.appendChild(dateStrong);
        dateP.appendChild(document.createTextNode(new Date(userData.registeredAt).toLocaleDateString()));
        
        // 组装DOM结构
        introSection.appendChild(introTitle);
        introSection.appendChild(introContent);
        
        metaSection.appendChild(emailP);
        metaSection.appendChild(dateP);
        
        profileDiv.appendChild(welcomeTitle);
        profileDiv.appendChild(introSection);
        profileDiv.appendChild(metaSection);
        
        introDisplayElement.innerHTML = ''; // 清空容器
        introDisplayElement.appendChild(profileDiv);
        
        userInfoSection.style.display = 'block';
        
        console.log('✅ 使用安全的方式显示用户信息');
    }
}

// 安全的动态内容显示函数
function safeDisplayDynamicContent(content) {
    const dynamicContentElement = document.getElementById('dynamicContent');
    
    if (dynamicContentElement && content) {
        const dynamicDiv = document.createElement('div');
        dynamicDiv.className = 'dynamic-content-item';
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = '🔍 动态加载内容：';
        
        const contentElement = document.createElement('div');
        contentElement.className = 'content';
        contentElement.textContent = content; // 安全的textContent
        
        const warningElement = document.createElement('p');
        warningElement.className = 'warning';
        warningElement.textContent = '✅ 此内容已通过安全编码处理';
        
        dynamicDiv.appendChild(titleElement);
        dynamicDiv.appendChild(contentElement);
        dynamicDiv.appendChild(warningElement);
        
        dynamicContentElement.appendChild(dynamicDiv);
        
        console.log('✅ 使用安全的方式显示动态内容');
    }
}

// ---------------------------------------------------
// HTTP 协议分析辅助
// ---------------------------------------------------

function logHTTPAnalysisInfo() {
    console.group('📡 HTTP 协议分析提示');
    console.log('🔧 推荐工具: 浏览器开发者工具 (F12)');
    console.log('📊 关注要点:');
    console.log('   • Network 面板 - 观察HTTP请求/响应');
    console.log('   • Request URL - 完整的请求地址');
    console.log('   • Request Method - GET/POST/PUT/DELETE');
    console.log('   • Status Code - 200 OK, 404 Not Found, 500 Error');
    console.log('   • Request Headers - Host, User-Agent, Content-Type');
    console.log('   • Response Headers - Content-Type, Set-Cookie');
    console.log('   • Request Payload - POST请求的数据内容');
    console.log('📝 分析步骤:');
    console.log('   1. 打开开发者工具 (F12)');
    console.log('   2. 切换到 Network 面板');
    console.log('   3. 刷新页面或执行操作');
    console.log('   4. 点击请求项查看详细信息');
    console.log('   5. 分析请求头、响应头和载荷');
    console.groupEnd();
}

// ---------------------------------------------------
// 安全测试面板样式
// ---------------------------------------------------

const securityPanelStyles = `
    .security-panel {
        background: #2c3e50;
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        min-width: 300px;
        font-size: 12px;
    }
    
    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #34495e;
        border-radius: 8px 8px 0 0;
        border-bottom: 1px solid #4a5f7a;
    }
    
    .panel-header h3 {
        margin: 0;
        font-size: 14px;
        color: #ecf0f1;
    }
    
    .toggle-panel {
        background: none;
        border: none;
        color: #ecf0f1;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.3s;
    }
    
    .toggle-panel:hover {
        background-color: rgba(255,255,255,0.1);
    }
    
    .panel-content {
        padding: 16px;
    }
    
    .test-section {
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #4a5f7a;
    }
    
    .test-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
    
    .test-section h4 {
        margin: 0 0 8px 0;
        color: #3498db;
        font-size: 13px;
    }
    
    .test-btn, .fix-btn, .cleanup-btn {
        display: inline-block;
        padding: 6px 12px;
        margin: 2px 4px 2px 0;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        font-weight: bold;
        transition: all 0.3s;
    }
    
    .test-btn {
        background: #e74c3c;
        color: white;
    }
    
    .test-btn:hover {
        background: #c0392b;
        transform: translateY(-1px);
    }
    
    .fix-btn {
        background: #27ae60;
        color: white;
    }
    
    .fix-btn:hover {
        background: #229954;
        transform: translateY(-1px);
    }
    
    .cleanup-btn {
        background: #f39c12;
        color: white;
        display: block;
        width: 100%;
    }
    
    .cleanup-btn:hover {
        background: #d68910;
        transform: translateY(-1px);
    }
    
    .security-advice {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        margin-bottom: 16px;
        overflow: hidden;
        border-left: 4px solid #e74c3c;
    }
    
    .advice-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #ecf0f1;
        border-bottom: 1px solid #d5dbdb;
    }
    
    .advice-header h4 {
        margin: 0;
        color: #2c3e50;
        font-size: 14px;
    }
    
    .close-advice {
        background: none;
        border: none;
        color: #7f8c8d;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.3s;
    }
    
    .close-advice:hover {
        background: #d5dbdb;
        color: #2c3e50;
    }
    
    .advice-content {
        padding: 16px;
        color: #2c3e50;
    }
    
    .vulnerability, .solution, .test-info {
        margin-bottom: 12px;
    }
    
    .vulnerability h5, .solution h5, .test-info h5 {
        margin: 0 0 6px 0;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    .vulnerability h5 { color: #e74c3c; }
    .solution h5 { color: #27ae60; }
    .test-info h5 { color: #3498db; }
    
    .vulnerability p, .solution p, .test-info p {
        margin: 0;
        font-size: 11px;
        line-height: 1.4;
    }
`;

// 添加样式到页面
const styleElement = document.createElement('style');
styleElement.textContent = securityPanelStyles;
document.head.appendChild(styleElement);

// 全局暴露安全测试函数
window.testReflectedXSS = testReflectedXSS;
window.testStoredXSS = testStoredXSS;
window.testDOMXSS = testDOMXSS;
window.demonstrateReflectedXSSFix = demonstrateReflectedXSSFix;
window.demonstrateStoredXSSFix = demonstrateStoredXSSFix;
window.demonstrateDOMXSSFix = demonstrateDOMXSSFix;
window.cleanupXSSTests = cleanupXSSTests;
window.toggleSecurityPanel = toggleSecurityPanel;
window.encodeHTML = encodeHTML;
window.safeDisplaySearchResults = safeDisplaySearchResults;
window.safeDisplayUserInfo = safeDisplayUserInfo;
window.safeDisplayDynamicContent = safeDisplayDynamicContent;
