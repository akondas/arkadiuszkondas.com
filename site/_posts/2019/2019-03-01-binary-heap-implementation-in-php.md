---
id: 5
title: Binary heap implementation in PHP
description: "Short explanation what is binary heap and how to implement it in pure PHP from scratch. I will show you how to compare it with native solution (SPL). Performance results are surprising."
sources:
    -
        - "https://github.com/php-ai/php-data-structures"
        - "PHP Data Structures"
    -
        - "https://en.wikipedia.org/wiki/Binary_heap"
        - "Binary heap"
    -
        - "http://eloquentjavascript.net/1st_edition/appendix2.html"
        - "Eloquent Java Script: Binary Heaps"
    -
        - "https://docs.google.com/spreadsheets/d/1uZQ3wOXl3gLLCisU6h-GfFLARJeKJK_d9sXr-Pz417s/edit?usp=sharing"
        - "BinaryHeap Performance Data"
---

The main motivation to create this implementation was a need to create a different structure (kd-tree) for my 
machine learning library [php-ml](http://php-ml.org). This is also an interesting research, so I decided that it 
is worth sharing. 

## Heap

Heap is a special data structure that is based on a tree and finds use in many algorithms.
A typical data structure, which can be built using a heap, is a [priority queue](https://en.wikipedia.org/wiki/Priority_queue){rel="nofollow"}.
The heap also used for one of the most popular and efficient sorting algorithms - [heap sort](https://en.wikipedia.org/wiki/Heapsort){rel="nofollow"}.

The heap is defined in such a way, that the root of the heap is smaller or larger than its children's nodes.

If the parent node has a higher value than the children's nodes, we have dealing with `max-heap`, and if the parent 
node has a smaller value than children's nodes, we're talking about a `min-heap`.

Example of `min-heap`:

![binary min heap](/assets/posts/heap.svg)

The important thing is that we can always easily find the maximum or minimum value belonging to the tree (its peak).

There are many types of heaps, such as binary heap, Fibonacci heap, B-heap or Brodal heap.

Ok, so far so good, let's go deeper.

## Binary heap

The binary heap is a full [binary tree](https://en.wikipedia.org/wiki/Binary_tree){rel="nofollow"}, which all internal levels are completely filled and the last level can be filled in
completely or partially. As we are dealing with a binary structure, most of the operations can be done in a logarithmic time.

Most popular way to implement a binary heap is to use an array. If we assume that the root is under index 1, its elements
children will be located under indexes 2 and 3. This order can be generally written down as follows: 
index `i` indicates parent, index `2*i` - left child, and `2*i + 1` - right child.

### Implementation

At the beginning let's assume that elements of the heap can be any elements `mixed[]`. 
Such elements can't be compared using `>` or `<` operator, so we need some kind of `callable $scoreFunction`.

```php
final class BinaryHeap
{
    /**
     * @var mixed[]
     */
    private $nodes = [];

    /**
     * @var callable
     */
    private $scoreFunction;

    public function __construct(callable $scoreFunction)
    {
        $this->scoreFunction = $scoreFunction;
    }
}
```

Then we add some basic methods which they explain themselves.

```php
public function peek()
{
    return $this->nodes[0];
}

public function size(): int
{
    return count($this->nodes);
}

public function isEmpty(): bool
{
    return $this->nodes === [];
}

public function nodes(): array
{
    return $this->nodes;
}
```

As you can see, `peek` is really simple without any complexity (`O(1)`).
Now a more difficult part. 

When an element needs to be added to the heap, it is placed at the end of the array and must "bubble" up by repeatedly
exchanging it from the parent until we find a parent that is smaller than the new node.

```php
public function push($node): void
{
    $this->nodes[] = $node;
    $this->bubbleUp(count($this->nodes) - 1);
}

public function pop()
{
    $peek = $this->nodes[0];
    $last = array_pop($this->nodes);

    if (!$this->isEmpty()) {
        $this->nodes[0] = $last;
        $this->sinkDown(0);
    }

    return $peek;
}

private function bubbleUp(int $index): void
{
    $node = $this->nodes[$index];
    $score = ($this->scoreFunction)($node);

    while ($index > 0) {
        $parentIndex = (int) floor(($index + 1) / 2) - 1;
        $parent = $this->nodes[$parentIndex];

        if ($score >= ($this->scoreFunction)($parent)) {
            break;
        }

        $this->nodes[$parentIndex] = $node;
        $this->nodes[$index] = $parent;
        $index = $parentIndex;
    }
}

private function sinkDown(int $index): void
{
    $size = $this->size();
    $node = $this->nodes[$index];
    $score = ($this->scoreFunction)($node);

    while (true) {
        $child2Index = ($index + 1) * 2;
        $child1Index = $child2Index - 1;
        $swap = null;

        if ($child1Index < $size && ($child1Score = ($this->scoreFunction)($this->nodes[$child1Index])) < $score) {
            $swap = $child1Index;
        }

        if ($child2Index < $size && ($this->scoreFunction)($this->nodes[$child2Index]) < ($swap === null ? $score : $child1Score)) {
            $swap = $child2Index;
        }

        if ($swap === null) {
            break;
        }

        $this->nodes[$index] = $this->nodes[$swap];
        $this->nodes[$swap] = $node;
        $index = $swap;
    }
}
```

Finally, it's time to test our fresh new `BinaryHeap` class

```php
    public function testBinaryHeap(): void
    {
        $heap = new BinaryHeap(function ($x) {
            return $x;
        });
        
        foreach([10, 5, 3, 2, 1, 7] as $int) {
            $heap->push($int);
        }

        self::assertEquals(1, $heap->pop());
        self::assertEquals(2, $heap->pop());
    }
```

You can find full working code in [php-ai/php-data-structures](https://github.com/php-ai/php-data-structures).


## Performance 🚀

After happy coding we need to check how our solution is compared to other approaches. 
Consider how you can draw from the collection the smallest possible value differently.

**sort**  
You can sort the array and extract the first element from it (works only for primitives) .

```php
sort($numbers);
echo $numbers[0];
```

**foreach**  
Classic combination of `foreach` and `if`:

```php
$min = PHP_INT_MAX;
foreach ($numbers as $number) {
    if($number < $min) {
        $min = $number;
    }
}
echo $min;
```

**min**  
Built-in `PHP` solution:
```php
echo min($numbers);
```

**SplMinHeap**  
Built-in `SplMinHeap` class (which is an implementation of `min-heap`):
```php
$heap = new \SplMinHeap();
$heap->insert(...);
echo $heap->top();
```

**SplHeap**  
Similar to `SplMinHeap`, but `SplHeap` allows to implement custom score function (more generic approach):
```php
final class GenericSplHeap extends \SplHeap
{
    protected function compare($a, $b)
    {
        if($a === $b) {
            return 0;
        }

        return $a > $b ? 1 : -1;
    }
}

$heap = new GenericSplHeap();
$heap->insert(...);
echo $heap->top();
```

### Benchmarks

A simple script will not provide good quality performance tests. It also doesn't ensure their good stability.
Fortunately, there is a very good designed project in `PHP` land: 
[phpbench/phpbench](https://github.com/phpbench/phpbench) (thanks to [@dantleech](https://twitter.com/dantleech){rel="nofollow"}).

For me **Retry Threshold** is the most important feature:

> PHPBench is able to dramatically improve the stability of your benchmarks by retrying the iteration set until all the
deviations in time between iterations fit within a given margin of error.

This means that `phpbench` will keep repeating tests until their average time stabilizes. 
This gives us confidence that no other processes (running in the background) will affect our tests.

We will run script with `--retry-threshold=2`, what will mean, that each iteration can have a maximum of 2% deviation over time.

You can check full benchmark script in [BinaryHeapBench](https://github.com/php-ai/php-data-structures/blob/master/benchmarks/Heap/BinaryHeapBench.php).

Lets run benchmarks and see what's happened. Here are results for `10 000` random numbers:

```bash
composer bench-time benchmarks/Heap/BinaryHeapBench.php

+---------------------+----------+----------+--------+---------+
| subject             | mode     | mean     | rstdev | diff    |
+---------------------+----------+----------+--------+---------+
| benchSplMinHeap     | 0.759μs  | 0.760μs  | 0.28%  | 1.00x   |
| benchGenericSplHeap | 0.874μs  | 0.873μs  | 0.30%  | 1.15x   |
| benchBinaryHeap     | 1.177μs  | 1.182μs  | 0.92%  | 1.56x   |
| benchNativeMin      | 10.884μs | 10.823μs | 0.88%  | 14.24x  |
| benchNativeForeach  | 12.502μs | 12.538μs | 0.98%  | 16.50x  |
| benchNativeSort     | 96.412μs | 96.769μs | 0.92%  | 127.33x |
+---------------------+----------+----------+--------+---------+
```

Column marked as `mean` means average execution time spend on given approach.
The picture is worth a thousand words so simple chart illustrate it better.

[![heap performance](/assets/posts/heap-performance.svg)](/assets/posts/heap-performance.svg)

Surprised? 🤯
 
As you can see, our implementation may not be the fastest, but it **maintains an order of magnitude the same as the native solution**.
To be sure of the stability of the solution, we will now do a series of tests. 
We will increase the number of items in array to search: from 10x to 100000x 😱. Have no fear, Mr. Kondas is here 😂.

[![heap performance series](/assets/posts/heap-performance-series.svg)](/assets/posts/heap-performance-series.svg)

The chart has been cropped (since `sort` have dramatic times above 10000 elements), you can see original chart [here](/assets/posts/heap-performance-series-raw.svg){rel="nofollow"}.
You can find data collected in benchmarks in sources list under this post.

### Summary

As you can see `BinaryHeap` has very good performance while maintaining flexibility.
We have conducted a series of tests with good stability (`--retry-threshold`). You can use `scoreFunction` to 
implement any heap: from min to max and a whole bunch of others. You can install in through composer: `php-ai/php-data-structures`.

Happy heaping 😉
