# 🚀 Netlify 自动化部署指南

## 快速部署步骤

### 1. 在Netlify创建新站点
1. 访问 [Netlify](https://netlify.com)
2. 注册/登录账户
3. 点击 "New site from Git"
4. 选择 GitHub，授权访问你的仓库
5. 选择你的 `personal-portfolio` 仓库

### 2. 配置部署设置
- **Branch to deploy**: `main`
- **Build command**: `echo 'Static site deployment'`
- **Publish directory**: `website`

Netlify会自动检测到 `netlify.toml` 配置文件！

### 3. 部署完成
- Netlify会自动分配一个域名（如：`amazing-site-123456.netlify.app`）
- 每次推送到main分支都会自动重新部署
- 支持预览部署（Pull Request时）

## 🌐 自定义域名设置

### 在Netlify控制台：
1. 进入站点设置 → Domain management
2. 点击 "Add custom domain"
3. 输入你的域名（如：`yourname.com`）

### 在你的域名注册商：
添加以下DNS记录：
```
类型    名称    值
A       @       75.2.60.5
CNAME   www     你的netlify域名.netlify.app
```

或者使用Netlify DNS：
1. 在Netlify中添加域名
2. 复制提供的DNS服务器地址
3. 在域名注册商处修改DNS服务器

## 🔧 高级配置

### SSL证书
- Netlify自动提供Let's Encrypt SSL证书
- 域名添加后会自动申请和续期

### 性能优化
- 自动CDN分发
- 图片优化
- 代码压缩
- 缓存控制（已配置在netlify.toml中）

### 监控和分析
1. 在Netlify控制台查看：
   - 部署历史
   - 带宽使用
   - 表单提交（如果有）
   - 访问统计

## 🎯 推荐功能

### 1. 表单处理
```html
<form name="contact" method="POST" data-netlify="true">
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <textarea name="message" required></textarea>
  <button type="submit">发送</button>
</form>
```

### 2. 环境变量
在Netlify控制台 → Site settings → Environment variables 添加：
- API密钥
- 配置参数
- 第三方服务token

### 3. 重定向规则
已在 `netlify.toml` 中配置，支持：
- SPA路由
- 404处理
- 安全头部

## 🔍 故障排除

### 常见问题：
1. **部署失败**: 检查netlify.toml语法
2. **资源404**: 确保路径相对于website目录
3. **CSS/JS不加载**: 检查文件路径和权限

### 部署日志：
在Netlify控制台 → Deploys 查看详细日志

## 📱 移动端优化
网站已配置响应式设计，在所有设备上都有良好表现！

---

🎉 **恭喜！你的个人作品集网站现在可以自动部署了！**

每次git push都会触发自动部署，再也不用手动操作！
