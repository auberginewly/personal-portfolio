// 简化的博客统计和交互功能
class BlogStaticManager {
    constructor() {
        this.currentView = 'list';
        this.init();
    }

    init() {
        // 确保DOM已加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeFeatures();
            });
        } else {
            this.initializeFeatures();
        }
    }

    initializeFeatures() {
        // 直接初始化功能，不进行动态加载
        this.updateStats();
        this.initViewToggle();
        this.initArticleClicks();
        console.log('博客静态功能初始化完成');
    }

    // 初始化视图切换功能
    initViewToggle() {
        const listBtn = document.querySelector('.toggle-btn[data-view="list"]');
        const gridBtn = document.querySelector('.toggle-btn[data-view="grid"]');
        
        if (!listBtn || !gridBtn) return;

        listBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchView('list');
        });

        gridBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchView('grid');
        });
    }

    // 切换视图
    switchView(view) {
        this.currentView = view;
        
        const listBtn = document.querySelector('.toggle-btn[data-view="list"]');
        const gridBtn = document.querySelector('.toggle-btn[data-view="grid"]');
        const container = document.querySelector('.articles-container');
        
        if (!container) return;

        // 更新按钮状态
        if (listBtn && gridBtn) {
            listBtn.classList.toggle('active', view === 'list');
            gridBtn.classList.toggle('active', view === 'grid');
        }

        // 更新容器类名
        if (view === 'list') {
            container.classList.remove('grid-view');
            container.classList.add('list-view');
        } else {
            container.classList.remove('list-view');
            container.classList.add('grid-view');
        }

        console.log(`视图切换到: ${view}`);
    }

    // 初始化文章点击功能
    initArticleClicks() {
        const articles = document.querySelectorAll('.article-card');
        
        articles.forEach(article => {
            article.addEventListener('click', (e) => {
                e.preventDefault();
                const url = article.dataset.url;
                if (url) {
                    this.showArticleInIframe(url, article);
                }
            });
        });
    }

    // 在iframe中显示文章
    showArticleInIframe(url, articleElement) {
        const iframeSection = document.getElementById('iframeSection');
        const iframe = document.getElementById('blogIframe');
        const iframeTitle = document.getElementById('iframeTitle');
        const openNewTab = document.getElementById('openNewTab');
        const backBtn = document.getElementById('backToList');
        const articlesSection = document.querySelector('.blog-articles-section');
        
        if (!iframeSection || !iframe) return;

        // 设置iframe源和标题
        iframe.src = url;
        const title = articleElement.querySelector('.article-title')?.textContent || '博客文章';
        if (iframeTitle) iframeTitle.textContent = title;
        if (openNewTab) openNewTab.href = url;

        // 显示iframe区域
        if (articlesSection) articlesSection.style.display = 'none';
        iframeSection.style.display = 'block';
        iframeSection.classList.add('show');

        // 绑定返回按钮
        if (backBtn) {
            backBtn.onclick = () => this.hideIframe();
        }

        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 隐藏iframe
    hideIframe() {
        const iframeSection = document.getElementById('iframeSection');
        const articlesSection = document.querySelector('.blog-articles-section');
        const iframe = document.getElementById('blogIframe');
        
        if (iframeSection) {
            iframeSection.classList.remove('show');
            setTimeout(() => {
                iframeSection.style.display = 'none';
                if (iframe) iframe.src = 'about:blank';
            }, 300);
        }
        
        if (articlesSection) {
            articlesSection.style.display = 'block';
        }
    }

    // 更新统计数据
    updateStats() {
        try {
            const articles = document.querySelectorAll('.article-card');
            const totalPosts = articles.length;
            
            if (totalPosts === 0) {
                console.log('没有找到文章元素');
                return;
            }
            
            // 计算总标签数
            const allTags = new Set();
            articles.forEach(article => {
                const tags = article.querySelectorAll('.tag');
                tags.forEach(tag => {
                    const tagText = tag.textContent?.trim();
                    if (tagText && tagText !== '更新中') {
                        allTags.add(tagText);
                    }
                });
            });
            
            // 计算总浏览量
            let totalViews = 0;
            articles.forEach(article => {
                const viewsElement = article.querySelector('.fas.fa-eye')?.parentElement;
                if (viewsElement) {
                    const viewsText = viewsElement.textContent || '';
                    const views = parseInt(viewsText.match(/\d+/)?.[0] || '0');
                    totalViews += views;
                }
            });

            // 更新显示
            this.updateStatElement('totalPosts', totalPosts);
            this.updateStatElement('totalTags', allTags.size);
            this.updateStatElement('totalViews', totalViews > 0 ? totalViews.toLocaleString() : '2.8K+');
            
            console.log(`博客统计更新完成: ${totalPosts}篇文章, ${allTags.size}个标签, ${totalViews}次浏览`);
        } catch (error) {
            console.error('更新统计数据失败:', error);
            // 降级处理
            this.updateStatElement('totalPosts', '15');
            this.updateStatElement('totalTags', '25');
            this.updateStatElement('totalViews', '2.8K+');
        }
    }

    // 更新统计元素
    updateStatElement(id, value) {
        try {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        } catch (error) {
            console.error(`更新统计元素 ${id} 失败:`, error);
        }
    }
}

// 安全地初始化博客管理器
try {
    // 避免重复初始化
    if (!window.blogStaticManagerInitialized) {
        window.blogStaticManagerInitialized = true;
        new BlogStaticManager();
    }
} catch (error) {
    console.error('博客静态管理器初始化失败:', error);
}

export default BlogStaticManager;
