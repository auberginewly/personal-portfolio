# 🍆 auberginewly - 个人作品集网站

一个现代化的个人作品集网站，集成完整的用户认证系统、博客功能、项目展示和任务管理。采用模块化设计，响应式布局，提供优秀的用户体验。

[![部署状态](https://img.shields.io/badge/部署-在线-brightgreen)](https://auberginewly.github.io/personal-portfolio/)
[![技术栈](https://img.shields.io/badge/技术栈-HTML5%20|%20CSS3%20|%20JavaScript-blue)](#技术栈)
[![许可证](https://img.shields.io/badge/许可证-MIT-orange)](LICENSE)

## ✨ 核心功能

### 🔐 完整的用户认证系统
- **注册功能** - 支持邮箱注册，实时密码强度检测
- **登录功能** - 邮箱登录 + admin测试账户
- **用户管理** - localStorage数据持久化
- **安全验证** - 邮箱格式验证、密码强度检测
- **导航状态** - 动态显示登录状态和退出功能

### 🎨 现代化界面设计
- **响应式布局** - 适配桌面、平板、手机
- **轮播图功能** - 茄子玩偶主题轮播
- **现代化登录页** - 左右分栏设计，视觉效果优秀
- **统一配色** - 天蓝色主题 (#87CEEB)
- **流畅动画** - CSS过渡效果和关键帧动画

### 📝 博客系统
- **文章列表** - 支持列表/网格视图切换
- **iframe集成** - 嵌入外部博客文章
- **文章统计** - 浏览量、标签、发布时间
- **分类管理** - 按类别组织文章

### 💼 项目展示
- **作品集展示** - 4个核心项目
- **技术栈标签** - 清晰的技术说明
- **项目链接** - GitHub链接和在线演示
- **项目统计** - 数据可视化展示

### ✅ 任务管理系统
- **分类管理** - 学习任务、项目任务
- **进度跟踪** - 可视化进度条
- **优先级** - 高中低优先级标识
- **搜索过滤** - 实时搜索和状态过滤
- **数据统计** - 完成率和任务统计

## 🛠️ 技术栈

### 前端核心
- **HTML5** - 语义化标签、表单验证
- **CSS3** - Flexbox/Grid、动画、响应式设计
- **JavaScript (ES6+)** - 模块化开发、异步处理
- **Font Awesome** - 图标库

### 认证与安全
- **用户认证系统** - 注册、登录、会话管理
- **数据验证** - 邮箱格式、密码强度
- **本地存储** - localStorage用户数据管理
- **XSS防护** - 安全编码实践

### 开发特性
- **模块化架构** - CSS/JS文件分离
- **组件化设计** - 可复用的UI组件
- **响应式设计** - 移动优先策略
- **性能优化** - 懒加载、代码分割

## 📁 项目结构

```
website/
├── 核心页面
│   ├── index.html              # 首页 - 个人介绍
│   ├── login.html              # 登录页 - 轮播图+登录表单
│   ├── register.html           # 注册页 - 完整注册流程
│   ├── skills.html             # 技能页 - 技术栈展示
│   ├── projects.html           # 项目页 - 作品集展示
│   ├── blog-list.html          # 博客列表 - 文章管理
│   ├── blog-detail.html        # 博客详情 - 文章阅读
│   ├── todo.html               # 任务管理 - 待办事项
│   └── 404.html                # 错误页面
├── 资源文件
│   └── assets/
│       ├── css/
│       │   ├── main.css        # 主样式文件
│       │   └── modules/        # CSS模块
│       │       ├── animations.css
│       │       ├── navigation.css
│       │       ├── buttons.css
│       │       ├── forms.css
│       │       └── ...
│       ├── js/
│       │   ├── main-modular.js # 主JS文件
│       │   ├── main.js         # 降级支持
│       │   ├── security.js     # 安全功能
│       │   └── modules/        # JS模块
│       │       ├── auth-manager.js    # 认证管理
│       │       ├── todo-manager.js    # 任务管理
│       │       ├── blog-functions.js # 博客功能
│       │       ├── notifications.js  # 通知系统
│       │       └── ...
│       └── img/                # 项目截图
│           ├── auberginewly.png
│           ├── chengyu-plugin.png
│           ├── feihualing-plugin.png
│           └── repo-cards-generator.png
```

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/auberginewly/personal-portfolio.git
cd personal-portfolio
```

### 2. 本地运行
```bash
# 方式1：Python HTTP服务器
cd website
python3 -m http.server 8080

# 方式2：Node.js HTTP服务器  
npx http-server website -p 8080

# 方式3：VS Code Live Server
# 安装Live Server插件，右键选择 "Open with Live Server"
```

### 3. 访问网站
```
http://localhost:8080
```

### 4. 测试功能
- **测试账户**: 用户名和密码都是 `admin`
- **注册测试**: 使用真实邮箱格式注册新账户
- **功能测试**: 浏览各个页面，测试认证流程

## 🎯 功能特色

### 🔐 认证系统亮点
- **双重验证机制** - 支持admin测试账户和正式邮箱注册
- **实时密码强度检测** - 5级强度评分，可视化反馈
- **智能表单验证** - 邮箱格式、手机号、必填项验证
- **会话管理** - 记住登录、安全退出
- **导航状态同步** - 所有页面实时显示登录状态

### 🎨 界面设计亮点
- **轮播图系统** - 茄子玩偶主题，自动播放+手动控制
- **现代化表单** - iOS风格切换、毛玻璃效果
- **统一视觉语言** - 天蓝色品牌色系，一致的交互体验
- **响应式适配** - 完美适配各种屏幕尺寸

### 📊 数据管理亮点
- **本地数据持久化** - localStorage存储用户数据
- **数据结构清晰** - JSON格式，易于扩展
- **降级兼容方案** - 多重备份机制确保数据安全
- **调试友好** - 完整的控制台日志系统

## 🔧 开发架构

### CSS架构
```css
/* 变量系统 */
:root {
    --primary-color: #87CEEB;      /* 天蓝色主色 */
    --secondary-color: #4CAF50;    /* 绿色辅助色 */
    --accent-color: #f44336;       /* 红色强调色 */
}

/* 模块化组织 */
main.css              → 主样式入口
modules/
├── variables.css     → CSS变量定义
├── base.css          → 基础样式
├── navigation.css    → 导航组件
├── buttons.css       → 按钮组件
├── forms.css         → 表单组件
└── responsive.css    → 响应式规则
```

### JavaScript架构
```javascript
// 模块化系统
main-modular.js       → 主入口文件
modules/
├── auth-manager.js   → 认证管理 (14KB)
├── todo-manager.js   → 任务管理 (12KB)  
├── blog-functions.js → 博客功能 (20KB)
├── notifications.js  → 通知系统 (8KB)
├── utils.js          → 工具函数 (6KB)
└── navigation.js     → 导航控制 (1KB)
```

## 📱 页面详情

| 页面 | 功能 | 特色 |
|------|------|------|
| 🏠 **首页** | 个人介绍、技能概览 | 统计数据、联系方式 |
| 🔐 **登录页** | 用户登录、轮播图 | 左右分栏、茄子主题 |
| 📝 **注册页** | 用户注册、表单验证 | 密码强度检测、完整验证 |
| 💻 **技能页** | 技术栈展示 | 进度条、分类展示 |
| 🎯 **项目页** | 作品集展示 | 技术标签、链接跳转 |
| 📚 **博客页** | 文章列表、iframe展示 | 视图切换、外部集成 |
| ✅ **任务页** | 待办事项管理 | 进度跟踪、分类过滤 |

## 🌟 最佳实践

### 用户体验
- **加载性能** - 图片懒加载、代码分割
- **交互反馈** - 按钮状态、加载动画
- **错误处理** - 友好的错误提示
- **访问性** - 键盘导航、语义化标签

### 代码质量  
- **模块化** - 清晰的文件组织
- **可维护性** - 注释完整、命名规范
- **扩展性** - 易于添加新功能
- **兼容性** - 降级支持方案

### 安全考虑
- **输入验证** - 前端表单验证
- **数据清理** - 防止XSS攻击
- **安全存储** - 敏感信息保护
- **HTTPS** - 生产环境安全传输

## 📊 浏览器支持

| 浏览器 | 版本 | 支持状态 |
|--------|------|----------|
| Chrome | 90+ | ✅ 完全支持 |
| Firefox | 88+ | ✅ 完全支持 |
| Safari | 14+ | ✅ 完全支持 |
| Edge | 90+ | ✅ 完全支持 |
| IE | 11+ | ⚠️ 基础功能 |

## 🚀 部署选项

### 推荐平台
1. **GitHub Pages** - 免费托管，自动部署
2. **Netlify** - 快速部署，CDN加速
3. **Vercel** - 零配置部署，性能优秀
4. **云服务器** - 自定义配置，完全控制

### 部署步骤
```bash
# GitHub Pages部署
1. Fork本项目
2. 在仓库设置中启用GitHub Pages
3. 选择website文件夹作为源码目录
4. 访问 https://username.github.io/personal-portfolio/

# Netlify部署  
1. 连接GitHub仓库
2. 设置构建目录为 website
3. 自动部署完成
```

## 🧪 测试功能

### 认证系统测试
```
测试账户：admin / admin
注册测试：使用真实邮箱格式
密码测试：尝试不同强度的密码
登录状态：检查导航栏状态变化
```

### 功能模块测试
```
博客系统：切换视图、点击文章
任务管理：添加、编辑、删除任务  
项目展示：查看项目详情、外部链接
响应式：不同设备尺寸测试
```

## 🤝 贡献指南

1. **Fork** 本项目
2. **创建特性分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **打开Pull Request**

### 开发规范
- 遵循现有代码风格
- 添加适当的注释
- 测试新功能
- 更新相关文档

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源协议。

## 📞 联系方式

- 🌐 **个人博客**: [auberginewly.site](https://auberginewly.site)
- 💼 **GitHub**: [@auberginewly](https://github.com/auberginewly)
- 📧 **邮箱**: auberginewly@qq.com
- 🏢 **工作室**: [南昌大学家园工作室](https://team.ncuos.com/)

## 🎉 致谢

感谢以下资源和工具：
- [Font Awesome](https://fontawesome.com/) - 图标库
- [GitHub Pages](https://pages.github.com/) - 免费托管
- [VS Code](https://code.visualstudio.com/) - 开发工具
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) - 调试工具

---

⭐ **如果这个项目对你有帮助，请给个Star支持一下！**

🍆 **auberginewly - 一只喜欢茄子的汉堡** 

*会者定离 | 一期一祈 | 技术与产品并行，打造用户喜爱的产品*
