---
id: 8
title: Text data classification with BBC news article dataset
description: "The goal of this post is to explore some of the basic techniques that allow working with text data in a machine learning world. I will show how to analyze a collection of text documents that belong to different categories."
sources:
    -
        - "http://mlg.ucd.ie/files/publications/greene06icml.pdf"
        - "D. Greene and P. Cunningham. 'Practical Solutions to the Problem of Diagonal Dominance in Kernel Document Clustering', Proc. ICML 2006."
    -
        - "http://mlg.ucd.ie/datasets/bbc.html"
        - "BBC Dataset"
    -
        - "https://github.com/php-ai/php-ml-examples"
        - "php-ml-examples"
    -
        - "https://scikit-learn.org/stable/modules/feature_extraction.html"
        - "Feature extraction"
    -
        - "https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-ngram-tokenizer.html"
        - "NGram Tokenizer"                
---

Let’s start from the question: where to find interesting dataset?
We want some kind of text data.

## BBC Dataset

One of the most popular problem in text data classification is matching news category based on it content or even only on its title.
So, on Science Foundation Ireland website we can find very nice dataset with:

 * 2225 documents from the BBC news website corresponding to stories in five topical areas from 2004-2005.
 * 5 class labels (business, entertainment, politics, sport, tech)

[http://mlg.ucd.ie/datasets/bbc.html](http://mlg.ucd.ie/datasets/bbc.html)

Let's see what's in the archive after downloading (we want raw text files):

```bash
➜ find . -type d -exec sh -c 'echo "{} : $(find "{}" -type f | wc -l)" file\(s\)' \;         
./business : 510 file(s)
./tech : 401 file(s)
./entertainment : 386 file(s)
./politics : 417 file(s)
./sport : 511 file(s)
```

Looks great, each folder represent one category and contains files with news in plaintext:

```bash
➜ cd business && ls | head -n 3
001.txt
002.txt
003.txt
```

```bash
➜ cat 001.txt| head -n 3
Ad sales boost Time Warner profit

Quarterly profits at US media giant TimeWarner jumped 76% to $1.13bn 
(£600m) for the three months to December, from $639m year-earlier.
```

So it happens that loading this data into php will be super simple. Thanks to `FilesDataset` (from [php-ml](https://php-ml.org/)) we must provide only root
directory path:

```php
use Phpml\Dataset\FilesDataset;

$dataset = new FilesDataset('data/bbc');
```

Samples and corresponding labels (targets) are automatically loaded into memory. 

## Train/test split

In order to test the accuracy of the trained model, we need to split our dataset to two separate groups: train and test dataset.
We could take 10% of samples randomly but this approach can lead us to a bad solution. 

For example, all samples of type 
`tech` could be taken to test dataset and our model will never have a chance to see them while training.
This is something we prefer to avoid.

You can fix this by using `StratifiedRandomSplit`. With `StratifiedRandomSplit` distribution of samples takes into 
account their targets and try to divide them equally.
You can adjust number of samples in each group with `$testSize` param (from 0 to 1, default: 0.3).

```php
$split = new StratifiedRandomSplit($dataset, 0.2);
$samples = $split->getTrainSamples();

echo $samples[0]; // Mutant book wins Guardian prize ...
```

## Bags of words

If we want to perform machine learning on text documents, we first need to transform the text into numerical 
feature vectors. One of the easiest way is to use bags of words representation.

One may ask how to build such representation?

First, we must extract all the words from all samples (**build a dictionary**). Then for each word we can assign
an index (integer) and count number of occurrences in a given sample. In this way, we can build a feature vector with words counts.

Consider an example dataset with 3 samples:
```php
$samples = [
    'Lorem ipsum dolor sit amet dolor',
    'Mauris placerat ipsum dolor',
    'Mauris diam eros fringilla diam',
];
```

Lets build vocabulary:

```php
    $vocabulary = [
        0 => 'Lorem',
        1 => 'ipsum',
        2 => 'dolor',
        3 => 'sit',
        4 => 'amet',
        5 => 'Mauris',
        6 => 'placerat',
        7 => 'diam',
        8 => 'eros',
        9 => 'fringilla',
    ];
```

Now for each sample we can count occurrences of each word and save it to array:

```php
$tokensCounts = [
    [0 => 1, 1 => 1, 2 => 2, 3 => 1, 4 => 1, 5 => 0, 6 => 0, 7 => 0, 8 => 0, 9 => 0],
    [0 => 0, 1 => 1, 2 => 1, 3 => 0, 4 => 0, 5 => 1, 6 => 1, 7 => 0, 8 => 0, 9 => 0],
    [0 => 0, 1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 1, 6 => 0, 7 => 2, 8 => 1, 9 => 1],
];
```

Looks like a lot of work 😫, but this is exactly what `TokenCountVectorizer` from [php-ml](https://php-ml.org/) is doing.
We can event choose `Tokenizer` class - tell how to extrac words from text (using spaces or regular expressions).

There is even more, what about words: `am`, `an`, `and` etc.? We can use build in `StopWords` to remove it from dataset.

```php
use Phpml\Tokenization\WordTokenizer;
use Phpml\FeatureExtraction\StopWords\English;
use Phpml\FeatureExtraction\TokenCountVectorizer;

$vectorizer = new TokenCountVectorizer(new WordTokenizer, new English());
$vectorizer->fit($samples);
$vectorizer->transform($samples);
```

So now our `$samples` are ready to train. Lets build quick model using `SVC` algorithm:

```php
use Phpml\Classification\SVC;
use Phpml\Metric\Accuracy;

$classifier = new SVC();
$classifier->train($samples, $split->getTrainLabels());

$testSamples = $split->getTestSamples();
$vectorizer->transform($testSamples);

$predicted = $classifier->predict($testSamples);

echo 'Accuracy: ' . Accuracy::score($split->getTestLabels(), $predicted);
```

Accuracy equals `1` if all predicted samples are correct and `0` if none of them were guessed.

In our case we can see:
```bash
Accuracy: 0.6507
```

Not so bad, but we can do it better.

## From occurrences to frequencies

In a large text corpus, some words will be very present (e.g. `the`, `a`, `is`) hence carrying very little meaningful 
information about the actual contents of the document. If we train a classifier with those data then very frequent terms
 would shadow the frequencies of rarer yet more interesting terms.

In order to re-weight the count features into floating point values suitable for usage by a classifier, it is very common
 to use the tf–idf transform.
 
Of course, not always such transformations give better results. It is always best to test a few variants.

```php
use Phpml\FeatureExtraction\TfIdfTransformer;

$transformer = new TfIdfTransformer();
$transformer->fit($samples);
$transformer->transform($samples);
```

Remember to also transform sample that you want to predict:

```php
$testSamples = $split->getTestSamples();
$vectorizer->transform($testSamples);
$transformer->transform($testSamples);

$predicted = $classifier->predict($testSamples);
``` 

Ok, we cane now check current accuracy of our model:
```bash
Accuracy: 0.7522
```

There is one more interesting technique.

## N-grams to the rescue

Bag of words can't capture phrases and expressions of many words, effectively ignoring dependence on the order of words. 
It also doesn't include potential spelling or derivative errors.

With the rescue we can use `N-grams` concept.

N-grams are like a sliding window that moves across the word - a continuous sequence of characters of the specified length.
Example is worth thousand words:

n-grams with `min=1` and `max=2`:
```php
$text = 'Quick Fox';
$ngrams = ['Q', 'u', 'i', 'c', 'k', 'Qu', 'ui', 
    'ic', 'ck', 'F', 'o', 'x', 'Fo', 'ox'];
```

n-grams with `min=3` and `max=3`:
```php
$text = 'Quick Fox';
$ngrams = ['Qui', 'uic', 'ick', 'Fox', 'oxe', 'xes'];
```

Now lets check how N-grams can help with news data that we want classify:

```php
$vectorizer = new TokenCountVectorizer(new NGramTokenizer(1, 3), new English());
```

Now our script outputs:
```bash
Accuracy: 0.9522
```

This looks like very decent model 🚀. Well done 💪.

You can try to add `Kernel::LINEAR` and lower test dataset to achieve `0.9955`, but I recommend you try it yourself and experiment.

## Bigger picture

Our model requires transformation with two transformers, same as data that we want to predict. We can use one more 
component from `php-ml` to make it cleaner and easier to persists.

In machine learning, it is common to run a sequence of algorithms to process and learn from dataset. For example:

 * Split each document’s text into tokens.
 * Convert each document’s words into a numerical feature vector
 * Learn a prediction model using the feature vectors and labels.
    
`php-ml` represents such a workflow as a `Pipeline`, which consists sequence of transformers and a estimator.

```php
use Phpml\Classification\SVC;
use Phpml\FeatureExtraction\StopWords\English;
use Phpml\FeatureExtraction\TfIdfTransformer;
use Phpml\FeatureExtraction\TokenCountVectorizer;
use Phpml\Metric\Accuracy;
use Phpml\Pipeline;
use Phpml\Tokenization\NGramTokenizer;

$pipeline = new Pipeline([
    new TokenCountVectorizer(new NGramTokenizer(1, 3), new English()),
    new TfIdfTransformer()
], new SVC());
$pipeline->train($split->getTrainSamples(), $split->getTrainLabels());

$predicted = $pipeline->predict($split->getTestSamples());

echo 'Accuracy: ' . Accuracy::score($split->getTestLabels(), $predicted);
```

`Pipline` accepts two parameters:

 * `$transformers` - sequence of objects that implements Transformer interface
 * `$estimator` - Estimator that can train and predict

`Pipeline` have also one more advantage. Can be persisted.

## Save the model

In the end, it's a good idea to save the model so that it will not be re-trained every time.
You can do this with `ModelManager`:

```php
use Phpml\ModelManager;

$modelManager = new ModelManager();
$modelManager->saveToFile($pipeline, 'bbc.phpml');
```

You can check that with `SVC` algorithm you need `~50` seconds (on my laptop) to train the model.

Now you can use this file to restore trained model and predict new sample 🚀

```php
use Phpml\ModelManager;

$modelManager = new ModelManager();
$model = $modelManager->restoreFromFile('bbc.phpml');

$text = 'Some news'; // or load it from request, api, cli, etc.

echo $model->predict([$text]);
```

With prepared model timing is much more better:

```bash
Model loaded in 1.3793s
Predicted category: tech in 1.260704s
```

You can also try `NaiveBayes` classifier, which is much faster and achieves very good results for these data.

Happy n-gram tokenization 😉.
