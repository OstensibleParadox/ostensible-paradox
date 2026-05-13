# OstensibleParadox Hugo Blog

这是一个使用 Hugo 和 PaperMod 主题搭建的双语个人博客，支持中文和英文内容。主站由 Cloudflare Workers 静态资产托管，旧 GitHub Pages 地址保留为跳转入口。

## Quick Start

- 线上站点：<https://ostensibleparadox-github-io.pages.dev/>
- 中文首页：<https://ostensibleparadox-github-io.pages.dev/zh/>
- English home: <https://ostensibleparadox-github-io.pages.dev/en/>
- 旧 GitHub Pages 地址：<https://ostensibleparadox.github.io/>，会跳转到当前 Cloudflare 托管站点。

本地预览：

```bash
hugo server -D
```

生产构建：

```bash
hugo --minify
```

## 项目结构

```text
.
├── content/
│   ├── Chinese/          # 中文公开内容
│   │   ├── about.md
│   │   ├── search.md
│   │   └── posts/
│   ├── English/          # 英文公开内容
│   │   ├── about.md
│   │   ├── search.md
│   │   └── posts/
│   └── us/               # Cloudflare Access 保护区域的静态入口
├── layouts/              # Hugo 模板覆盖
├── assets/               # Hugo 管理的 CSS/JS 资源
├── static/               # 直接复制到 public/ 的静态文件
├── scripts/              # 内容处理脚本
├── migrations/           # Cloudflare D1 SQL 迁移
├── src/                  # Cloudflare Worker 入口
├── hugo.toml             # Hugo 配置
├── wrangler.jsonc        # Cloudflare Workers/D1/静态资产配置
└── README.md
```

## 新建公开文章

在对应语言目录下创建 Markdown 文件：

- 中文文章：`content/Chinese/posts/your-article.md`
- 英文文章：`content/English/posts/your-article.md`

Front Matter 示例：

```markdown
+++
date = '2026-05-10T13:01:35+08:00'
draft = false
title = '文章标题'
+++

这里是文章内容。
```

## 图片引用

图片文件放在 `static/images/` 下，Markdown 中使用从站点根路径开始的地址：

```markdown
![图片描述](/images/essay1/image1.jpg)
```

Hugo 构建时会将 `static/` 下的文件复制到 `public/`，因此 Markdown 路径不需要包含 `static/` 前缀。

## 学术论文连载

较长的论文或章节可以使用 `scripts/paper-to-blog.sh` 转成 PaperMod 适用的多页 Branch Bundle。详细说明见 [scripts/paper-to-blog-README.md](scripts/paper-to-blog-README.md)。

## 私有区域

`/us/` 是一个由 Cloudflare Access 保护的私有区域。静态入口由 Hugo 构建，动态数据由 Worker API 和 D1 提供。私有区域产生的内容不写入公开仓库，也不进入 Hugo 搜索、RSS 或 sitemap。

## 本地开发

安装 Hugo 后，可以运行：

```bash
hugo server -D
```

访问 `http://localhost:1313` 预览站点。

如需调试 Worker、静态资产绑定和 D1：

```bash
npx wrangler dev
```

## 构建与部署

本地构建：

```bash
hugo --minify
```

Cloudflare Workers 部署：

```bash
npx wrangler deploy
```

`wrangler.jsonc` 会先运行 Hugo 构建，再把 `public/` 作为 Worker 静态资产上传。D1 schema 通过 `migrations/` 管理。

## 双语配置

- 默认语言：中文
- 中文路径：`/zh/...`
- 英文路径：`/en/...`

语言、菜单、搜索输出和固定链接配置在 `hugo.toml` 中维护。

## 搜索功能

网站使用 Fuse.js 客户端搜索：

- 中文搜索：`/zh/search/`
- 英文搜索：`/en/search/`

搜索索引由 Hugo 构建生成。修改内容后需要重新构建以更新索引。

## 注意事项

1. `public/` 是构建产物，不提交到仓库。
2. `.wrangler/` 是本地 Wrangler 缓存，不提交到仓库。
3. 公开文章使用 `content/Chinese/` 和 `content/English/`。
4. 受保护区域的用户生成内容保存在 D1，不应写入公开 Markdown 内容目录。
5. 修改 `wrangler.jsonc`、D1 迁移或 Worker API 后，应至少运行 `hugo --minify` 和 `npx wrangler deploy --dry-run` 验证。

## 相关链接

- [Hugo 官方文档](https://gohugo.io/documentation/)
- [PaperMod 主题文档](https://github.com/adityatelange/hugo-PaperMod)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
