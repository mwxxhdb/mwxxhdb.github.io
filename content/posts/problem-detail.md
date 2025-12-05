---
title: RFC 7807 Problem Detail
date: 2024-01-01
slug: problem-detail
draft: false
description: RFC 7807 定义了 HTTP API 错误响应的标准格式
tags:
  - API
  - HTTP
  - RFC
categories:
  - 技术
toc: true
---

## 背景

我们都知道，通过状态码可以表示不同的错误信息，例如 401 代表认证失败，404 代表资源不存在等等。

但是当一个 API 返回非 200 的错误状态码时，客户端通常需要知道具体的错误类型，根据错误类型执行一些处理逻辑，或者弹出一个具体和友好的错误提示而不是一个通用的错误信息。

比如提示信息 "您的余额不足，无法购买该产品。" 要好于 "系统发生错误，请联系管理员。"

为了解决这个问题，一些 API 的提供者决定把可控的错误也通过 200 状态码返回，结果信息封装在一个通用的实体里。客户端通过判断 success 以及 errorType 进行错误处理。

```java
public class GenericResult<T> {
  private boolean success;
  private T data;
  private ErrorType errorType;
  private String message;
}
```

Internet Engineering Task Force (IETF) 讨论了这个问题，创建了提议 [RFC 7807](https://www.rfc-editor.org/rfc/rfc7807)

## RFC 7807

RFC 7807 定义了通用错误信息的返回格式，并要求 Response 的 `Content-Type` 是 `application/problem+json`

RFC 7807 推荐在错误信息中至少包含 5 个字段，并且可以自定义其他字段。

- type (URI) -  URI 引用 [[RFC3986](https://www.rfc-editor.org/rfc/rfc3986)]，用于识别错误类型。该字段指向一个人类可读的错误信息说明文档。默认值为 "about:blank"。
- title (String) - 人类可读的简短错误描述。同一语言下，相同类型错误信息的 title 不变。
- status (Integer) - HTTP 状态码（[[RFC7231](https://www.rfc-editor.org/rfc/rfc7231#section-6)] 第六节），该字段主要用于在服务器返回的状态码被反向代理或中间件改变后，让客户端也能获取原始的状态码。
- detail (String) - 人类可读的错误详细描述。
- instance (URI) - 标示错误发生的具体情况或位置。

示例：

```json
{
  "type": "https://example.com/problems/out-of-credit",
  "title": "信用卡额度不足",
  "detail": "您剩余的信用额度为 30 元，无法购买该商品。",
  "instance": "/account/12345/msgs/abc",
  "balance": 30,
  "accounts": ["/account/12345", "/account/67890"]
}
```

## 应用 RFC 7807 后，前端的处理逻辑

当返回的 Content-Type 是 `application/problem+json` 时，弹出错误提示。

{{< admonition failure "信用卡额度不足" >}}
您剩余的信用额度为 30 元，无法购买该商品。
{{< /admonition >}}

当返回错误的状态码，且 Content-Type 不是 `application/problem+json` 时，弹出通用提示。

{{< admonition failure "系统错误" >}}
遇到未知错误，请联系系统管理员。
{{< /admonition >}}

表单验证场景下，后端服务可以将校验失败的字段放在 ProblemDetail 的扩展字段中，前端根据这个字段高亮显示验证失败的字段以及在正确的位置展示错误信息。