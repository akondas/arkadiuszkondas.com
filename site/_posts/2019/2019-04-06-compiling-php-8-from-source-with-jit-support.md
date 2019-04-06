---
id: 10
title: Compiling PHP 8 from source with JIT support
description: "Initially, this post was to apply to the experiments with JIT alone. However, I encountered some problems at the time of compiling PHP so I decided to share this experience."
sources:
    -
        - "https://wiki.php.net/rfc/jit"
        - "PHP RFC: JIT"
    -
        - "https://www.sammyk.me/compiling-php-from-source-writing-tests-for-php-source"
        - "Compiling PHP from source"
    -
        - "https://beberlei.de/2019/03/23/playing_with_the_php_jit.html"
        - "Playing with the PHP JIT"
---

If you don't know what JIT is and why it will we implemented in PHP 8 please read Joe Watkins [PHP GR8](https://blog.krakjoe.ninja/2019/03/php-gr8.html){rel="nofollow"} blog post.

In my opinion, the more people will be able to experiment with JIT the better it will be.

Let's start at the very beginning. The process outlined in this post applies to Ubuntu,
 but the rest of the systems will look the same (with some exceptions: Windows, sorry).

## Dependencies 

We will need several dependencies to compile PHP from source.

```bash
sudo apt-get update
sudo apt-get install git build-essential 
libgccjit-6-dev libzip-dev autoconf re2c bison libxml2-dev -y
```

It may turn out that this is not enough. There is then a general rule: try to install missing dependency with `lib` prefix 
and/or `-dev` suffix. For example, when you encounter an error like this (in configure step):

```bash
configure: error: xml2-config not found. 
Please check your libxml2 installation.
```

You can run this command to install missing `libxml2`:

```bash
sudo apt-get install libxml2-dev
```

After installing the dependencies, we will need the source code.

## Clone PHP source

```bash
cd ~
git clone https://github.com/php/php-src.git
cd php-src
```

By default, we land on the master branch, so in current case, it will be `PHP 8.0.0-dev`

## Configure

Since `./configure` file is missing we must use `./buildconf` to generate one:

```bash
./buildconf
```

Next, we want to configure our compilation. You can use `--prefix` flag to set destination dir.

```bash
./configure --prefix=/opt/php/php8 --enable-opcache --with-zlib 
--enable-zip --enable-json --enable-sockets --without-pear
```

To see all available options:

```bash
./configure --help
```

When everything goes well you should see:

```bash
Generating files
configure: creating ./config.status
creating main/internal_functions.c
creating main/internal_functions_cli.c
+--------------------------------------------------------------------+
| License:                                                           |
| This software is subject to the PHP License, available in this     |
| distribution in the file LICENSE.  By continuing this installation |
| process, you are bound by the terms of this license agreement.     |
| If you do not agree with the terms of this license, you must abort |
| the installation process at this point.                            |
+--------------------------------------------------------------------+

Thank you for using PHP.

config.status: creating main/build-defs.h
config.status: creating scripts/phpize
config.status: creating scripts/man1/phpize.1
config.status: creating scripts/php-config
config.status: creating scripts/man1/php-config.1
config.status: creating sapi/cli/php.1
config.status: creating sapi/phpdbg/phpdbg.1
config.status: creating sapi/cgi/php-cgi.1
config.status: creating ext/phar/phar.1
config.status: creating ext/phar/phar.phar.1
config.status: creating main/php_config.h
config.status: executing default commands
```

We are now ready to build the project.

## Build

Before you issue a build command, it is worth checking how many cores your machine has:

```bash
nproc
```

Now you can use this number to make build faster with `-j` flag:

```bash
make -j4
```

This will use `4` cores to make a build. After `make` is done, you should see:

```bash
Generating phar.php
Generating phar.phar
PEAR package PHP_Archive not installed: 
 generated phar will require PHP's phar extension be enabled.
directorytreeiterator.inc
directorygraphiterator.inc
pharcommand.inc
clicommand.inc
invertedregexiterator.inc
phar.inc

Build complete.
Don't forget to run 'make test'.
```

If you have more time you can test your compiled PHP:

```bash
make test
```

Next, we want to make compiled binary available in an independent place.

## Install

```bash
sudo make install
```

This command will install PHP in `--prefix` destination (provided during configuration). Now check if new compiled PHP works:

```bash
/opt/php/php8/bin/php -v

PHP 8.0.0-dev (cli) (built: Apr  5 2019 11:19:45) ( NTS )
Copyright (c) The PHP Group
Zend Engine v4.0.0-dev, Copyright (c) Zend Technologies
```

It starts to get interesting.

## Enable extension

And this is the point about which I completely forgot. Without it, there will be no support for JIT because 
it is an integral part of `opcache`.

> PHP JIT is implemented as an almost independent part of OPcache. It may be enabled/disabled at PHP compile time and at run-time.

We want to enable `opcache` extension. Since there is no configuration file you can create new one. 
First lets check correct path:

```bash
$ /opt/php/php8/bin/php --ini
Configuration File (php.ini) Path: /opt/php/php8/lib
Loaded Configuration File:         (none)
```

You can copy `php.ini-development` or `php.ini-production` from source directory (and rename it to `php.ini`) or create new one.

At this moment, we will create a new empty file and load the extension.

```bash
cd /opt/php/php8/lib
sudo touch php.ini
echo 'zend_extension=opcache.so' | sudo tee php.ini 
```

You can check if everything goes correclty either with `-v` option or `-m` option:

```bash
/opt/php/php8/bin/php -v            
PHP 8.0.0-dev (cli) (built: Apr  5 2019 11:19:45) ( NTS )
Copyright (c) The PHP Group
Zend Engine v4.0.0-dev, Copyright (c) Zend Technologies
    with Zend OPcache v8.0.0-dev, Copyright (c), by Zend Technologies
```

Elegantly, you have the latest PHP version. We can say that you have bleeding edge PHP version 🚀. 

## Check JIT

To check if JIT works and can optimize your code create simple script `jit.php`:

```php
for ($i=0; $i<100; $i++) {
    echo $i;
}
```

First run it and check if works:
```bash
/opt/php/php8/bin/php jit.php
```

To enable JIT we must provide additional ini flags: `opcache.enable_cli=1` `opcache.jit_buffer_size=50000000` `opcache.jit=1235`
```bash
/opt/php/php8/bin/php -d opcache.enable_cli=1 
-d opcache.jit_buffer_size=50000000 -d opcache.jit=1235 jit.php
```

You will find more details about new settings in [RFC](https://wiki.php.net/rfc/jit){rel="nofollow"}

At first glance, it does not change anything, if you want to be sure that JIT works add `opcache.jit_debug=1`:

```bash
/opt/php/php8/bin/php -d opcache.enable_cli=1 
-d opcache.jit_buffer_size=50000000 -d opcache.jit=1235 
-d opcache.jit_debug=1 jit.php
```

You should see generated assembler code:

```bash
.L1:
        test $0x1, 0x9(%rdi)
        jnz .L8
.L2:
        mov $0x0, (%rdi)
        mov $0x4, 0x8(%rdi)
.L3:
        mov $EG(exception), %rax
        cmp $0x0, (%rax)
        jnz JIT$$exception_handler
        jmp .L5
.L4:
        mov $0x7fd319514630, %r15
        mov $0x5555cc61c100, %rax

```

You can also check performance with/without JIT using `Zend/bench.php` file from the source directory.

In the next entry, I will present the results of experiments as JIT affects performance in machine learning tasks.

Happy JITing 😉
