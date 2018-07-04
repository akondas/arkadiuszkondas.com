---
layout: post
title: Compiling PHP with Thread Safety and pthreads extension
description: "Provide multi-threading for your project with pthreads PHP extension. Learn how to compile PHP with --enable-maintainer-zts flag and pthreads extension. In the end we will be runnig script with multiple threads ... so Share Nothing, Do Everything."
sources:
	-
		- "https://www.sammyk.me/compiling-php-from-source-writing-tests-for-php-source"
		- "Compiling PHP from source"
---

## Compiling PHP from source

The first step to entering to threads world is downloading and compiling the PHP source code.

Before we start we need to install dependencies:

> In this article, I assume you're using *Ubuntu*. If you have a different operating system, match your command accordingly.

```bash
sudo apt-get update
sudo apt-get install git build-essential \
autoconf re2c bison libxml2-dev -y
```