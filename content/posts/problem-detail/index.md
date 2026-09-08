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

## 一、问题

HTTP 状态码只能表达错误的大类。

401 是认证失败，404 是资源不存在。但是客户端要做的事情，往往比"知道出错了"更多。

同样是 400，可能是参数格式不对，也可能是余额不足。前端需要区分这两种情况，给出不同的提示，甚至走不同的处理逻辑。

对用户来说，这两句话的差别很大。

> 您的余额不足，无法购买该产品。

> 系统发生错误，请联系管理员。

状态码本身给不了这个信息。于是，很多 API 干脆放弃状态码，不管成功失败一律返回 200，把真正的结果塞进一个通用结构。

```java
public class GenericResult<T> {
  private boolean success;
  private T data;
  private ErrorType errorType;
  private String message;
}
```

客户端先判断 `success`，再看 `errorType`。

但是，这等于绕开了 HTTP 协议。状态码失去意义，网关、监控、重试策略都没法再从状态码判断请求是否成功。

IETF 也注意到了这个问题，提出了 RFC 7807。

## 二、RFC 7807

RFC 7807 定义了一种通用的错误响应格式，叫做"问题详情"（problem detail）。

它要求响应的 `Content-Type` 是 `application/problem+json`。这个类型就是给客户端的信号：响应体不是业务数据，而是一份结构化的错误说明。

规范推荐至少包含五个字段，你也可以自己扩展。

- **type**（URI）—— 错误类型的标识，见 [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986)。它指向一份人类可读的说明文档，默认值是 `about:blank`。
- **title**（String）—— 简短描述。同一种语言下，同类错误的 title 保持不变。
- **status**（Integer）—— HTTP 状态码，见 [RFC 7231](https://www.rfc-editor.org/rfc/rfc7231#section-6)。
- **detail**（String）—— 这一次错误的详细描述。
- **instance**（URI）—— 标示错误发生的具体位置。

注意，`title` 和 `detail` 的分工不一样。title 是错误的类别，可以拿来做聚合和统计；detail 是这一次的具体情况，通常带有本次请求才有的数据。

`status` 字段看起来是多余的，其实不是。响应经过反向代理或中间件时，状态码有可能被改写，把它同时放进响应体，客户端就能拿到服务端原本想返回的那个码。

下面是一个例子。

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

`balance` 和 `accounts` 是扩展字段，规范允许你这样加。

## 三、前端怎么处理

前端的判断依据是 `Content-Type`，不是状态码。如果是 `application/problem+json`，说明服务端明确告诉了你出什么问题，直接把 `detail` 展示给用户。

{{< admonition failure "信用卡额度不足" >}}
您剩余的信用额度为 30 元，无法购买该商品。
{{< /admonition >}}

如果状态码报错，但 `Content-Type` 不是它，那多半是没被业务代码接住的异常，只能给通用提示。

{{< admonition failure "系统错误" >}}
遇到未知错误，请联系系统管理员。
{{< /admonition >}}

扩展字段在表单场景下特别好用。后端把校验失败的字段名放进扩展字段，前端就能高亮对应的输入框，把错误提示显示在正确的位置，而不是笼统弹一句"提交失败"。

这样一来，错误处理的契约就从"前后端口头约定"变成了协议的一部分。

（完）
