// security.js - Web安全实践与XSS攻击演示

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔒 Security.js loaded - XSS 安全演示模块');
    console.log('⚠️  本模块包含用于教学目的的XSS漏洞演示');
    
    // 初始化安全检测
    initSecurityTests();
    
    // 检查并处理DOM型XSS
    handleDOMBasedXSS();
    
    // 输出HTTP协议分析提示
    logHTTPAnalysisInfo();
});

// 初始化安全测试
function initSecurityTests() {
    console.group('🛡️ XSS 安全检测');
    
    // 检查当前页面的XSS测试点
    checkXSSTestPoints();
    
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
            
        case 'todo.html':
            console.log('📍 检测到反射型XSS测试点: 待办事项搜索功能');
            checkTodoReflectedXSS();
            break;
            
        case 'register.html':
            console.log('📍 检测到存储型XSS测试点: 注册表单个人简介字段');
            checkStoredXSS();
            initRegisterXSSDemo();
            break;
            
        case 'index.html':
            console.log('📍 检测到存储型XSS显示点: 用户信息展示');
            checkStoredXSSDisplay();
            break;
            
        default:
            console.log('📍 当前页面无特定XSS测试点');
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
    }
}

// 检查Todo页面反射型XSS
function checkTodoReflectedXSS() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        console.warn('⚠️ Todo反射型XSS检测：');
        console.log('🔍 URL参数 search:', searchQuery);
        console.log('💡 测试方法: 在URL中添加 ?search=<img src=x onerror=alert("Todo反射型XSS")>');
        console.log('🛡️ 防护状态: 当前使用innerHTML - 存在漏洞');
        
        // 创建XSS演示区域
        createTodoXSSDemo(searchQuery);
        
        // 自动填充搜索框并显示结果
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = decodeURIComponent(searchQuery);
            // 触发搜索显示
            displayTodoSearchResults(searchQuery);
        }
    }
}

// 检查存储型XSS
function checkStoredXSS() {
    console.warn('⚠️ 存储型XSS测试点：');
    console.log('🔍 测试位置: 注册表单个人简介字段');
    console.log('💡 测试方法: 在个人简介中输入 <img src=x onerror=alert("存储型XSS")>');
    console.log('🛡️ 防护状态: 当前直接存储到localStorage - 存在漏洞');
}

// 检查存储型XSS显示
function checkStoredXSSDisplay() {
    // 检查原有的用户数据
    const storedUser = localStorage.getItem('registeredUser');
    
    if (storedUser) {
        try {
            const userData = JSON.parse(storedUser);
            if (userData.intro) {
                console.warn('⚠️ 存储型XSS显示检测：');
                console.log('🔍 发现存储的用户简介:', userData.intro);
                console.log('💡 显示方式: innerHTML 直接渲染 - 存在漏洞');
                console.log('🛡️ 建议: 使用textContent或HTML实体编码');
            }
        } catch (e) {
            console.error('解析用户数据失败:', e);
        }
    }
    
    // 检查XSS演示数据
    const xssData = localStorage.getItem('xss_demo_data');
    if (xssData) {
        try {
            const xssInfo = JSON.parse(xssData);
            console.warn('⚠️ 存储型XSS演示检测：');
            console.log('🔍 发现存储的XSS数据:', xssInfo);
            console.log('💡 存储时间:', xssInfo.timestamp);
            console.log('🛡️ 即将显示存储的XSS内容');
            
            // 显示存储型XSS效果
            displayStoredXSS(xssInfo);
        } catch (e) {
            console.error('解析XSS数据失败:', e);
        }
    }
}

// 显示存储型XSS效果
function displayStoredXSS(xssInfo) {
    // 创建显示区域
    let displayContainer = document.getElementById('storedXSSDisplay');
    if (!displayContainer) {
        displayContainer = document.createElement('div');
        displayContainer.id = 'storedXSSDisplay';
        displayContainer.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            max-width: 400px;
            background: #d1ecf1;
            border: 1px solid #bee5eb;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
            font-size: 14px;
        `;
        document.body.appendChild(displayContainer);
    }
    
    // 故意使用innerHTML直接渲染存储的内容（存在XSS漏洞）
    displayContainer.innerHTML = `
        <div style="border-left: 4px solid #17a2b8; padding-left: 10px;">
            <h4 style="margin: 0 0 8px 0; color: #17a2b8;">💾 存储型XSS显示</h4>
            <p style="margin: 0 0 8px 0; font-size: 12px;">从注册页面存储的内容：</p>
            <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; border: 1px solid #dee2e6;">
                ${xssInfo.content}
            </div>
            <p style="margin: 8px 0 0 0; font-size: 11px; color: #6c757d;">
                存储时间: ${new Date(xssInfo.timestamp).toLocaleString()}
            </p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #dc3545;">
                ⚠️ 此内容使用innerHTML直接渲染，存在存储型XSS风险！
            </p>
        </div>
    `;
    
    // 添加清除按钮
    const clearButton = document.createElement('button');
    clearButton.textContent = '🗑️ 清除XSS数据';
    clearButton.style.cssText = `
        margin-top: 8px;
        padding: 6px 12px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        width: 100%;
    `;
    clearButton.onclick = function() {
        localStorage.removeItem('xss_demo_data');
        displayContainer.remove();
        console.log('🗑️ XSS演示数据已清除');
        alert('存储型XSS演示数据已清除');
    };
    displayContainer.appendChild(clearButton);
}

// 处理DOM型XSS
function handleDOMBasedXSS() {
    // 检查URL hash中是否有内容
    if (window.location.hash) {
        const hashContent = decodeURIComponent(window.location.hash.substring(1));
        
        if (hashContent) {
            console.warn('⚠️ DOM型XSS检测：');
            console.log('🔍 URL hash内容:', hashContent);
            console.log('💡 测试方法: 在URL后添加 #<img src=x onerror=alert("DOM型XSS")>');
            console.log('🛡️ 当前状态: 会直接插入DOM - 存在潜在风险');
            
            // 创建动态内容展示区域（如果不存在）
            let dynamicContentElement = document.getElementById('dynamicContent');
            if (!dynamicContentElement) {
                dynamicContentElement = document.createElement('div');
                dynamicContentElement.id = 'dynamicContent';
                dynamicContentElement.style.cssText = `
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    max-width: 300px;
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 8px;
                    padding: 15px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    z-index: 1000;
                    font-size: 14px;
                `;
                document.body.appendChild(dynamicContentElement);
            }
            
            // 故意使用 innerHTML 模拟 DOM型XSS 漏洞
            const dynamicDiv = document.createElement('div');
            dynamicDiv.innerHTML = `
                <div style="border-left: 4px solid #dc3545; padding-left: 10px;">
                    <h4 style="margin: 0 0 8px 0; color: #dc3545;">⚠️ DOM型XSS演示</h4>
                    <p style="margin: 0 0 8px 0; font-size: 12px;">动态内容：</p>
                    <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; word-break: break-all; cursor: pointer;">
                        ${hashContent}
                    </div>
                    <p style="margin: 8px 0 0 0; font-size: 11px; color: #6c757d;">
                        此内容直接从URL hash插入，存在XSS风险
                    </p>
                    <p style="margin: 4px 0 0 0; font-size: 10px; color: #dc3545;">
                        💡 提示：如果是onclick事件，请点击上面的内容触发
                    </p>
                </div>
            `;
            dynamicContentElement.appendChild(dynamicDiv);
            
            // 添加一个测试按钮，直接执行XSS测试
            const testButton = document.createElement('button');
            testButton.textContent = '🧪 测试DOM型XSS';
            testButton.style.cssText = `
                margin-top: 8px;
                padding: 6px 12px;
                background: #dc3545;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            `;
            testButton.onclick = function() {
                alert('DOM型XSS测试成功！hash内容：' + hashContent);
            };
            dynamicDiv.appendChild(testButton);
            
            // 直接尝试执行某些自动触发的XSS payload
            if (hashContent.includes('onerror') || hashContent.includes('onload')) {
                // 对于包含onerror或onload的payload，创建一个临时容器直接执行
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = hashContent;
                document.body.appendChild(tempDiv);
                
                // 1秒后移除临时元素
                setTimeout(() => {
                    if (document.body.contains(tempDiv)) {
                        document.body.removeChild(tempDiv);
                    }
                }, 1000);
            }
        }
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
        
        // 组装DOM结构
        introSection.appendChild(introTitle);
        introSection.appendChild(introContent);
        profileDiv.appendChild(welcomeTitle);
        profileDiv.appendChild(introSection);
        
        introDisplayElement.innerHTML = ''; // 清空容器
        introDisplayElement.appendChild(profileDiv);
        
        userInfoSection.style.display = 'block';
        
        console.log('✅ 使用安全的方式显示用户信息');
    }
}

// ---------------------------------------------------
// HTTP 协议分析辅助
// ---------------------------------------------------

function logHTTPAnalysisInfo() {
    console.group('📡 HTTP 协议分析指南');
    console.log('');
    console.log('🔧 使用浏览器开发者工具进行HTTP协议分析：');
    console.log('');
    console.log('📋 操作步骤：');
    console.log('   1. 按 F12 打开开发者工具');
    console.log('   2. 切换到 Network (网络) 面板');
    console.log('   3. 刷新页面或执行操作');
    console.log('   4. 点击任意请求查看详细信息');
    console.log('');
    console.log('📊 重点分析字段：');
    console.log('   • Request URL - 请求地址');
    console.log('   • Request Method - GET/POST方法');
    console.log('   • Status Code - 响应状态码');
    console.log('   • Request Headers:');
    console.log('     - Host: 目标主机');
    console.log('     - User-Agent: 浏览器标识');
    console.log('     - Content-Type: 内容类型');
    console.log('     - Cookie: 会话信息');
    console.log('   • Response Headers:');
    console.log('     - Content-Type: 响应内容类型');
    console.log('     - Set-Cookie: 设置Cookie');
    console.log('     - X-Frame-Options: 防点击劫持');
    console.log('     - X-XSS-Protection: XSS防护');
    console.log('');
    console.log('🆚 GET vs POST 差异分析：');
    console.log('   GET: 参数在URL中，适合查询操作');
    console.log('   POST: 参数在请求体中，适合提交数据');
    console.log('');
    console.groupEnd();
}

// 创建Todo页面XSS演示区域
function createTodoXSSDemo(searchQuery) {
    // 创建演示区域（如果不存在）
    let demoElement = document.getElementById('todoXSSDemo');
    if (!demoElement) {
        demoElement = document.createElement('div');
        demoElement.id = 'todoXSSDemo';
        demoElement.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            max-width: 350px;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
            font-size: 14px;
        `;
        document.body.appendChild(demoElement);
    }
    
    // 添加演示内容
    const demoDiv = document.createElement('div');
    demoDiv.innerHTML = `
        <div style="border-left: 4px solid #ff9800; padding-left: 10px;">
            <h4 style="margin: 0 0 8px 0; color: #ff9800;">🔍 Todo反射型XSS演示</h4>
            <p style="margin: 0 0 8px 0; font-size: 12px;">搜索内容：</p>
            <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; word-break: break-all; cursor: pointer;">
                ${searchQuery}
            </div>
            <p style="margin: 8px 0 0 0; font-size: 11px; color: #6c757d;">
                搜索参数直接反射到页面，存在XSS风险
            </p>
        </div>
    `;
    demoElement.appendChild(demoDiv);
    
    // 添加测试按钮
    const testButton = document.createElement('button');
    testButton.textContent = '🧪 测试反射型XSS';
    testButton.style.cssText = `
        margin-top: 8px;
        padding: 6px 12px;
        background: #ff9800;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
    `;
    testButton.onclick = function() {
        alert('Todo反射型XSS测试成功！搜索内容：' + decodeURIComponent(searchQuery));
    };
    demoDiv.appendChild(testButton);
    
    // 对于自动触发的payload，直接执行
    if (searchQuery.includes('onerror') || searchQuery.includes('onload') || searchQuery.includes('<script>')) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = searchQuery;
        document.body.appendChild(tempDiv);
        
        // 1秒后移除临时元素
        setTimeout(() => {
            if (document.body.contains(tempDiv)) {
                document.body.removeChild(tempDiv);
            }
        }, 1000);
    }
}

// 显示Todo搜索结果（存在XSS漏洞的版本）
function displayTodoSearchResults(searchQuery) {
    // 查找或创建搜索结果显示区域
    let resultsContainer = document.getElementById('todoSearchResults');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'todoSearchResults';
        resultsContainer.style.cssText = `
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #007bff;
        `;
        
        // 插入到搜索区域后面
        const searchSection = document.querySelector('.search-filter-section');
        if (searchSection) {
            searchSection.insertAdjacentElement('afterend', resultsContainer);
        } else {
            // 如果找不到搜索区域，插入到统计面板前面
            const statsSection = document.querySelector('.todo-stats');
            if (statsSection) {
                statsSection.insertAdjacentElement('beforebegin', resultsContainer);
            }
        }
    }
    
    // 故意使用innerHTML创建XSS漏洞（用于演示）
    resultsContainer.innerHTML = `
        <h3 style="margin: 0 0 10px 0; color: #007bff;">
            <i class="fas fa-search"></i> 搜索结果
        </h3>
        <p style="margin: 0 0 10px 0; font-size: 14px;">
            搜索关键词：<span style="background: #e3f2fd; padding: 2px 6px; border-radius: 4px;">${searchQuery}</span>
        </p>
        <div style="background: white; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6;">
            <p style="margin: 0; color: #6c757d;">
                正在搜索包含 "${searchQuery}" 的待办事项...
            </p>
            <div style="margin-top: 10px; padding: 8px; background: #fff3cd; border-radius: 4px; border-left: 3px solid #ffc107;">
                <strong>⚠️ 安全警告：</strong> 此处使用innerHTML直接渲染用户输入，存在反射型XSS风险！
            </div>
        </div>
    `;
}

// 初始化注册页面XSS演示
function initRegisterXSSDemo() {
    const introField = document.getElementById('intro');
    if (!introField) return;
    
    console.log('💾 初始化存储型XSS演示');
    
    // 创建演示区域
    createRegisterXSSDemo();
    
    // 监听个人简介字段输入
    introField.addEventListener('input', function(e) {
        const content = e.target.value;
        if (content && (content.includes('<') || content.includes('script') || content.includes('onerror') || content.includes('onload'))) {
            updateRegisterXSSDemo(content);
        }
    });
    
    // 拦截表单提交，演示存储型XSS
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // 保存原始的提交处理函数引用
        const originalSubmitHandler = registerForm.onsubmit;
        
        registerForm.addEventListener('submit', function(e) {
            const introContent = introField.value.trim();
            if (introContent && (introContent.includes('<') || introContent.includes('script'))) {
                console.warn('⚠️ 存储型XSS检测：检测到可疑内容将被存储');
                console.log('🔍 个人简介内容:', introContent);
                
                // 演示存储XSS payload
                demoStoredXSS(introContent);
            }
        }, true); // 使用捕获模式，确保在原始处理函数之前执行
    }
}

// 创建注册页面XSS演示区域
function createRegisterXSSDemo() {
    let demoElement = document.getElementById('registerXSSDemo');
    if (!demoElement) {
        demoElement = document.createElement('div');
        demoElement.id = 'registerXSSDemo';
        demoElement.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            max-width: 350px;
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
            font-size: 14px;
            display: none;
        `;
        document.body.appendChild(demoElement);
    }
    
    demoElement.innerHTML = `
        <div style="border-left: 4px solid #dc3545; padding-left: 10px;">
            <h4 style="margin: 0 0 8px 0; color: #dc3545;">💾 存储型XSS演示</h4>
            <p style="margin: 0 0 8px 0; font-size: 12px;">检测到可疑内容：</p>
            <div id="xssContent" style="background: #f8f9fa; padding: 8px; border-radius: 4px; word-break: break-all; max-height: 100px; overflow-y: auto;">
                等待输入...
            </div>
            <p style="margin: 8px 0 4px 0; font-size: 11px; color: #6c757d;">
                此内容将存储到localStorage并在首页显示
            </p>
            <button id="testStoredXSS" style="
                margin-top: 8px;
                padding: 6px 12px;
                background: #dc3545;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                width: 100%;
            ">
                🧪 测试存储型XSS
            </button>
        </div>
    `;
    
    // 绑定测试按钮事件
    document.getElementById('testStoredXSS').onclick = function() {
        const content = document.getElementById('xssContent').textContent;
        if (content && content !== '等待输入...') {
            alert('存储型XSS测试！内容：' + content);
            // 模拟跳转到首页查看效果
            const confirmed = confirm('是否跳转到首页查看存储型XSS效果？');
            if (confirmed) {
                window.location.href = 'index.html';
            }
        } else {
            alert('请先在个人简介中输入XSS payload');
        }
    };
}

// 更新注册页面XSS演示内容
function updateRegisterXSSDemo(content) {
    const demoElement = document.getElementById('registerXSSDemo');
    const contentElement = document.getElementById('xssContent');
    
    if (demoElement && contentElement) {
        demoElement.style.display = 'block';
        contentElement.textContent = content;
        
        console.warn('⚠️ 存储型XSS预警：检测到可疑输入');
        console.log('🔍 输入内容:', content);
    }
}

// 演示存储型XSS
function demoStoredXSS(content) {
    // 将XSS payload存储到localStorage（故意不进行过滤）
    const xssData = {
        content: content,
        timestamp: new Date().toISOString(),
        type: 'stored_xss_demo'
    };
    
    localStorage.setItem('xss_demo_data', JSON.stringify(xssData));
    console.log('💾 XSS数据已存储到localStorage:', xssData);
    
    // 显示存储成功提示
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #d4edda;
        border: 1px solid #c3e6cb;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 2000;
        text-align: center;
        max-width: 400px;
    `;
    
    notification.innerHTML = `
        <h3 style="margin: 0 0 10px 0; color: #155724;">✅ 存储型XSS演示</h3>
        <p style="margin: 0 0 10px 0;">XSS Payload已成功存储！</p>
        <p style="margin: 0 0 15px 0; font-size: 14px; color: #6c757d;">
            前往首页查看存储型XSS效果
        </p>
        <button onclick="window.location.href='index.html'" style="
            padding: 8px 16px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
        ">
            前往首页
        </button>
        <button onclick="this.parentElement.remove()" style="
            padding: 8px 16px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        ">
            关闭
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // 5秒后自动关闭
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 5000);
}

// 导出防护函数供外部使用
window.encodeHTML = encodeHTML;
window.safeDisplaySearchResults = safeDisplaySearchResults;
window.safeDisplayUserInfo = safeDisplayUserInfo;
window.createTodoXSSDemo = createTodoXSSDemo;
window.displayTodoSearchResults = displayTodoSearchResults;
window.initRegisterXSSDemo = initRegisterXSSDemo;
window.displayStoredXSS = displayStoredXSS;
