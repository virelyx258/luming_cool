---
title: 我重装了WordPress
published: 2025-02-15 22:09:00
description: '为了解决令人摸不着头脑的SEO问题，我重装了WordPress。'
image: './reinstall-wordpress.assets/5cd7f0d85e932253f16f858e5e265d6a-1024x574.webp'
tags: ['WordPress']
category: '公告'
draft: false 
lang: ''
---

5日下午，我在使用Follow给我自己的网站认证。但就在验证这一关里，它频频报错：

> [GET] "https://virelyx.com/feed?ts=1739626807735": 403 Forbidden

无论我使用哪种方法，它都这样报。

外加联想起必应说我SEO有问题，我便开始怀疑是不是中途切换主题的原因（小白无经验，见笑了）。

于是，我就重装了WordPress。所幸无数据丢失。友情链接丢失了，一个一个复制了好久。（苦笑）

最🤡的一集来了：Follow仍然不认我的站点，仍然是 403 Forbidden

最后再试一次：

This message is used to verify that this feed (feedId:113501963366352896) belongs to me (userId:113500827299870720). Join me in enjoying the next generation information browser https://follow.is.

仍提示403。可能是我WAF的问题。回头我再看看。

在套了CDN的情况下已成功认证。
