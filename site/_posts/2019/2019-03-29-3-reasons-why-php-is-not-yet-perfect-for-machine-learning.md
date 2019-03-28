---
id: 9
title: 3 Reasons Why PHP is Not Yet Perfect for Machine Learning
description: "My thoughts on why PHP isn't yet an ideal environment for the universal use of machine learning. I will discuss the three main reasons that are the cause of the current state of affairs."
sources:
    -
        - "https://www.autodeskresearch.com/publications/samestats"
        - "Same Stats, Different Graphs: Generating Datasets with Varied Appearance and Identical Statistics through Simulated Annealing"
    -
        - "https://matplotlib.org/"
        - "matplotlib"
    -
        - "https://www.tensorflow.org/"
        - "TensorFlow"
    -
        - "https://jupyter.org/"
        - "Jupyter Notebook"      
---

Let's get straight to the points.

## 1. No possibility of visualization

> ...make both calculations and graphs. Both sorts of output should be studied; each will contribute to understanding.
 F. J. Anscombe, 1973 

Let's ask yourself a very simple question: What do these graphs have in common?
(these are simple collections of points: `x` and `y`)

![all dinos](/assets/posts/all-dinos-grey.jpg)

The answer is very simple and surprising: a common set of metrics. All this graph have very similar (with accuracy to the second place):

X Mean: `54.26`  
Y Mean: `47.83`  
X SD: `16.76`  
Y SD: `26.93`  
Corr.: `-0.06`  

Surprised? This isn't the end. Say hello to datasaurus:

![Datasaurus](/assets/posts/dino.jpg)

Yes, points from this graph have identical metrics showed above 🤯. 

I hope I convinced you that a fundamental part of the machine learning process is data visualization.

Currently, in PHP we don't have any support like there is in `python` world. I can show you how easy is to plot a graph
to check if your predicted data don't remind a dinosaur.

```python
import pandas as pd
import matplotlib.pyplot as plt

data = pd.read_csv('dino.csv',header=None)
plt.scatter(data[0], data[1], color='red');
```

That's it. 4 line of code. Perfect.

PHP: 0 - Python: 1

## 2. No support for PHP in Jupyter Notebook

[Jupyter Notebook](https://jupyter.org/){rel="nofollow"} is unbeatable for learning machine learning.
You can prepare, inspect, visualize data and train your model using only the browser. 

All thanks to the deadly ability to mix code (`Julia`, `Python` and `R`) , text (`markdown`) and visualization (`img`).

Below is an example of a notebook fragment:
![Crime notebook](/assets/posts/crime-notebook.png)

In the Machine Learning world, you will spend a lot of time analyzing the data. 
You will want to keep notes, experiment and train various types of models. And of course, help yourself with visualization.

I will leave you an interesting example of criminal data analysis: 
[Understanding Crime in Chicago](https://www.kaggle.com/fahd09/eda-of-crime-in-chicago-2005-2016){rel="nofollow"}

I don't need to mention that such a notebook is also ideal for versioning.

PHP: 0 - Python: 2

## 3. No GPU support

Until the moment your dataset does not exceed the gigabytes or you will not use deep learning, you will not need 
to use the GPU. Nevertheless, such a moment can come. Then what?

Take the example of [TensorFlow](https://www.tensorflow.org/){rel="nofollow"}, which in comparison to other environments of neural networks
 is distinguished by the function of distributed computing. It gives you the possibility of full control on the way of 
 separating calculations between the graphics device (GPU) or local processor (CPU). There are many different strategies to choose from.
 
For example, you can decide where to put your variables. Here we put `a` variable on GPU and `b` constant on CPU
```python
with tf.device('/gpu:0'):
    a = tf.Variable(15.12)

with tf.device('/cpu:0'):
    b = tf.constant(3.14)
```

This is only the beginning. You can set up a whole server farm for work. You can also use [TPU](https://cloud.google.com/tpu/){rel="nofollow"} - Tensor Processing Unit.
Dedicated computation unit that can accelerate machine learning to rocket speed 🚀.

In PHP we can find one interesting repo: [dnishiyama85/PHPMatrix](https://github.com/dnishiyama85/PHPMatrix)
> This is a PHP extension which computes float matrix products. It supports
  OpenBLAS sgemm and cuBLAS sgemm function.
  
But in my opinion, the whole GPU topic at this moment crawls like a baby.

I don't know if there is any point in comparing anything here, but let's summarize for peace: 
PHP: 0 - Python: 3

## Conclusions

As you can see I have chosen 3 very important reasons why PHP isn't an ideal choice for learning and using Machine Learning.
It does not mean that it will be like this all the time. 

I remind you that PHP was made to display simple HTML sites. Currently, you can use it to build enterprise-class systems. 
Let's take for example Spotify: 

> The music streaming service relies on Symfony to maintain more than 75 million active users. 
There are almost 600 thousand requests per second, according to the website, and a huge traffic that comes from mobile devices. 

<div style="width: 500px; margin:0 auto;">
<blockquote class="twitter-tweet" data-cards="hidden" data-lang="pl"><p lang="en" dir="ltr"><a href="http://t.co/xHF41AM1vW">http://t.co/xHF41AM1vW</a> is powered by the <a href="https://twitter.com/symfony?ref_src=twsrc%5Etfw">@symfony</a> framework and many great packages from <a href="http://t.co/0kWedwWmS4">http://t.co/0kWedwWmS4</a> using Composer by <a href="https://twitter.com/seldaek?ref_src=twsrc%5Etfw">@seldaek</a></p>&mdash; Spotify Engineering (@SpotifyEng) <a href="https://twitter.com/SpotifyEng/status/595972071609339905?ref_src=twsrc%5Etfw">6 maja 2015</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

Ironically, Spotify has one of the largest server farms dedicated to Machine Learning: 
[How Does Spotify Know You So Well?](https://medium.com/s/story/spotifys-discover-weekly-how-machine-learning-finds-your-new-music-19a41ab76efe){rel="nofollow"}

Perhaps time will show the demand for ML in PHP, but as long as the above-mentioned problems are not resolved, we have nothing to count on.

But don't be sad. I will show you my favorite quote:

> Those who are crazy enough to think they can change the world usually do.

So if you follow me on [Twitter](https://twitter.com/ArkadiuszKondas), you know that changes are coming ... 😨

I do not know if I can achieve anything alone, but perhaps all of this will give birth to an ecosystem that will be able
 to develop itself freely.

Thanks for reading.

P.S.

In the next post, I will wonder why PHP can be quite well suited to the learning and production use of machine learning.
