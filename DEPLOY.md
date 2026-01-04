# Binance Alpha Monitor - 部署指南 🚀

让所有人都能通过互联网访问你的币安Alpha监控网站！

## 📁 文件结构

```
binance-alpha-monitor/
├── deploy-server.js       # 后端服务器
├── package.json          # 依赖配置
├── public/              
│   └── index.html        # 前端页面
└── README.md            # 本文件
```

## 🌐 部署方案（选择一个）

### ⭐ 方案1: Vercel（推荐 - 最简单免费）

**优点**: 完全免费，自动HTTPS，全球CDN，超级简单
**缺点**: 需要GitHub账号

#### 步骤：

1. **准备代码**
```bash
# 重命名文件
mv deploy-server.js server.js
mv deploy-package.json package.json
```

2. **上传到GitHub**
- 登录 https://github.com
- 点击 "New repository"
- 创建仓库并上传所有文件

3. **部署到Vercel**
- 访问 https://vercel.com
- 点击 "Import Project"
- 选择你的GitHub仓库
- 点击 "Deploy"

4. **完成！**
- Vercel会给你一个免费域名：`https://你的项目名.vercel.app`
- 所有人都可以访问！

---

### 🚀 方案2: Railway（也很简单）

**优点**: 免费，支持GitHub自动部署
**缺点**: 每月有使用限制

#### 步骤：

1. 访问 https://railway.app
2. 连接GitHub账号
3. 选择 "New Project" → "Deploy from GitHub repo"
4. 选择你的仓库
5. Railway自动检测Node.js项目并部署
6. 获得域名：`https://xxx.railway.app`

---

### 💻 方案3: Render（稳定可靠）

**优点**: 免费计划，稳定性好
**缺点**: 冷启动较慢

#### 步骤：

1. 访问 https://render.com
2. 注册并登录
3. 点击 "New +" → "Web Service"
4. 连接GitHub仓库
5. 配置：
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. 点击 "Create Web Service"
7. 获得域名：`https://xxx.onrender.com`

---

### 🐋 方案4: 使用Docker部署到任何服务器

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

部署：
```bash
docker build -t binance-alpha-monitor .
docker run -d -p 3000:3000 binance-alpha-monitor
```

---

### 🖥️ 方案5: 自己的VPS服务器

如果你有服务器（如阿里云、腾讯云、AWS等）：

```bash
# 1. 登录服务器
ssh user@your-server-ip

# 2. 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. 上传代码
scp -r * user@your-server-ip:/home/user/app/

# 4. 启动服务
cd /home/user/app
npm install
npm start

# 5. 使用PM2保持运行
npm install -g pm2
pm2 start deploy-server.js --name binance-alpha
pm2 startup
pm2 save
```

配置Nginx反向代理：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🎯 推荐选择

| 用户类型 | 推荐方案 | 原因 |
|---------|---------|------|
| **新手** | Vercel | 最简单，点几下就完成 |
| **开发者** | Railway | 功能丰富，易于管理 |
| **追求稳定** | Render | 免费稳定 |
| **有服务器** | VPS | 完全控制 |

---

## 🔧 本地测试

部署前先在本地测试：

```bash
# 1. 安装依赖
npm install

# 2. 启动服务器
npm start

# 3. 打开浏览器
# 访问 http://localhost:3000
```

---

## 📱 使用自定义域名

### Vercel添加域名：
1. 在Vercel项目设置中
2. 进入 "Domains"
3. 添加你的域名
4. 按提示配置DNS

### Cloudflare（推荐）：
1. 域名DNS托管到Cloudflare
2. 添加CNAME记录指向Vercel/Railway提供的域名
3. 自动获得HTTPS和CDN加速

---

## 🎨 环境变量配置

如需配置API密钥等：

**Vercel:**
- Settings → Environment Variables

**Railway:**
- Variables → New Variable

**Render:**
- Environment → Add Environment Variable

示例：
```
PORT=3000
NODE_ENV=production
```

---

## 📊 监控和日志

### Vercel
- 自动提供日志查看
- Functions → Logs

### Railway
- Deployments → Logs

### 自己的服务器
```bash
# 使用PM2查看日志
pm2 logs binance-alpha

# 查看错误日志
pm2 logs binance-alpha --err
```

---

## 🐛 常见问题

### Q1: 部署后显示502错误
**解决**: 检查端口配置，确保使用 `process.env.PORT || 3000`

### Q2: API请求失败
**解决**: 检查服务器是否能访问币安API，可能需要配置代理

### Q3: 页面加载慢
**解决**: 使用CDN加速，或选择离用户更近的服务器区域

### Q4: 免费额度用完
**解决**: 
- Vercel: 切换到付费计划或使用多个账号
- Railway: 月初自动重置
- Render: 升级付费计划

---

## 🎉 部署后的访问方式

部署成功后，你会得到一个公开URL，例如：
```
https://binance-alpha-monitor.vercel.app
https://binance-alpha.railway.app
https://binance-alpha.onrender.com
```

**分享给任何人**：
- 发送链接
- 二维码
- 嵌入到其他网站

---

## 🔐 安全建议

1. **不要暴露API密钥**（如果使用）
2. **使用环境变量**存储敏感信息
3. **定期更新依赖**：`npm update`
4. **限制请求频率**防止滥用
5. **使用HTTPS**（免费平台自动提供）

---

## 📈 性能优化

1. **启用缓存**: 已在代码中实现（30秒缓存）
2. **CDN加速**: Vercel/Cloudflare自动提供
3. **压缩资源**: 添加gzip压缩
4. **监控性能**: 使用Vercel Analytics

---

## 🤝 技术支持

遇到问题？
1. 检查服务器日志
2. 查看浏览器控制台
3. 确认币安API可访问性
4. GitHub Issues

---

## 📝 更新部署

### Git方式（Vercel/Railway/Render）：
```bash
git add .
git commit -m "Update"
git push
# 自动重新部署！
```

### 手动方式：
1. 修改代码
2. 重新上传/重新部署

---

## 🎊 成功案例

部署成功后，你的网站将：
- ✅ 24/7在线
- ✅ 全球任何地方都能访问
- ✅ 自动HTTPS安全连接
- ✅ 实时显示币安Alpha数据
- ✅ 包含LISA等所有Alpha代币

---

**祝部署顺利！🚀**

有问题随时问我！
