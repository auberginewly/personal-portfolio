# 🍆 auberginewly - 个人作品集网站

一个现代化的个人作品集网站，展示技术技能、项目作品和博客文章。采用响应式设计，**创新实现跨页面音乐播放器**功能。

[![部署状态](https://img.shields.io/badge/部署-在线-brightgreen)](https://portfolio.auberginewly.site/)
[![技术栈](https://img.shields.io/badge/技术栈-HTML5%20|%20CSS3%20|%20JavaScript-blue)](#技术栈)
[![备案信息](https://img.shields.io/badge/备案-赣ICP备2025066072号-blue)](https://beian.miit.gov.cn/)

## 🌐 在线访问

**✨ 正式网站**: [https://portfolio.auberginewly.site/](https://portfolio.auberginewly.site/)

## ✨ 核心功能

### 📱 五大核心页面
- **🏠 首页** - 个人介绍、技能概览、联系方式
- **💻 技术栈** - 技能展示、学习进度、产品知识 (含14个详情子页面)
- **🎯 项目展示** - 作品集、技术栈标签、项目链接
- **📚 博客列表** - 技术文章、外部博客集成
- **✅ 待办事项** - 任务管理、进度跟踪、分类过滤

### 🎵 跨页面音乐播放器 (创新功能)
- **无缝连贯播放** - 任意页面跳转音乐不中断，包括skills子页面
- **智能路径识别** - 自动处理主页面与子页面间的音频路径差异
- **精确进度控制** - 可拖动进度滑块，实时调整播放位置
- **状态持久化** - localStorage保存播放状态，跨页面恢复进度
- **音量调节** - 滑块控制，静音/音量切换
- **播放时间显示** - 当前时间/总时长，格式化显示

### 🎨 界面特色
- **响应式设计** - 适配桌面、平板、手机
- **现代化UI** - 天蓝色主题，流畅动画效果
- **模块化架构** - 12个CSS模块 + 10个JS模块
- **性能优化** - 懒加载、代码分割、资源压缩

## 🛠️ 技术栈

- **HTML5** - 语义化标签、多媒体元素、表单验证
- **CSS3** - Flexbox/Grid、变量系统、模块化组织
- **JavaScript (ES6+)** - 模块化开发、类和继承、异步处理
- **Web Audio API** - 音频播放控制、进度管理
- **安全功能** - XSS防护、输入验证、安全编码

## 📁 项目结构

```
website/
├── 核心页面 (8个)
│   ├── index.html              # 首页
│   ├── login.html              # 登录页面
│   ├── register.html           # 注册页面
│   ├── skills.html             # 技术栈页面
│   ├── projects.html           # 项目展示页面
│   ├── blog-list.html          # 博客列表页面
│   ├── todo.html               # 待办事项页面
│   └── 404.html                # 错误页面
├── skills/                     # 技能详情页面 (14个)
│   ├── java.html               # Java详情页
│   ├── python.html             # Python详情页
│   ├── javascript.html         # JavaScript详情页
│   ├── mysql.html              # MySQL详情页
│   └── ...                     # 其他技能页面
└── assets/
    ├── css/
    │   ├── main.css            # 主样式文件
    │   └── modules/            # CSS模块 (12个文件)
    │       ├── music-player.css    # 音乐播放器样式
    │       ├── navigation.css      # 导航样式
    │       ├── buttons.css         # 按钮样式
    │       ├── forms.css           # 表单样式
    │       ├── animations.css      # 动画效果
    │       ├── responsive.css      # 响应式规则
    │       └── ...
    ├── js/
    │   ├── main-modular.js     # 主JS文件
    │   ├── security.js         # 安全功能
    │   └── modules/            # JS模块 (10个文件)
    │       ├── audio-player.js     # 音乐播放器 (21KB)
    │       ├── auth-manager.js     # 认证管理 (14KB)
    │       ├── todo-manager.js     # 任务管理 (12KB)
    │       ├── blog-functions.js   # 博客功能 (20KB)
    │       ├── notifications.js    # 通知系统 (8KB)
    │       └── ...
    ├── audio/                  # 音频文件
    │   └── keshiii - Stuck In The Middle-BABYMONSTER.mp3
    └── img/                    # 项目图片
        ├── auberginewly.png    # 个人头像
        ├── chengyu-plugin.png  # 项目截图
        └── ...
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

### 🎵 突破性音乐播放器
- **真正的跨页面播放**: 在多页面网站中实现类似SPA的连续播放体验
- **智能路径处理**: 自动识别并修正主页面与子页面间的相对路径
- **无缝状态切换**: skills子页面间跳转保持播放连贯性
- **精确进度控制**: 类似音乐软件的拖动进度条
- **音量记忆功能**: 跨页面保持音量设置

### 🧠 技能展示系统
- **14个详细技能页面**: Java、Python、JavaScript、MySQL等
- **三大技能分类**: 技术栈类别、正在学习、产品知识
- **可视化进度条**: 展示技能熟练度和学习进度
- **一键返回导航**: 技能详情页与主页面无缝衔接

### 💼 项目作品集
- **4个核心项目展示**: 成语助手、飞花令助手、仓库卡片生成器等
- **技术栈标签**: 清晰标识使用的技术
- **GitHub集成**: 直接链接到项目仓库
- **响应式卡片**: 适配各种屏幕尺寸

### ✅ 智能任务管理
- **分类任务系统**: 学习任务、项目任务、生活任务
- **实时进度跟踪**: 可视化完成状态
- **搜索过滤功能**: 快速找到特定任务
- **优先级标识**: 重要任务突出显示

## 🌟 技术特色

### 🎨 前端架构
- **模块化设计**: 12个CSS模块 + 10个JS模块的清晰架构
- **ES6+语法**: 类、继承、模块化、异步处理
- **响应式布局**: 移动优先，Flexbox/Grid双重布局
- **CSS变量系统**: 统一的设计系统和主题管理

### 🔊 音频技术
- **HTML5 Audio API**: 深度集成原生音频控制
- **状态管理**: localStorage实现跨页面状态持久化
- **事件监听**: 完善的音频事件处理机制
- **错误处理**: 自动播放限制和异常恢复

### 🛡️ 安全特性
- **XSS防护**: 输入过滤、输出编码、安全DOM操作
- **表单验证**: 邮箱、手机号、密码强度实时验证
- **CSP策略**: HTTP安全头配置
- **安全编码**: 避免innerHTML，使用textContent

### ⚡ 性能优化
- **代码分割**: 按功能模块分离，按需加载
- **资源压缩**: CSS/JS文件优化
- **懒加载**: 图片和内容延迟加载
- **缓存策略**: localStorage状态缓存

## 📊 页面统计

| 页面类型 | 数量 | 说明 |
|---------|------|------|
| 核心页面 | 8个 | 主功能页面 |
| 技能详情页 | 14个 | 技术栈详细介绍 |
| iframe嵌入页 | 25+个 | 外部博客文章 |
| **总计** | **47+个** | 超过作业要求 |

## 📱 浏览器支持

| 浏览器 | 版本 | 支持状态 | 音频播放 |
|--------|------|----------|----------|
| Chrome | 90+ | ✅ 完全支持 | ✅ 最佳体验 |
| Firefox | 88+ | ✅ 完全支持 | ✅ 完全支持 |
| Safari | 14+ | ✅ 完全支持 | ⚠️ 需用户交互 |
| Edge | 90+ | ✅ 完全支持 | ✅ 完全支持 |

## 🎓 学术价值

本项目作为"前端开发与自建页面安全测试"大作业，完整展示了：
- **HTML5新特性应用**: 语义化标签、多媒体API、表单验证
- **CSS3高级特性**: 变量、动画、Grid/Flexbox、响应式设计  
- **JavaScript现代开发**: ES6+语法、模块化、异步编程
- **Web安全实践**: XSS防护、安全编码、输入验证
- **项目工程化**: 模块化架构、版本控制、部署配置

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
