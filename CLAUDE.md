# 牧码牛的博客

个人技术博客。Hugo + FixIt 主题，Cloudflare Pages 托管，域名 <https://mumaniu.cn>。

## 作者与读者

作者是有十余年经验的后端工程师，关注**效率工具、架构设计、微服务、运维、认证授权**；同时是一个男孩的父亲。

读者默认是**水平相近的后端 / 平台工程师**。他们知道什么是 HTTP、容器、K8s、OAuth2，**不要解释基础概念**，不要写"什么是微服务"这种科普段落。可以直接用行话。

## 内容定位

| 类型 | 篇幅 | 要求 |
|---|---|---|
| 工具 / 方案分享 | 800–1500 字 | 说清楚解决什么问题、怎么用、什么场景下**不**适合 |
| 技术心得 | 1500–3000 字 | 要有观点和取舍分析，不是文档搬运 |
| 生活随笔 | 不限 | 真实即可，不必强行升华成技术隐喻 |

## 写作规范

**开头**：第一句就进入正题——抛出问题、场景或结论。禁止"在当今快速发展的互联网时代""随着微服务架构的普及"这类铺垫。

**人称与口吻**：第一人称，像跟同事讲技术。有主张、敢下结论，不要处处"可能""也许""见仁见智"。

**必须具体**：
- 写明版本号、配置项、完整命令、真实报错信息
- 讲清楚**为什么这么做**，以及**什么情况下这个方案不适用**
- 优先写自己踩过的坑，而不是复述官方文档

**结构**：按内容的自然逻辑走。不要套"背景—方案—总结"的模板，不要机械的"首先 / 其次 / 最后"，不要在文末写"综上所述""总而言之"这种正确的废话——没有新信息就直接结束。

### 严禁的 AI 腔

写完必须自查，出现以下特征一律重写：

- 空泛开场：「在当今…」「随着…的发展」「众所周知」
- 万能结尾：「总而言之」「综上所述」「希望本文对你有所帮助」
- 机械过渡：每段开头都是「值得注意的是」「我们可以看到」「需要强调的是」
- 排比成瘾：连续三句结构对仗的短句堆砌
- 无信息量的形容：「强大的」「优雅的」「极大地提升了」——换成具体数字或具体行为
- 强行 emoji 小标题、强行分点，把本来两句话能说完的事拆成五个 bullet
- 罗列"最佳实践"却不给适用场景

**成稿后用 `chinese-ai-humanizer` skill 过一遍**，这是发布前的固定动作。

## 本地环境

需要 **Hugo extended ≥ 0.165.0** 和 **Dart Sass**——后者是 FixIt v1 的硬依赖，
缺了会报 `TOCSS-DART: failed to transform`。都装在 `~/.local` 下，不需要 sudo：

```bash
# Hugo extended（注意必须是 extended 版）
curl -sLJO https://github.com/gohugoio/hugo/releases/download/v0.165.0/hugo_extended_0.165.0_linux-amd64.tar.gz
tar -xf hugo_extended_0.165.0_linux-amd64.tar.gz hugo && install -m 755 hugo ~/.local/bin/hugo

# Dart Sass
curl -sLJO https://github.com/sass/dart-sass/releases/download/1.104.0/dart-sass-1.104.0-linux-x64.tar.gz
tar -xf dart-sass-1.104.0-linux-x64.tar.gz -C ~/.local/share/
ln -sf ~/.local/share/dart-sass/sass ~/.local/bin/sass
```

## 常用命令

```bash
hugo server -D                   # 本地预览（含草稿），http://localhost:1313
hugo new content posts/my-post   # 新建文章（自动创建 Page Bundle 目录）
hugo --gc --minify               # 生产构建
```

手机上看响应式效果（把 IP 换成本机局域网地址）：

```bash
hugo server -D --bind 0.0.0.0 --baseURL http://192.168.x.x
```

## 主题

当前锁定 **FixIt v1.0.0-alpha.1**（预发布版），用 **Hugo Modules** 管理，不是 git submodule
——Cloudflare Pages 对 submodule 支持不可靠。不要把 `themes/` 目录加回来。

```bash
hugo mod get github.com/hugo-fixit/FixIt@<版本>   # 切换版本
hugo mod get -u github.com/hugo-fixit/FixIt       # 只升稳定版，不会自动升到 alpha
```

v1 相对 v0.4.x 是架构级重写，有两个必须记住的坑：

1. **构建强制依赖 Dart Sass**，只装 Hugo extended 会报 `TOCSS-DART: failed to transform`。
2. **配置键名以模板为准，不要信主题自带的 `hugo.toml`**。v1 alpha 阶段两者不一致：
   主题配置文件写 `repo_id`（snake_case），模板实际读 `.RepoId`（camelCase），
   照文档写会导致参数**静默变成空值**，页面照常构建、功能却坏掉。
   改任何主题配置前，先 grep 模块缓存里的 `layouts/` 确认模板读的是哪个键名。

alpha 版可能随时引入破坏性变更，升级后必须验证：站点能构建、评论参数完整、文章 URL 未变。

## 文章与图片

每篇文章是一个 **Page Bundle** 目录：

```
content/posts/my-post/
├── index.md
├── featured-image.png   # 文件名固定，自动成为文章头图
└── arch-diagram.png
```

- 正文里用**相对路径**引用：`![架构图](arch-diagram.png)`
- 构建时 Hugo 自动压缩（quality 82）并剥离 EXIF 的拍摄时间与 GPS 定位
- **超过 2 MB 的大图 / GIF / 录屏**不要进仓库，传 Cloudflare R2，引用 `https://img.mumaniu.cn/xxx.png`
- 发生活照前确认已剥离定位信息（配置已默认开启，不要关掉 `disableLatLong`）

草稿写 `draft: true`，发布时改为 `false`。

## 部署

推送到 `master` 即自动部署，无需手工操作。

- **Cloudflare Pages**（主）：输出目录 `public`，环境变量
  `HUGO_VERSION=0.165.0`、`GO_VERSION=1.24.3`（Hugo Modules 需要 Go）。
  构建镜像不自带 Dart Sass，构建命令要自己装：

  ```bash
  curl -sLJO https://github.com/sass/dart-sass/releases/download/1.104.0/dart-sass-1.104.0-linux-x64.tar.gz \
    && tar -xf dart-sass-1.104.0-linux-x64.tar.gz \
    && export PATH="$PWD/dart-sass:$PATH" \
    && hugo --gc --minify
  ```
- **GitHub Actions**（`.github/workflows/hugo.yml`）：迁移期的备份路径，
  CF Pages 稳定后可连同 `static/CNAME` 一并删除

`baseURL` 只在 `hugo.toml` 中定义，构建命令里不要再用 `--baseURL` 覆盖。

## 配色

亮暗两套配色都定制过，配置在 `hugo.toml` 的 `[params.appearance]`，
**全部 16 个文本场景均满足 WCAG AAA（对比度 ≥ 7:1）**。

| | 底色 | 正文 | 对比度 |
|---|---|---|---|
| 亮色 | `#faf8f4` 暖米白 | `#3b3731` 暖深灰褐 | 11.1:1 |
| 暗色 | `#1a1e25` 深邃灰蓝 | `#ccd3dc` 柔和浅灰 | 11.1:1 |

三条设计约束，改色时不要破坏：

1. **正文色只按主背景定色**。代码高亮行、表头这类特殊底色要反过来调整去适配正文，
   不能让它们把正文推成纯黑或纯白——纯白正文在暗色底上有光晕，久读比高对比更累。
2. **刻意拉开层次梯度**：正文 11:1 > 引用 8.3:1 > 次要 7.9:1 > 链接 7.3:1。
   AAA 要求所有文字都 ≥7:1，不拉开梯度就会把主次文字压成同一个视觉层级。
3. **边框不参与 AAA**。WCAG 1.4.6 只约束文本，边框是非文本元素，
   强推到 3:1 会变成扎眼的深灰线，破坏整体柔和。

改任何色值后必须重算，且要覆盖这些**底色各不相同**的场景：
正文、次要文字、引用、正文链接、链接 hover、导航文字、导航 hover、搜索框占位符、
代码块文字、代码块标题、行内代码、表格、表头、代码高亮行、分页链接、选中态。

两个容易漏的坑：
- **行内代码和选中态的底色是半透明叠加**，要先算出与页面底色混合后的实色再核对比度。
- `code_header_background_color` 在产物里有两份定义，另一份是主题用 Sass 运算生成的
  百分比 `rgb()`，比配置值略暗——核算时应取更不利的那份。

验证方法：构建后从 `public/css/main.min.css` 里解析 `--fi-*` 的 `light-dark()` 值，
对真实产物核算，不要只信配置文件里写了什么。

## 图表（Mermaid）

用 ```` ```mermaid ```` 代码块直接写，主题会自动渲染，支持 `block-beta`、`quadrantChart`、
`architecture-beta` 等全部图表类型。

**CDN 已改为 npmmirror 并锁定版本**，配置在 `hugo.toml` 的 `[params.mermaid]`。
主题默认值是 `cdn.jsdelivr.net/npm/mermaid`（不带版本号），换掉它有两个原因：

1. jsDelivr 在国内不稳定，加载失败时页面上只会剩下 mermaid 源码。
2. 不锁版本等于永远拉最新，mermaid 的破坏性更新会直接让图挂掉——`block-beta`
   这类 beta 语法尤其危险。

实测对比（入口 / chunk 响应）：npmmirror ≈ 0.2s，jsDelivr ≈ 0.9s，jsdmirror ≈ 3s。
npmmirror 的 `Content-Type` 是 `text/javascript`、CORS 正常，满足 ESM 动态 import 的要求。

**升级 mermaid 只需改配置里的版本号**，但改完要验证图还能渲染。

不要试图自托管：mermaid 把每种图表类型拆成了独立 chunk，去掉 sourcemap 仍有
**24.7 MB / 903 个文件**，不适合放进博客仓库。

写完 beta 语法的图（`block-beta` 等）建议本地验证一遍，避免线上渲染报错：

```bash
npx -y @mermaid-js/mermaid-cli@11 -i diagram.mmd -o test.svg
```

## 评论

Giscus，评论数据存在本仓库的 GitHub Discussions（Announcements 分类）。
配置在 `hugo.toml` 的 `[params.page.comment.giscus]`，`mapping = "pathname"`——
**改文章标题不会丢评论，但改 slug 或目录名会**，重命名前先想清楚。
