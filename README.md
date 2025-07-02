# 🍆 auberginewly - 个人作品集网站

一个现代化的个人作品集网站，展示技术技能、项目作品和博客文章。采用响应式设计，集成音乐播放器功能。

[![部署状态](https://img.shields.io/badge/部署-在线-brightgreen)](https://portfolio.auberginewly.site/)
[![技术栈](https://img.shields.io/badge/技术栈-HTML5%20|%20CSS3%20|%20JavaScript-blue)](#技术栈)
[![备案信息](https://img.shields.io/badge/备案-赣ICP备2025066072号-blue)](https://beian.miit.gov.cn/)

## 🌐 在线访问

**✨ 正式网站**: [https://portfolio.auberginewly.site/](https://portfolio.auberginewly.site/)

## ✨ 核心功能

### 📱 五大核心页面
- **🏠 首页** - 个人介绍、技能概览、联系方式
- **💻 技术栈** - 技能展示、学习进度、产品知识
- **🎯 项目展示** - 作品集、技术栈标签、项目链接
- **📚 博客列表** - 技术文章、外部博客集成
- **✅ 待办事项** - 任务管理、进度跟踪、分类过滤

### 🎵 音乐播放器
- **跨页面播放** - 页面切换音乐不中断
- **进度控制** - 可拖动进度条，显示播放时间
- **音量调节** - 滑块控制音量
- **状态保持** - localStorage保存播放状态

### 🎨 界面特色
- **响应式设计** - 适配桌面、平板、手机
- **现代化UI** - 天蓝色主题，流畅动画
- **模块化架构** - CSS/JS文件分离组织
- **性能优化** - 懒加载、代码分割

## 🛠️ 技术栈

- **HTML5** - 语义化标签、多媒体元素
- **CSS3** - Flexbox/Grid、动画、响应式设计
- **JavaScript (ES6+)** - 模块化开发、异步处理
- **安全功能** - XSS防护、输入验证

## 📁 项目结构

```
website/
├── index.html              # 首页
├── skills.html             # 技术栈页面
├── projects.html           # 项目展示页面
├── blog-list.html          # 博客列表页面
├── todo.html               # 待办事项页面
└── assets/
    ├── css/
    │   ├── main.css        # 主样式文件
    │   └── modules/        # CSS模块
    │       ├── music-player.css
    │       ├── navigation.css
    │       ├── buttons.css
    │       └── ...
    ├── js/
    │   ├── main-modular.js # 主JS文件
    │   ├── security.js     # 安全功能
    │   └── modules/        # JS模块
    │       ├── audio-player.js
    │       ├── todo-manager.js
    │       ├── blog-functions.js
    │       └── ...
    ├── audio/              # 音频文件
    └── img/                # 项目图片
```

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/auberginewly/personal-portfolio.git
cd personal-portfolio
```

### 2. 本地运行
```bash
# Python HTTP服务器
cd website
python3 -m http.server 8080

# 或使用 VS Code Live Server 插件
```

### 3. 访问网站
```
本地开发: http://localhost:8080
正式网站: https://portfolio.auberginewly.site/
```

## 🎯 项目亮点

### 🔊 音乐播放器
- 右下角悬浮播放器，跨页面连续播放
- 进度拖动条、音量控制、播放时间显示
- 天蓝色主题设计，与网站风格统一

### 📊 技能展示
- 可视化进度条展示技能熟练度
- 分类展示：技术栈、正在学习、产品知识
- 清晰的技能标签和描述

### 💼 项目作品
- 4个核心项目展示
- 技术栈标签、GitHub链接、项目描述
- 包含机器人插件、React应用、技术博客

### ✅ 任务管理
- 学习任务和项目任务分类管理
- 进度条显示完成状态
- 搜索过滤、优先级标识

## 🌟 技术特色

- **模块化开发** - CSS和JavaScript分模块组织
- **响应式设计** - 移动优先，适配各种设备
- **现代化交互** - 流畅动画，优秀用户体验
- **安全考虑** - XSS防护，安全编码实践
- **性能优化** - 代码分割，资源优化

## 📱 浏览器支持

| 浏览器 | 版本 | 支持状态 |
|--------|------|----------|
| Chrome | 90+ | ✅ 完全支持 |
| Firefox | 88+ | ✅ 完全支持 |
| Safari | 14+ | ✅ 完全支持 |
| Edge | 90+ | ✅ 完全支持 |

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源协议。

## 📞 联系方式

- 🌐 **个人网站**: [portfolio.auberginewly.site](https://portfolio.auberginewly.site/)
- 📚 **技术博客**: [auberginewly.site](https://auberginewly.site)
- 💼 **GitHub**: [@auberginewly](https://github.com/auberginewly)
- 📧 **邮箱**: auberginewly@qq.com
- 🏢 **工作室**: [南昌大学家园工作室](https://team.ncuos.com/)

---

⭐ **如果这个项目对你有帮助，请给个Star支持一下！**

🍆 **auberginewly - 一只喜欢茄子的汉堡** 

*会者定离 | 一期一祈 | 技术与产品并行，打造用户喜爱的产品*

**🏛️ 备案信息**: 赣ICP备2025066072号
