---
id: 12
title: How to run PHP 8 with JIT support using Docker
description: "In this post, I will show you how you can start using PHP 8 with JIT support with just one command using Docker."
sources:
    -
        - "https://arkadiuszkondas.com/compiling-php-8-from-source-with-jit-support/"
        - "Compiling PHP 8 from source with JIT support"
    -
        - "https://cloud.docker.com/repository/docker/akondas/php"
        - "Docker Unofficial Image packaging for PHP 8.0"
---

After writing a post about [Compiling PHP 8 from source with JIT support](https://arkadiuszkondas.com/compiling-php-8-from-source-with-jit-support/)  
I realized that there is a much better and simpler way allowing you to test PHP 8 with JIT on your own.

## Docker image 

If you don't know what Docker is (and you should know) please check this [Tutorial](https://rominirani.com/docker-tutorial-series-a7e6ff90a023){rel="nofollow"} from Romin Irani.

The Docker image is a very good form for preparing the appropriate version of PHP ready for run on every machine.

Check official documentation to [install Docker](https://docs.docker.com/install/){rel="nofollow"} on your machine.

I prepared Docker image with compiled PHP 8 and it is available on Docker Hub:
[https://cloud.docker.com/u/akondas/repository/docker/akondas/php](https://cloud.docker.com/u/akondas/repository/docker/akondas/php)

Docker image tag: `akondas/php:8.0-cli-alpine`.

In the network, you can find similar images that could be suitable for the same.
However, I wanted to achieve two additional goals:

 1. learn to create your own images and share them publicly
 2. prepare an image similar to the official PHP 7.x images
 
The second point will be especially necessary for me to create a comprehensive comparison of the php version in terms of performance.

## Run PHP 8

I assume you have installed the Docker or you have already had it before. To run any `.php` file on PHP 8 from your machine we need:

 * download and run the container image  
   `docker run -it akondas/php:8.0-cli-alpine`
 * mount working directory (so that the container can read files from the actual folder in which it is located)  
   `-v "$PWD":/usr/src/app`
 * set the working directory to the one assembled above  
   `-w /usr/src/app`

So full command looks like this:

```bash
docker run -it -v "$PWD":/usr/src/app -w /usr/src/app \
akondas/php:8.0-cli-alpine php script.php
```

## Enable JIT support

To enable JIT you must provide these four additional parameters:
```bash
-dzend_extension=opcache.so 
-dopcache.enable_cli=1 
-dopcache.jit_buffer_size=500000000
-dopcache.jit=1235
```

The first one runs `opcache`, the others configure JIT.
You can change their values in this way and check different effects.
You will find more details about new settings in [RFC](https://wiki.php.net/rfc/jit){rel="nofollow"}

## Test performance

Let's make a simple test script to test the performance of new JIT. I suggest to write a nice and simple Fibonacci function 😈:

```php
function fibonacci($n){
    return(($n < 2) ? 1 : fibonacci($n - 2) + fibonacci($n - 1));
}

$n = 32;
$start = microtime(true);
$fibonacci = fibonacci($n);
$stop = microtime(true);

echo sprintf("Fibonacci(%s): %s\nTime: %s", $n, $fibonacci, $stop-$start);
```

And now time for the show. First, let's check the result with JIT turned off.

```bash
docker run -it -v "$PWD":/usr/src/app -w /usr/src/app \
akondas/php:8.0-cli-alpine php fibo.php

Fibonacci(32): 3524578
Time: 0.17796015739441 
```

Ok, JIT, show me what you got 💪:

```bash
docker run -it -v "$PWD":/usr/src/app -w /usr/src/app \
akondas/php:8.0-cli-alpine php -dzend_extension=opcache.so \
-dopcache.enable_cli=1 -dopcache.jit_buffer_size=500000000 \
-dopcache.jit=1235 fibo.php

Fibonacci(32): 3524578
Time: 0.050444841384888
```

So `0.1779` vs `0.0504` looks impressive. 
Starting the JIT, in the case of Fibonacci calculation, gave `352%` of the speed increase 🚄.

**Now is the time for you to test it!** I encourage you to share the results of experiments in the comments.

Enjoy the JIT.
