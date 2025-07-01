// 简单的博客文章获取器
class SimpleBlogLoader {
    constructor() {
        this.blogUrl = 'https://auberginewly.site';
        this.init();
    }

    init() {
        // 确保DOM已加载再执行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.loadBlogPosts(), 100);
            });
        } else {
            // DOM已经加载完成
            setTimeout(() => this.loadBlogPosts(), 100);
        }
    }

    // 从你的博客站点获取最新文章
    loadBlogPosts() {
        try {
            // 检查页面是否已经加载完成
            if (!document.querySelector('.article-card')) {
                console.log('等待文章元素加载...');
                return;
            }

            // 更新统计数据
            this.updateStats();
            
            // 获取现有的静态文章列表
            const staticPosts = this.getStaticPosts();
            
            console.log(`博客文章加载完成: ${staticPosts.length} 篇文章`);
        } catch (error) {
            console.log('使用静态文章列表', error.message);
        }
    }

    // 获取静态文章数据
    getStaticPosts() {
        const articleCards = document.querySelectorAll('.article-card');
        return Array.from(articleCards).map(card => {
            const title = card.querySelector('.article-title')?.textContent || '';
            const excerpt = card.querySelector('.article-excerpt')?.textContent || '';
            const date = card.querySelector('.article-date')?.textContent || '';
            const category = card.querySelector('.article-category')?.textContent || '';
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent);
            
            return { title, excerpt, date, category, tags };
        });
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
                    if (tag.textContent) {
                        allTags.add(tag.textContent.trim());
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
            this.updateStatElement('totalViews', totalViews.toLocaleString());
            
            console.log(`统计更新完成: ${totalPosts}篇文章, ${allTags.size}个标签, ${totalViews}次浏览`);
        } catch (error) {
            console.error('更新统计数据失败:', error);
        }
    }

    // 更新统计元素
    updateStatElement(id, value) {
        try {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            } else {
                console.log(`统计元素 ${id} 未找到`);
            }
        } catch (error) {
            console.error(`更新统计元素 ${id} 失败:`, error);
        }
    }
}

// 安全地初始化博客加载器
try {
    const blogLoader = new SimpleBlogLoader();
} catch (error) {
    console.error('博客加载器初始化失败:', error);
}

export default SimpleBlogLoader;
