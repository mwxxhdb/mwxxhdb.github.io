---
title: 'No Build CSS 设计'
description: 'No Build CSS 是一个无构建工具的 CSS 解决方案，旨在简化前端开发流程。'
pubDate: 'Jul 01 2025'
---

## 关于 No Build CSS

- NB CSS 是一个后端程序员为自己准备的组件库，旨在提供一套简洁、易用的样式解决方案。它包含了常用的布局、组件和工具类，帮助开发者快速构建现代化的 Web 应用。
- 使用 NB CSS 既能得到和基于框架的组件库一样简洁的写法，又无需花费时间去学习前端框架的不同语法糖以及 SSR、CSR 等概念。
- NB CSS 不考虑浏览器兼容性，会使用最新的 CSS 特性和语法，适合现代浏览器环境。
- 非必要的前提下，不依赖 JavaScript，交互效果通过 CSS 实现，减少了前端代码的复杂性。

## 设计理念

### 核心原则
1. **简洁优先**：API 设计简单直观，学习成本低
2. **语义化**：使用 data 属性替代复杂的 class 命名，减少类之间的冲突
3. **现代化**：充分利用 CSS 新特性，如 CSS 变量、Grid、Flexbox、`:has()`、`@container` 等
4. **零依赖**：纯 CSS 实现，无需学习 JavaScript 框架
5. **类型安全**：通过 CSS 属性选择器提供 “类型检查”

### 技术特色
- **数据驱动**：通过 `data-*` 属性控制样式和行为
- **响应式设计**：内置断点系统和容器查询
- **主题系统**：CSS 变量驱动的主题切换
- **组件化**：自定义 HTML 元素 + CSS 的组合

## 架构设计

### 文件结构
```
nb-css/
├── core/
│   ├── reset.css              # CSS 重置
│   ├── variables.css          # CSS 变量定义
│   └── utilities.css          # 工具类
├── layout/
│   ├── grid.css              # 网格系统
│   ├── flexbox.css           # Flexbox 布局
│   ├── spacing.css           # 间距系统
│   └── positioning.css       # 定位系统
├── components/
│   ├── buttons.css           # 按钮组件
│   ├── forms.css             # 表单组件
│   ├── cards.css             # 卡片组件
│   ├── navigation.css        # 导航组件
│   ├── modals.css            # 模态框组件
│   └── tables.css            # 表格组件
├── themes/
│   ├── default.css           # 默认主题
│   ├── dark.css              # 深色主题
│   └── custom.css            # 自定义主题
└── animations/
    ├── transitions.css       # 过渡动画
    └── keyframes.css         # 关键帧动画
```

## 核心系统

### 1. 间距系统
```css
/* 基于单一基准变量的灵活间距系统 */
:root {
  --spacing: 0.25;  /* 基准单位，对应 4px (0.25rem) */
}

/* 动态计算间距 - 支持任意数值和负数 */
[data-p] {
  --p-value: attr(data-p type(<number>), 0);
  padding: calc(var(--p-value) * var(--spacing) * 1rem);
}

[data-m] {
  --m-value: attr(data-m type(<number>), 0);
  margin: calc(var(--m-value) * var(--spacing) * 1rem);
}

/* 方向性间距 */
[data-px] {
  --px-value: attr(data-px type(<number>), 0);
  padding-left: calc(var(--px-value) * var(--spacing) * 1rem);
  padding-right: calc(var(--px-value) * var(--spacing) * 1rem);
}

[data-py] {
  --py-value: attr(data-py type(<number>), 0);
  padding-top: calc(var(--py-value) * var(--spacing) * 1rem);
  padding-bottom: calc(var(--py-value) * var(--spacing) * 1rem);
}

[data-mx] {
  --mx-value: attr(data-mx type(<number>), 0);
  margin-left: calc(var(--mx-value) * var(--spacing) * 1rem);
  margin-right: calc(var(--mx-value) * var(--spacing) * 1rem);
}

[data-my] {
  --my-value: attr(data-my type(<number>), 0);
  margin-top: calc(var(--my-value) * var(--spacing) * 1rem);
  margin-bottom: calc(var(--my-value) * var(--spacing) * 1rem);
}

/* 单向间距 - 支持负数 */
[data-mt] {
  --mt-value: attr(data-mt type(<number>), 0);
  margin-top: calc(var(--mt-value) * var(--spacing) * 1rem);
}

[data-mr] {
  --mr-value: attr(data-mr type(<number>), 0);
  margin-right: calc(var(--mr-value) * var(--spacing) * 1rem);
}

[data-mb] {
  --mb-value: attr(data-mb type(<number>), 0);
  margin-bottom: calc(var(--mb-value) * var(--spacing) * 1rem);
}

[data-ml] {
  --ml-value: attr(data-ml type(<number>), 0);
  margin-left: calc(var(--ml-value) * var(--spacing) * 1rem);
}

/* 子元素间距 */
[data-space-x] {
  --space-x-value: attr(data-space-x type(<number>), 0);
}

[data-space-x] > * + * {
  margin-left: calc(var(--space-x-value) * var(--spacing) * 1rem);
}

[data-space-y] {
  --space-y-value: attr(data-space-y type(<number>), 0);
}

[data-space-y] > * + * {
  margin-top: calc(var(--space-y-value) * var(--spacing) * 1rem);
}

/* 特殊值支持 */
[data-m="auto"] { margin: auto; }
[data-mx="auto"] { margin-left: auto; margin-right: auto; }
[data-my="auto"] { margin-top: auto; margin-bottom: auto; }
[data-mt="auto"] { margin-top: auto; }
[data-mr="auto"] { margin-right: auto; }
[data-mb="auto"] { margin-bottom: auto; }
[data-ml="auto"] { margin-left: auto; }

/* 使用示例 */
/* 
<div data-p="4">内边距 16px (4 * 0.25 * 16px)</div>
<div data-m="8">外边距 32px (8 * 0.25 * 16px)</div>
<div data-mt="-2">负上边距 -8px (-2 * 0.25 * 16px)</div>
<div data-px="6" data-py="3">水平24px 垂直12px内边距</div>
<div data-space-x="4">子元素水平间距16px</div>
<div data-mx="auto">水平居中</div>
<div data-p="1.5">内边距 6px (1.5 * 0.25 * 16px)</div>
*/

/* 支持百分比间距（基于父元素） */
[data-p-percent] {
  --p-percent: attr(data-p-percent type(<number>), 0);
  padding: calc(var(--p-percent) * 1%);
}

[data-m-percent] {
  --m-percent: attr(data-m-percent type(<number>), 0);
  margin: calc(var(--m-percent) * 1%);
}

/* 响应式间距 */
@media (min-width: 768px) {
  [data-p-md] {
    --p-md-value: attr(data-p-md type(<number>), 0);
    padding: calc(var(--p-md-value) * var(--spacing) * 1rem);
  }
  
  [data-m-md] {
    --m-md-value: attr(data-m-md type(<number>), 0);
    margin: calc(var(--m-md-value) * var(--spacing) * 1rem);
  }
}

@media (min-width: 1024px) {
  [data-p-lg] {
    --p-lg-value: attr(data-p-lg type(<number>), 0);
    padding: calc(var(--p-lg-value) * var(--spacing) * 1rem);
  }
  
  [data-m-lg] {
    --m-lg-value: attr(data-m-lg type(<number>), 0);
    margin: calc(var(--m-lg-value) * var(--spacing) * 1rem);
  }
}

/* 容器查询间距 */
@container (min-width: 500px) {
  [data-p-container] {
    --p-container-value: attr(data-p-container type(<number>), 0);
    padding: calc(var(--p-container-value) * var(--spacing) * 1rem);
  }
}

/* 间距动画 */
[data-spacing-transition] {
  transition: padding 0.3s ease, margin 0.3s ease;
}

/* 调试模式 - 显示间距 */
[data-debug-spacing="true"] [data-p] {
  background: rgba(255, 0, 0, 0.1);
  outline: 1px dashed red;
}

[data-debug-spacing="true"] [data-m] {
  outline: 1px dashed blue;
}
```

### 2. 颜色系统
```css
/* 语义化颜色系统 */
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-neutral: #6b7280;
  
  /* 自动生成色阶 */
  --primary-50: color-mix(in srgb, var(--color-primary) 5%, white);
  --primary-100: color-mix(in srgb, var(--color-primary) 10%, white);
  /* ... */
  --primary-900: color-mix(in srgb, var(--color-primary) 90%, black);
}
```

### 3. 响应式断点
```css
/* 容器查询优先的响应式系统 */
[data-responsive] {
  container-type: inline-size;
}

@container (min-width: 768px) {
  [data-cols-md="2"] { grid-template-columns: repeat(2, 1fr); }
}

/* 传统媒体查询作为补充 */
@media (min-width: 768px) {
  [data-hidden-md] { display: none; }
}
```

## 组件设计

### 1. 按钮系统
```html
<!-- 基础按钮 -->
<button data-variant="solid" data-color="primary" data-size="md">
  点击我
</button>

<!-- 图标按钮 -->
<button data-shape="circle" data-variant="ghost">
  <i class="icon-search"></i>
</button>

<!-- 加载状态 -->
<button data-loading="true" data-variant="solid">
  <span data-loading-text>加载中...</span>
  <span data-default-text>提交</span>
</button>
```

```css
/* 按钮实现 */
button[data-variant="solid"] {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: calc(2 * var(--spacing) * 1rem) calc(4 * var(--spacing) * 1rem);
  transition: all 0.2s ease;
}

button[data-loading="true"] [data-default-text] {
  display: none;
}

button:not([data-loading="true"]) [data-loading-text] {
  display: none;
}
```

### 2. 表单系统
```html
<!-- 智能表单 -->
<form data-layout="vertical" data-gap="4">
  <div data-field>
    <label data-required>用户名</label>
    <input type="text" data-size="md" data-state="default" />
    <span data-help>请输入用户名</span>
  </div>
  
  <div data-field>
    <label>密码</label>
    <input type="password" data-size="md" data-state="error" />
    <span data-error>密码不能为空</span>
  </div>
  
  <button type="submit" data-variant="solid" data-full-width>
    登录
  </button>
</form>
```

### 3. 卡片系统
```html
<!-- 多功能卡片 -->
<div data-card data-shadow="md" data-hover="lift">
  <div data-card-header>
    <h3 data-title>卡片标题</h3>
    <button data-variant="ghost" data-size="sm">更多</button>
  </div>
  
  <div data-card-body>
    <p>卡片内容...</p>
  </div>
  
  <div data-card-footer data-justify="space-between">
    <span data-text="muted">2024-01-01</span>
    <div data-space-x="2">
      <button data-variant="outline" data-size="sm">取消</button>
      <button data-variant="solid" data-size="sm">确认</button>
    </div>
  </div>
</div>
```

### 4. 导航系统
```html
<!-- 自适应导航 -->
<nav data-nav data-layout="horizontal" data-responsive>
  <div data-nav-brand>
    <img src="logo.png" alt="Logo" />
  </div>
  
  <ul data-nav-menu>
    <li><a href="#" data-active>首页</a></li>
    <li><a href="#">产品</a></li>
    <li><a href="#">关于</a></li>
  </ul>
  
  <div data-nav-actions>
    <button data-variant="outline">登录</button>
    <button data-variant="solid">注册</button>
  </div>
</nav>
```

### 5. 模态框系统
```html
<!-- 纯 CSS 模态框 -->
<input type="checkbox" id="modal-trigger" hidden />

<label for="modal-trigger" data-button data-variant="solid">
  打开模态框
</label>

<div data-modal>
  <div data-modal-overlay></div>
  <div data-modal-content>
    <div data-modal-header>
      <h2>模态框标题</h2>
      <label for="modal-trigger" data-modal-close>×</label>
    </div>
    <div data-modal-body>
      <p>模态框内容...</p>
    </div>
  </div>
</div>
```

```css
/* 模态框实现 */
[data-modal] {
  position: fixed;
  inset: 0;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

#modal-trigger:checked ~ [data-modal] {
  opacity: 1;
  visibility: visible;
}
```

## 工具类系统

### 1. 布局工具
```html
<!-- Flexbox 工具 -->
<div data-flex data-justify="center" data-items="center" data-gap="4">
  <div>项目1</div>
  <div>项目2</div>
</div>

<!-- Grid 工具 -->
<div data-grid data-cols="3" data-gap="4" data-responsive>
  <div data-col-span="2">主要内容</div>
  <div>侧边栏</div>
</div>
```

### 2. 文本工具
```html
<h1 data-text="4xl" data-weight="bold" data-color="primary">
  大标题
</h1>

<p data-text="lg" data-color="muted" data-line-height="relaxed">
  段落文本
</p>
```

### 3. 状态工具
```html
<!-- 可见性控制 -->
<div data-show="md:block lg:hidden">
  在中等屏幕显示，大屏幕隐藏
</div>

<!-- 交互状态 -->
<div data-hover="scale" data-focus="ring" data-active="pressed">
  交互元素
</div>
```

## 主题系统

### 主题切换
```html
<!-- 主题选择器 -->
<select data-theme-switcher>
  <option value="light">浅色主题</option>
  <option value="dark">深色主题</option>
  <option value="auto">跟随系统</option>
</select>
```

```css
/* 主题实现 */
[data-theme="light"] {
  --color-bg: white;
  --color-text: #1f2937;
}

[data-theme="dark"] {
  --color-bg: #1f2937;
  --color-text: white;
}

@media (prefers-color-scheme: dark) {
  [data-theme="auto"] {
    --color-bg: #1f2937;
    --color-text: white;
  }
}
```

## 动画系统

### 过渡动画
```css
/* 预设过渡 */
[data-transition="fast"] { transition: all 0.15s ease; }
[data-transition="normal"] { transition: all 0.3s ease; }
[data-transition="slow"] { transition: all 0.5s ease; }

/* 悬停效果 */
[data-hover="scale"]:hover { transform: scale(1.05); }
[data-hover="lift"]:hover { transform: translateY(-2px); }
[data-hover="glow"]:hover { box-shadow: 0 0 20px var(--color-primary); }
```

### 关键帧动画
```css
/* 加载动画 */
@keyframes spin {
  to { transform: rotate(360deg); }
}

[data-loading="true"]::before {
  content: "";
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}
```

## 使用示例

### 完整页面示例
```html
<!DOCTYPE html>
<html lang="zh-CN" data-theme="auto">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fountustic CSS 示例</title>
  <link rel="stylesheet" href="fountustic.css">
</head>
<body data-font="system" data-bg="neutral-50">
  <!-- 导航栏 -->
  <nav data-nav data-sticky data-bg="white" data-shadow="sm">
    <div data-container>
      <div data-flex data-justify="between" data-items="center">
        <div data-nav-brand>
          <h1 data-text="xl" data-weight="bold">Fountustic</h1>
        </div>
        <div data-space-x="4">
          <a href="#" data-link>首页</a>
          <a href="#" data-link>文档</a>
          <button data-variant="solid" data-size="sm">开始使用</button>
        </div>
      </div>
    </div>
  </nav>

  <!-- 主要内容 -->
  <main data-container data-py="12">
    <section data-text="center" data-mb="12">
      <h1 data-text="5xl" data-weight="bold" data-mb="4">
        为后端开发者设计的 CSS 框架
      </h1>
      <p data-text="xl" data-color="muted" data-mb="8">
        零学习成本，纯 CSS 实现，现代化设计
      </p>
      <div data-space-x="4">
        <button data-variant="solid" data-size="lg">
          立即开始
        </button>
        <button data-variant="outline" data-size="lg">
          查看文档
        </button>
      </div>
    </section>

    <!-- 特性展示 -->
    <section data-grid data-cols="1 md:3" data-gap="8">
      <div data-card data-text="center" data-p="6">
        <div data-w="12" data-h="12" data-bg="primary-100" data-rounded="full" 
             data-flex data-items="center" data-justify="center" data-mx="auto" data-mb="4">
          🚀
        </div>
        <h3 data-text="lg" data-weight="semibold" data-mb="2">零学习成本</h3>
        <p data-color="muted">直观的 data 属性，无需学习复杂的类名</p>
      </div>
      
      <div data-card data-text="center" data-p="6">
        <div data-w="12" data-h="12" data-bg="success-100" data-rounded="full" 
             data-flex data-items="center" data-justify="center" data-mx="auto" data-mb="4">
          💡
        </div>
        <h3 data-text="lg" data-weight="semibold" data-mb="2">纯 CSS 实现</h3>
        <p data-color="muted">无需 JavaScript，所有交互通过 CSS 完成</p>
      </div>
      
      <div data-card data-text="center" data-p="6">
        <div data-w="12" data-h="12" data-bg="warning-100" data-rounded="full" 
             data-flex data-items="center" data-justify="center" data-mx="auto" data-mb="4">
          ⚡
        </div>
        <h3 data-text="lg" data-weight="semibold" data-mb="2">现代化</h3>
        <p data-color="muted">使用最新 CSS 特性，现代浏览器优化</p>
      </div>
    </section>
  </main>
</body>
</html>
```

## 开发工具

### 1. CSS 变量检查器
```css
/* 开发模式：显示未定义的变量 */
[data-debug="true"] * {
  background: red !important;
  color: white !important;
}

[data-debug="true"] *:where(
  [class*="var(--undefined"]
) {
  outline: 2px solid red;
}
```

### 2. 组件状态可视化
```css
/* 显示组件边界 */
[data-debug-components="true"] [data-card] {
  outline: 1px dashed blue;
}

[data-debug-components="true"] [data-button] {
  outline: 1px dashed green;
}
```

### 3. 性能监控
```css
/* 标记复杂选择器 */
[data-debug-performance="true"] {
  --complex-selector-warning: "This selector might be slow";
}
```

## 文档和生态

### 文档网站结构
- **快速开始**：5分钟上手指南
- **组件库**：所有组件的使用示例
- **设计系统**：颜色、字体、间距规范
- **最佳实践**：推荐的使用模式
- **迁移指南**：从其他框架迁移

### 构建工具集成
```javascript
// Vite 插件
import { fountusticPlugin } from 'vite-plugin-fountustic'

export default {
  plugins: [
    fountusticPlugin({
      theme: 'custom',
      purge: true,
      debug: process.env.NODE_ENV === 'development'
    })
  ]
}
```

这套设计充分体现了 "为后端开发者准备" 的理念，通过数据属性提供直观的 API，同时保持了现代 CSS 的强大功能。
