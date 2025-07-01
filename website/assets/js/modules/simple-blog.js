// 简单的博客文章获取器
class SimpleBlogLoader {
    constructor() {
        this.blogUrl = 'https://auberginewly.site';
        this.init();
    }

    init() {
        // 页面加载完成后，尝试获取文章数据
        document.addEventListener('DOMContentLoaded', () => {
            this.loadBlogPosts();
        });
    }

    // 从你的博客站点获取最新文章
    async loadBlogPosts() {
        try {
            // 更新统计数据
            this.updateStats();
            
            // 获取现有的静态文章列表
            const staticPosts = this.getStaticPosts();
            
            // 如果需要从API获取，可以在这里添加
            // const apiPosts = await this.fetchFromAPI();
            
            console.log('博客文章加载完成');
        } catch (error) {
            console.log('使用静态文章列表');
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
        const articles = document.querySelectorAll('.article-card');
        const totalPosts = articles.length;
        
        // 计算总标签数
        const allTags = new Set();
        articles.forEach(article => {
            const tags = article.querySelectorAll('.tag');
            tags.forEach(tag => allTags.add(tag.textContent));
        });
        
        // 计算总浏览量
        let totalViews = 0;
        articles.forEach(article => {
            const viewsElement = article.querySelector('.fas.fa-eye')?.parentElement;
            if (viewsElement) {
                const views = parseInt(viewsElement.textContent.match(/\d+/)?.[0] || '0');
                totalViews += views;
            }
        });

        // 更新显示
        this.updateStatElement('totalPosts', totalPosts);
        this.updateStatElement('totalTags', allTags.size);
        this.updateStatElement('totalViews', totalViews);
    }

    // 更新统计元素
    updateStatElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // 如果将来需要从API获取文章
    async fetchFromAPI() {
        // 这里可以添加从GitHub API或其他源获取文章的逻辑
        // 目前保持简单，使用静态内容
        return [];
    }
}

// 初始化博客加载器
const blogLoader = new SimpleBlogLoader();

export default SimpleBlogLoader;
