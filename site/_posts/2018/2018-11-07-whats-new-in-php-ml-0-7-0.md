---
id: 2
title: What's new in PHP-ML 0.7.0
description: "A quick overview of new features, changes and fixes in PHP-ML 0.7.0 version"
sources:
    - 
        - "https://github.com/php-ai/php-ml/blob/master/CHANGELOG.md#070---2018-11-07"
        - PHP-ML Changelog
---
## BC Breaks

Before upgrading, make sure you know about backward incompatible changes:
- SVC classifier changed the default kernel type from `Kernel::LINEAR` to `Kernel::RBF` [https://github.com/php-ai/php-ml/pull/267](#267)

## New features

### MnistDataset

Nice and shiny new Dataset class: `MnistDataset`, which allow to load data from IDX data format, originally published on [http://yann.lecun.com/exdb/mnist](http://yann.lecun.com/exdb/mnist).
> The MNIST database of handwritten digits, available from this page, has a training set of 60,000 examples, and a test set of 10,000 examples. It is a subset of a larger set available from NIST. The digits have been size-normalized and centered in a fixed-size image.
  It is a good database for people who want to try learning techniques and pattern recognition methods on real-world data while spending minimal efforts on preprocessing and formatting.

You can download files and import it in PHP-ML in seconds:

```php
$trainDataset = new MnistDataset(
    '/path/to/train-images-idx3-ubyte', 
    '/path/to/train-labels-idx1-ubyte'
);
```

### SvmDataset

Helper class that loads data from SVM-Light format file.

```php
$dataset = new SvmDataset('3x4.svm');
```

### KMeans supports associative clustering

If you need to keep your identifiers along with yours samples you can use array keys as labels.

```php
$samples = [ 'Label1' => [1, 1], 'Label2' => [8, 7], 'Label3' => [1, 2]];

$kmeans = new KMeans(2);
$kmeans->cluster($samples);
```
`$samples` are now:
```php
[0 => [
    'Label1' => [1, 1],
    'Label3' => [1, 2]
], 1 => [
    'Label2' => [8, 7]
]]
```


## Changes

### Implement "Keep a Changelog" format

All notable changes to this project will be documented in `CHANGELOG.md` file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

### Imputer

`Imputer` class throws exception when trying to transform without train data [https://github.com/php-ai/php-ml/pull/314](#314).

### MLPClassifier

`MLPClassifier` return labels in `getOutput`:

```php
$classifier = new MLPClassifier(2, [2, 2], ['T', 'F']);
echo $classifier->getOutput();
```
returns:
```php
Array(2) {
    ["T"] => double(0.49998073561334)
    ["F"] => double(0.5000098880817)
  }
```
instead of:
```php
Array(2) {
  [0] => double(0.49998073561334)
  [1] => double(0.5000098880817)
}
```

## Fixes

- SVM is now non-locale aware [https://github.com/php-ai/php-ml/pull/288](#288)
- Ensure DataTransformer::testSet samples array is not empty [https://github.com/php-ai/php-ml/pull/204](#204)
- Check if feature exist when predict target in NaiveBayes [https://github.com/php-ai/php-ml/pull/327](#327)

Thanks to all contributors.

---

You can find full list of changes in release notes: [https://github.com/php-ai/php-ml/releases/tag/0.7.0](https://github.com/php-ai/php-ml/releases/tag/0.7.0)
