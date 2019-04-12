---
id: 11
title: The right way to call assertion in PHPUnit 
description: "During the preparation of TDD workshops, I began to think about how to write assertions. It turns out that there are several possibilities, but is there the only correct one?"
sources:
    -
        - "https://phpunit.readthedocs.io/en/8.0/assertions.html#static-vs-non-static-usage-of-assertion-methods"
        - "Static vs. Non-Static Usage of Assertion Methods"
    -
        - "https://github.com/sebastianbergmann/phpunit/issues/1914"
        - "Usage of asserts is incorrect? #1914"
---

**TLDR:**
it's not so simple, read to the end, maybe you will learn something.

Let's start with what the classic test looks like?

```php
use PHPUnit\Framework\TestCase;

class SimpleTest extends TestCase
{
    public function testAssertTrue(): void
    {
        // Arrange

        // Act

        // Assert
    }
}
```

We will focus on this part with `assert`.

## Assert

As it turns out, to call any assertion we have to choose:

```php
$this::assertEquals()
self::assertEquals()
```

This two option looks most naturally and they differ almost nothing.
`$this` calls assert from the object itself, `self` uses static context. 
PHPUnit tests always have public methods, so in this case, there is no difference.

```php
static::assertEquals()
```

Here we have [Late Static Bindings](https://www.php.net/manual/en/language.oop5.late-static-bindings.php){rel="nofollow"}. 
`static` references the class that was initially called at runtime.
If you inherit test cases, this option can save your life.
Otherwise, it is a shame to pay attention to her.

```php
assertEquals()
```

Quite an elegant selection and a lot fewer characters. 
A classic call for functions from global scope. Why not?

```php
use PHPUnit\Framework\Assert;

Assert::assertEquals()
```

Less popular solution but allows you to be called from anywhere and does not require inheritance from `TestCase`.
Sometimes can be useful. It's worth knowing.

According to the documentation `$this->assertEquals()` is another option, but assertions are static function. 
I don't take it into account because it violates the definition. 
It should not work at all, but this is PHP 😠.

Let us now consider these possibilities on two levels.

## Popularity

I allowed myself to conduct a small survey using Twitter, here are the results:

<div style="width: 500px; margin:0 auto;">
<blockquote class="twitter-tweet" data-lang="pl"><p lang="en" dir="ltr">What is your favorite way of writing assertions in <a href="https://twitter.com/hashtag/phpunit?src=hash&amp;ref_src=twsrc%5Etfw">#phpunit</a>? <a href="https://twitter.com/hashtag/php?src=hash&amp;ref_src=twsrc%5Etfw">#php</a> <a href="https://twitter.com/hashtag/tdd?src=hash&amp;ref_src=twsrc%5Etfw">#tdd</a></p>&mdash; Arkadiusz Kondas (@ArkadiuszKondas) <a href="https://twitter.com/ArkadiuszKondas/status/1116048317648121856?ref_src=twsrc%5Etfw">10 kwietnia 2019</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

As you can see `$this::assertEquals()` is the winner. Does it mean something to you?

## Performance

Well, if it's not popular, let's consider performance. 
As you know, I always use a decent tool for this [phpbench](https://github.com/phpbench/phpbench){rel="nofollow"}.
(you can read more details about phpbench in this blog post: [Binary heap implementation in PHP](/binary-heap-implementation-in-php/)).

Let's write a little benchmark with `100000` iterations for each option:

```php
use PhpBench\Benchmark\Metadata\Annotations\BeforeMethods;
use PhpBench\Benchmark\Metadata\Annotations\Iterations;
use PhpBench\Benchmark\Metadata\Annotations\Revs;
use PHPUnit\Framework\Assert;
use PHPUnit\Framework\TestCase;

/**
 * @BeforeMethods({"init"})
 */
final class AssertBench extends TestCase
{
    public function init(): void
    {
        require __DIR__.'/../../vendor/phpunit/' . 
        'phpunit/src/Framework/Assert/Functions.php';
    }

    /**
     * @Revs(100000)
     * @Iterations(5)
     */
    public function benchAssertThis() : void
    {
        $this->assertEquals(1, 1);
    }

    /**
     * @Revs(100000)
     * @Iterations(5)
     */
    public function benchAssertSelf() : void
    {
        self::assertEquals(1, 1);
    }

    /**
     * @Revs(100000)
     * @Iterations(5)
     */
    public function benchAssertStatic() : void
    {
        static::assertEquals(1, 1);
    }

    /**
     * @Revs(100000)
     * @Iterations(5)
     */
    public function benchAssertFunction() : void
    {
        \assertEquals(1, 1);
    }

    /**
     * @Revs(100000)
     * @Iterations(5)
     */
    public function benchAssertStaticClass() : void
    {
        Assert::assertEquals(1, 1);
    }
}
```

As easy as shooting fish in a barrel 😉. Okay, so it's known that it will show you the results.
You don't have to run it alone, but if you're curious, I encourage you.

```bash
$ vendor/bin/phpbench run benchmarks/PHPUnit/AssertBench.php
 --report=time --retry-threshold=1 

+------------------------+---------+---------+--------+-------+
| subject                | mode    | mean    | rstdev | diff  |
+------------------------+---------+---------+--------+-------+
| benchAssertThis        | 0.448μs | 0.448μs | 0.43%  | 1.00x |
| benchAssertSelf        | 0.458μs | 0.458μs | 0.37%  | 1.02x |
| benchAssertStatic      | 0.450μs | 0.448μs | 0.53%  | 1.00x |
| benchAssertFunction    | 0.603μs | 0.602μs | 0.51%  | 1.34x |
| benchAssertStaticClass | 0.456μs | 0.457μs | 0.35%  | 1.02x |
+------------------------+---------+---------+--------+-------+
```

Without major differences, except the call of the function is the slowest.

Now you know what to choose?

## Be consistent

As you can see, it is difficult to determine the right way.

Whichever option you choose, you can help yourself. 
[PHP-CS-Fixer](https://github.com/FriendsOfPHP/PHP-CS-Fixer){rel="nofollow"} has a dedicated fixer for that.

Use `php_unit_test_case_static_method_calls` (or `PhpCsFixer\Fixer\PhpUnit\PhpUnitTestCaseStaticMethodCallsFixer` class). 
You can chosse three available options: `this`, `self` and `static` (currenly `static` is default one).

All you have to do is push it into the build pipeline and you can sleep well.

Enjoy your assertions ☑️.

P.S.
My personal choice: `self::assertEquals()`.
