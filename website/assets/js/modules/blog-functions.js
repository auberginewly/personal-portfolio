// blog-functions.js - 博客功能模块

let currentView = 'list';
let currentIframeArticle = null;

// 博客文章数据
const blogArticles = [
    {
        title: "Modern JavaScript ES6+ Features",
        summary: "深入探讨ES6+的新特性，包括箭头函数、解构赋值、模板字符串等",
        date: "2024-03-15",
        category: "JavaScript",
        tags: ["JavaScript", "ES6", "前端"],
        readTime: "8 min",
        link: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Introduction"
    },
    {
        title: "React Hook 最佳实践",
        summary: "分享React Hook的使用技巧和最佳实践，提高组件开发效率",
        date: "2024-03-10",
        category: "React",
        tags: ["React", "Hooks", "前端"],
        readTime: "12 min",
        link: "https://zh-hans.reactjs.org/docs/hooks-intro.html"
    },
    {
        title: "CSS Grid 完全指南",
        summary: "从基础到高级，全面掌握CSS Grid布局系统",
        date: "2024-03-05",
        category: "CSS",
        tags: ["CSS", "布局", "Grid"],
        readTime: "15 min",
        link: "https://css-tricks.com/snippets/css/complete-guide-grid/"
    },
    {
        title: "Node.js 性能优化实战",
        summary: "Node.js应用的性能瓶颈分析和优化策略",
        date: "2024-02-28",
        category: "Node.js",
        tags: ["Node.js", "性能", "后端"],
        readTime: "20 min",
        link: "https://nodejs.org/en/docs/guides/simple-profiling/"
    },
    {
        title: "TypeScript 进阶技巧",
        summary: "掌握TypeScript的高级类型系统和实用技巧",
        date: "2024-02-20",
        category: "TypeScript",
        tags: ["TypeScript", "类型系统", "前端"],
        readTime: "18 min",
        link: "https://www.typescriptlang.org/docs/"
    },
    {
        title: "Vue 3 Composition API 深度解析",
        summary: "Vue 3 Composition API的设计理念和实际应用",
        date: "2024-02-15",
        category: "Vue",
        tags: ["Vue", "Composition API", "前端"],
        readTime: "14 min",
        link: "https://vuejs.org/guide/introduction.html"
    },
    {
        title: "前端工程化实践",
        summary: "现代前端项目的工程化配置和最佳实践",
        date: "2024-02-10",
        category: "工程化",
        tags: ["工程化", "Webpack", "Vite"],
        readTime: "25 min",
        link: "https://webpack.js.org/concepts/"
    },
    {
        title: "GraphQL 入门与实战",
        summary: "GraphQL的核心概念和在实际项目中的应用",
        date: "2024-02-05",
        category: "GraphQL",
        tags: ["GraphQL", "API", "数据查询"],
        readTime: "16 min",
        link: "https://graphql.org/learn/"
    },
    {
        title: "Web 安全最佳实践",
        summary: "前端安全防护措施和常见漏洞预防",
        date: "2024-01-30",
        category: "安全",
        tags: ["Web安全", "XSS", "CSRF"],
        readTime: "22 min",
        link: "https://owasp.org/www-project-top-ten/"
    },
    {
        title: "微前端架构设计",
        summary: "微前端的架构模式和技术选型",
        date: "2024-01-25",
        category: "架构",
        tags: ["微前端", "架构", "模块化"],
        readTime: "30 min",
        link: "https://micro-frontends.org/"
    },
    {
        title: "PWA 开发指南",
        summary: "Progressive Web App的开发流程和最佳实践",
        date: "2024-01-20",
        category: "PWA",
        tags: ["PWA", "离线应用", "性能"],
        readTime: "28 min",
        link: "https://web.dev/progressive-web-apps/"
    },
    {
        title: "前端监控与错误追踪",
        summary: "前端应用的监控方案和错误处理策略",
        date: "2024-01-15",
        category: "监控",
        tags: ["监控", "错误处理", "性能"],
        readTime: "24 min",
        link: "https://sentry.io/for/javascript/"
    },
    {
        title: "Serverless 前端部署",
        summary: "使用Serverless技术部署前端应用",
        date: "2024-01-10",
        category: "部署",
        tags: ["Serverless", "部署", "云计算"],
        readTime: "20 min",
        link: "https://vercel.com/docs"
    },
    {
        title: "Web Components 实战",
        summary: "原生Web Components的开发和应用场景",
        date: "2024-01-05",
        category: "Web Components",
        tags: ["Web Components", "原生", "组件"],
        readTime: "26 min",
        link: "https://developer.mozilla.org/en-US/docs/Web/Web_Components"
    },
    {
        title: "前端性能优化策略",
        summary: "全面的前端性能优化方法和工具",
        date: "2024-01-01",
        category: "性能",
        tags: ["性能优化", "加载速度", "用户体验"],
        readTime: "32 min",
        link: "https://web.dev/performance/"
    }
];

// 更新博客统计信息
function updateBlogStats() {
    const totalPosts = document.querySelector('#totalPosts');
    const totalViews = document.querySelector('#totalViews');
    const totalTags = document.querySelector('#totalTags');
    
    if (totalPosts) {
        totalPosts.textContent = blogArticles.length;
    }
    
    if (totalViews) {
        // 计算模拟浏览量
        const views = blogArticles.length * 150 + Math.floor(Math.random() * 500);
        totalViews.textContent = views.toLocaleString();
    }
    
    if (totalTags) {
        // 计算所有唯一标签数量
        const allTags = new Set();
        blogArticles.forEach(article => {
            article.tags.forEach(tag => allTags.add(tag));
        });
        totalTags.textContent = allTags.size;
    }
}

// 基于HTML内容更新博客统计信息
function updateBlogStatsFromHTML() {
    const articles = document.querySelectorAll('#articlesFallback .article-card');
    const totalPosts = document.querySelector('#totalPosts');
    const totalViews = document.querySelector('#totalViews');
    const totalTags = document.querySelector('#totalTags');
    
    if (totalPosts) {
        totalPosts.textContent = articles.length;
    }
    
    if (totalViews) {
        // 从文章中提取浏览量并计算总和
        let totalViewCount = 0;
        articles.forEach(article => {
            const viewElement = article.querySelector('.article-stats span:first-child');
            if (viewElement) {
                const viewText = viewElement.textContent;
                const viewNumber = parseInt(viewText.replace(/\D/g, '')) || 0;
                totalViewCount += viewNumber;
            }
        });
        totalViews.textContent = totalViewCount.toLocaleString();
    }
    
    if (totalTags) {
        // 计算所有唯一标签数量
        const allTags = new Set();
        articles.forEach(article => {
            const tags = article.querySelectorAll('.tag');
            tags.forEach(tag => {
                if (!tag.classList.contains('updating')) {
                    allTags.add(tag.textContent.trim());
                }
            });
        });
        totalTags.textContent = allTags.size;
    }
    
    console.log(`统计信息更新完成：${articles.length}篇文章，${totalTags ? totalTags.textContent : 0}个标签`);
}

// 渲染文章列表
function renderArticleList() {
    console.log('开始渲染文章列表...');
    
    // 隐藏加载状态
    const loadingElement = document.querySelector('.articles-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
        console.log('隐藏加载状态');
    }
    
    // 优先显示HTML中的真实文章数据
    const fallbackContainer = document.querySelector('#articlesFallback');
    if (fallbackContainer && fallbackContainer.children.length > 0) {
        console.log('使用HTML中的真实文章数据');
        fallbackContainer.style.display = 'grid';
        fallbackContainer.classList.add('article-list');
        
        // 为现有的文章卡片添加点击事件和改进样式
        addClickEventsToExistingCards();
        updateBlogStatsFromHTML();
        console.log('真实文章数据显示完成');
        return;
    }
    
    // 如果没有真实数据，才使用动态容器和模拟数据
    let articleContainer = document.querySelector('.article-list');
    
    if (articleContainer) {
        console.log('使用动态文章容器（模拟数据）');
        articleContainer.innerHTML = blogArticles.map(article => `
            <article class="article-card" data-link="${article.link}" data-title="${article.title}">
                <div class="article-meta">
                    <span class="article-date">${article.date}</span>
                    <span class="article-category">${article.category}</span>
                </div>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.summary}</p>
                <div class="article-tags">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="article-stats">
                    <span><i class="fas fa-clock"></i> ${article.readTime}</span>
                </div>
            </article>
        `).join('');
        
        // 显示容器
        articleContainer.style.display = 'grid';
        
        // 添加文章点击事件
        document.querySelectorAll('.article-card').forEach(card => {
            card.addEventListener('click', () => {
                const link = card.dataset.link || card.dataset.url;
                const title = card.dataset.title || card.querySelector('.article-title').textContent;
                openArticleInIframe(link, title);
            });
        });
        
        // 更新统计信息
        updateBlogStats();
        
        console.log(`渲染完成，共 ${blogArticles.length} 篇文章`);
    } else {
        // 如果没有动态容器，使用备用容器
        console.log('未找到动态容器，使用备用容器');
        forceShowBlogData();
    }
}

// 强制显示博客数据
function forceShowBlogData() {
    console.log('强制显示博客数据...');
    
    // 隐藏加载状态
    const loadingElement = document.querySelector('.articles-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    // 尝试显示任何可能的文章容器
    const containers = [
        document.querySelector('#articlesContainer'),
        document.querySelector('#articlesFallback'),
        document.querySelector('.articles-container'),
        document.querySelector('.articles-fallback')
    ];
    
    let activeContainer = null;
    for (const container of containers) {
        if (container) {
            container.style.display = 'grid';
            activeContainer = container;
            console.log('找到并显示容器:', container.id || container.className);
            break;
        }
    }
    
    if (activeContainer) {
        // 为现有文章卡片添加事件
        addClickEventsToExistingCards();
    } else {
        console.error('无法找到任何文章容器');
    }
}

// 为现有的文章卡片添加点击事件
function addClickEventsToExistingCards() {
    document.querySelectorAll('.article-card').forEach(card => {
        // 移除旧的事件监听器（如果有的话）
        card.replaceWith(card.cloneNode(true));
    });
    
    // 重新添加事件监听器
    document.querySelectorAll('.article-card').forEach(card => {
        card.addEventListener('click', () => {
            const link = card.dataset.url || card.dataset.link;
            const title = card.querySelector('.article-title').textContent;
            if (link && title) {
                openArticleInIframe(link, title);
            }
        });
    });
}

// 在iframe中打开文章
function openArticleInIframe(url, title) {
    const iframeContainer = document.querySelector('.iframe-container');
    const articleIframe = document.querySelector('#blogIframe') || document.querySelector('#article-iframe');
    const iframeTitle = document.querySelector('#iframeTitle') || document.querySelector('.iframe-title');
    const iframeSection = document.querySelector('.blog-iframe-section');
    const articlesSection = document.querySelector('.blog-articles-section');
    const authorSection = document.querySelector('.blog-author-section');
    const openNewTab = document.querySelector('#openNewTab');
    
    if (iframeContainer && articleIframe && iframeTitle) {
        currentIframeArticle = { url, title };
        iframeTitle.textContent = title;
        articleIframe.src = url;
        
        // 设置新窗口打开链接
        if (openNewTab) {
            openNewTab.href = url;
        }
        
        // 如果有iframe section，显示它并隐藏其他部分
        if (iframeSection) {
            // 先淡出其他部分
            if (articlesSection) {
                articlesSection.style.opacity = '0';
                articlesSection.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    articlesSection.style.display = 'none';
                }, 300);
            }
            if (authorSection) {
                authorSection.style.opacity = '0';
                authorSection.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    authorSection.style.display = 'none';
                }, 300);
            }
            
            // 显示并淡入iframe部分
            setTimeout(() => {
                iframeSection.style.display = 'block';
                iframeSection.classList.add('show');
            }, 350);
        } else {
            // 否则只显示iframe容器
            iframeContainer.style.display = 'block';
        }
        
        // 滚动到iframe位置
        setTimeout(() => {
            if (iframeSection) {
                iframeSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                iframeContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }, 400);
        
        console.log(`正在加载文章: ${title} - ${url}`);
    } else {
        console.error('无法找到iframe相关元素:', {
            iframeContainer: !!iframeContainer,
            articleIframe: !!articleIframe,
            iframeTitle: !!iframeTitle
        });
    }
}

// 关闭iframe
function closeIframe() {
    const iframeContainer = document.querySelector('.iframe-container');
    const articleIframe = document.querySelector('#blogIframe') || document.querySelector('#article-iframe');
    const iframeSection = document.querySelector('.blog-iframe-section');
    const articlesSection = document.querySelector('.blog-articles-section');
    const authorSection = document.querySelector('.blog-author-section');
    
    if (iframeContainer && articleIframe) {
        // 如果有iframe section，隐藏它并显示其他部分
        if (iframeSection) {
            // 先淡出iframe部分
            iframeSection.classList.remove('show');
            
            setTimeout(() => {
                iframeSection.style.display = 'none';
                
                // 显示并淡入其他部分
                if (articlesSection) {
                    articlesSection.style.display = 'block';
                    setTimeout(() => {
                        articlesSection.style.opacity = '1';
                        articlesSection.style.transform = 'translateY(0)';
                    }, 50);
                }
                if (authorSection) {
                    authorSection.style.display = 'block';
                    setTimeout(() => {
                        authorSection.style.opacity = '1';
                        authorSection.style.transform = 'translateY(0)';
                    }, 100);
                }
            }, 300);
        } else {
            // 否则只隐藏iframe容器
            iframeContainer.style.display = 'none';
        }
        
        articleIframe.src = '';
        currentIframeArticle = null;
        
        // 滚动到页面顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        console.log('返回文章列表');
    }
}

// 视图切换
function switchView(view) {
    currentView = view;
    
    // 找到文章容器（优先使用可见的容器）
    const articlesContainer = document.querySelector('#articlesContainer');
    const articlesFallback = document.querySelector('#articlesFallback');
    const activeContainer = (articlesContainer && articlesContainer.style.display !== 'none') 
        ? articlesContainer 
        : articlesFallback;
    
    // 找到切换按钮
    const listBtn = document.querySelector('.toggle-btn[data-view="list"]');
    const gridBtn = document.querySelector('.toggle-btn[data-view="grid"]');
    
    if (!activeContainer) return;
    
    // 添加过渡动画
    activeContainer.style.opacity = '0';
    activeContainer.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        if (view === 'list') {
            // 移除网格视图样式
            activeContainer.classList.remove('grid-view');
            
            // 更新按钮状态
            if (listBtn) {
                listBtn.classList.add('active');
            }
            if (gridBtn) {
                gridBtn.classList.remove('active');
            }
            
            console.log('切换到列表视图');
        } else if (view === 'grid') {
            // 添加网格视图样式
            activeContainer.classList.add('grid-view');
            
            // 更新按钮状态
            if (listBtn) {
                listBtn.classList.remove('active');
            }
            if (gridBtn) {
                gridBtn.classList.add('active');
            }
            
            console.log('切换到网格视图');
        }
        
        // 恢复显示并添加动画
        activeContainer.style.opacity = '1';
        activeContainer.style.transform = 'scale(1)';
        
        // 重新触发文章卡片动画
        const articleCards = activeContainer.querySelectorAll('.article-card');
        articleCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
        
    }, 150);
}

// 初始化博客功能
function initBlogFunctions() {
    // 渲染文章列表
    renderArticleList();
    
    // 视图切换按钮 - 使用正确的选择器
    const listBtn = document.querySelector('.toggle-btn[data-view="list"]');
    const gridBtn = document.querySelector('.toggle-btn[data-view="grid"]');
    
    if (listBtn) {
        listBtn.addEventListener('click', () => {
            console.log('点击列表视图按钮');
            switchView('list');
        });
    } else {
        console.warn('未找到列表视图按钮');
    }
    
    if (gridBtn) {
        gridBtn.addEventListener('click', () => {
            console.log('点击网格视图按钮');
            switchView('grid');
        });
    } else {
        console.warn('未找到网格视图按钮');
    }
    
    // 关闭iframe按钮 - 兼容两种不同的按钮ID
    const closeBtn = document.querySelector('.close-iframe') || document.querySelector('#backToList');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeIframe);
    }
    
    // 返回顶部按钮
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 监听滚动显示返回顶部按钮
    window.addEventListener('scroll', () => {
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        }
    });
    
    console.log('博客功能初始化完成');
}

// 导出函数
export { 
    initBlogFunctions, 
    renderArticleList, 
    forceShowBlogData,
    addClickEventsToExistingCards,
    openArticleInIframe, 
    closeIframe, 
    switchView, 
    blogArticles,
    updateBlogStats,
    updateBlogStatsFromHTML
};
