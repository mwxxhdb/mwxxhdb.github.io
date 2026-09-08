---
title: {{ replace .File.ContentBaseName "-" " " | title }}
date: {{ .Date }}
slug: {{ .File.ContentBaseName }}
draft: true
description:
tags:
categories:
---

<!--more-->

<!--
图片放在本文章目录下，用相对路径引用：
  ![架构图](arch.png)
封面图命名为 featured-image.png 即可自动成为文章头图。
超过 2 MB 的大图 / GIF / 录屏请改用 R2 图床：https://img.mumaniu.cn/xxx.png
-->
