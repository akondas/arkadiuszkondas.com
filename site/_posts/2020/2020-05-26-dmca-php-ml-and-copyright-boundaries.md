---
id: 16
title: "DMCA, php-ml and copyright boundaries"
description: "Last friday, DMCA took down my GitHub repository. This post will explain the who, the what and how we came to this situation."
sources:
    -
        - "https://github.com/contact/dmca"
        - "Copyright claims (DMCA)"
    -
        - "https://en.wikipedia.org/wiki/Decision_tree_learning"
        - "Decision tree learning"
---

## TL;DR

I’m the creator of the php-ml package, an OpenSource PHP machine learning library created in early 2016.
Last friday, DMCA took down my Github repository.
This post will explain the who, the what and how we came to this situation.
This posting is sticking to the facts, feel free to reach out or react in the comments if you think that something’s wrong.

## DMCA

Until last Friday I had no idea about something like the DMCA and how it can be used.

> The Digital Millennium Copyright Act (DMCA) creates a standardized process for copyright holders (including software developers) to ask 
  GitHub to take down infringing content.

In this way, Github gives you the opportunity to apply for your property rights. From the user's point of view, this gives two possibilities:

- Submit a DMCA takedown notice
- Submit a DMCA counter notice

So far it seems I have understood it. If someone publishes something without my consent, I have the right to request its removal.
Unfortunately, (according to my experience) processing times and responses to these requests can be different. 
We will come back to the process later in the conclusion.

## History of php-ml

Php-ml was created in February 2016. Initially, I worked on it in the form of a competition organized by [@maniserowicz](https://twitter.com/maniserowicz). Actually, I didn't plan to continue it, it was just a competition project and that's it. However, while doing it I realized that I was doing something unique in the PHP world. I loved it, it gave me a lot of fun so I decided to continue.

5 Months later on the 7th of July, came out the first release ([v0.0.1](https://packagist.org/packages/php-ai/php-ml#v0.1.0)), licensed under the MIT license. It was my first Open Source project released as a complete package. It was a unique experience thanks to which I learned a lot not about the code itself but about the entire ecosystem.
At this point, I thank all contributors from whom I learned a lot.

People started to adopt php-ml and overtime new problems, new users and hopefully new solutions began to arise.

Everything began to take up more and more time, so I had to give up some of the work.
As I was doing this in my free time, I couldn’t cope with all the issues and support requests.
I have a family (wife and 4 children) and I had to work on a paid project. It was very hard for me to focus on those paid projects knowing that php-ml was having its momentum and I couldn’t really take care of it like it should. Only those who run such projects can understand how hard such dilemmas are. What impact this may have on further developments.

In the meantime time flies…

In February 2018, **2 years after the creation of php-ml**, another PHP library appeared. Written by Andrew DalPino "RubixML" seems to receive a lot of attention from its creator. Andrew seems to be spending a lot of time on it, which is, it must be said, very good for the PHP and OpenSource world.

I was glad to see that such a library was coming out, there is always more in two brains than in one! I immediately reached out to Andrew on LinkedIn to propose some kind of cooperation on one common project but he declined.

As I want to be as transparent as possible, I will copy-paste here some screenshots.

![chat screenshot](/assets/posts/phpml/chat-1.png)

I got a response and Andrew suggested getting to know each other better, which is totally fine, but did not want to collaborate (on one project), which is also totally fine, we are free to do whatever we want in this OpenSource world, that’s the essence of it, that’s also the beauty of it, in some way.

![chat screenshot](/assets/posts/phpml/chat-2.png)

From that time and until now, I continued the development of php-ml and so Andrew did on his own library.

During that time and despite the sentence “rivals is not what I’d like to be”, there were some frictions between him and me.

Unfortunately, I cannot link here all the issues where there were some frictions because the repositories are down, but I managed to find one example on RubixML:
[https://github.com/RubixML/RubixML/pull/23](https://github.com/RubixML/RubixML/pull/23)

This very simple example also proves that I had no hard feeling. I submitted PR on his project, hoping that maybe this would smoothen the relations, but it was worse. Once again, I’m a developer, a scientist and I’m here for the code, not for the rest.

Another relevant example in RubixML release [0.0.1](https://github.com/RubixML/RubixML/releases/tag/0.0.1-alpha):
You can see identical fragments to my code, no fuss was made about it. 
As I said earlier, note that there is no license or attribution file in RubixML v.0.0.1.

[![RubmixML vs php-ml](/assets/posts/phpml/rubixml-phpml-0.png)](/assets/posts/phpml/rubixml-phpml-0.png)

[![RubmixML vs php-ml](/assets/posts/phpml/rubixml-phpml-1.png)](/assets/posts/phpml/rubixml-phpml-0.png)

On Friday, Github took down the main repository of my library.

## RubixML and php-ml conflict

In May 2019, I implemented a regression algorithm that allows estimating data in a continuous form, in a class called the DecisionTreeRegressor. 
For clarity: [decision tree learning](https://en.wikipedia.org/wiki/Decision_tree_learning) is a technique known since the eighties. **At least a dozen of different implementations, in different languages can be found on the Internet**.

The code was very similar to the RubixML’s implementation. Andrew felt cheated, then a quarrel ensued. We decided to fix the issue by crediting Andrew in the license file.

Andrew is a talented developer and to be completely honest, it happened to me to have a look at how he implemented some stuff. I did not copy its code directly, but I created my own implementations by being inspired by its code and solution. So naturally it came out that some parts of both libraries were similar. Just like its first release, which coincided with my solution.

To take a real life example, let’s say that you publish a library that computes Fibonacci numbers. There are many implementations out there. There’s a lot of chance that your implementation is basically the same as something existing. Does that mean that you have cheated?

Another example.

When I write a loop in PHP, I do use most of the time foreach(), does that mean that I also cheated on other people ?

**Where are the boundaries?** Anyway, let’s move on.

In May 2020, I released version 0.9.0 and Andrew was not credited in the license code.
I should have at least written something in the README file saying that I was inspired by some internal parts of his library but I didn’t. 
Andrew noticed it and opened an issue in which he complained about the current state of affairs.

At this point I made a mistake. I was upset about the current situation and did not want to get into the discussion. I decided to answer with a counterargument and take no further actions. I most probably didn't realize the seriousness of the situation.

On the other hand, Andrew did not refer to my former argument that initially his library contained my code. Yes, exactly the same reason why php-ml was taken down lately.

> Do as I say, not as I do

So basically, I am accused of doing something that was initially started by him.

As I didn’t want to spend time on this, I recognized the end of the discussion and dealt with other matters. That was also another mistake that I made.

## DMCA takedown

On Thursday (2020-05-21 23:30 UTC+2) I got a message to my email:

[![DMCA notice](/assets/posts/phpml/dmca-1.png)](/assets/posts/phpml/dmca-1.png)

> It is important that you reply to this message within 1 business day to tell us whether you've made changes. If you do not, the repository will be disabled

As you can see, after receiving such a notification (which anyone can send), the owner has one day to comply. Hence: delete the files. As a reminder, I received this message on Thursday night, practically just before the weekend. 

Deleting those necessary files would definitely break php-ml. This is not just about deleting files in one PR. You must delete the entire history of disputed files and push with force all branches and tags back.

Originally, Andrew asked me to be credited in the license and for some reason, I didn't manage to do it in the given time. Another mistake that I made.

I replied to the email, and the sole reply that I got was the takedown of the repository.

[![DMCA takedown](/assets/posts/phpml/dmca-2.png)](/assets/posts/phpml/dmca-2.png)

By the way [@github](https://twitter.com/github): Not even a day has passed, the repo was blocked after 23 hours and the link indicated in this email is not yet available.

## Timeline summary

*2016-02-08* - First php-ml repo commit (26b1481)  
*2016-07-07* - First official php-ml release ([0.1.0](https://packagist.org/packages/php-ai/php-ml#v0.1.0))  
*2018-02-14* - First RubmixML repo commit (fcc3c4f0)  
*2018-04-23* - First RubixML release ([0.0.1-alpha](https://packagist.org/packages/rubix/ml#0.0.1-alpha)) without any attribution or whatsoever  
*2018-12-10* - My first talk with Andrew (RubixML owner) about joining forces  
*2019-05-12* - DecisionTreeRegressor class implementation  
*2019-05-14* - Added Andrew to license  
*2020-05-15* - Removed Andrew from license  
*2020-05-21* - GitHub sends DMCA Takedown Notice (23:30 UTC+2)  
*2020-05-22* - My response sent to GitHub (06:20 UTC+2)  
*2020-05-22* - GitHub disables php-ml repo (23:01 UTC+2)  
*2020-05-25* - php-ai organization removed  

## Conclusions

As a result of all the confusion, I decided to remove all the php-ai organisation’s repositories until further notice. I don't know if it was a wise decision, but I would like to get this situation sorted out completely before anything else.

I have the feeling of being badly judged, attacked and injured. I’m an Open Source developer, I do that because I’m a passionate guy and to be honest I never paid too much attention to licensing and stuff. I love science, I love PHP and I wish to do better things each time I code.

I also take the opportunity to apologize to everyone using PHP-ML, but in order to calm down the burden, I prefer things to be like that. I hope you will understand me and you won’t let me down. You can be sure that I never had such intentions initially.

In my opinion, the DMCA process involving github is very underdeveloped. First of all, processing times are a mystery to me. Secondly, the request mentioned adding a license rather than deleting files. Thirdly, there is no real defense, only one choice: you remove or we remove you. Fourthly, deleting requires the entire history to be erased will almost always involve recalculating the commit hashes.

At the moment I am still considering restoring the code, but without this contentious part. However, does its re-implementation (by anyone) activate this dispute again? Where is the boundary of copyright? Why can there be fragments in RubixML still almost identical to my own original code?

Alternatively and in the meantime, you can use some kind of packagist proxy (there are several solutions available on the market). In this way, the disappearing package will not cause a failure in CI.

You may not agree with my reaction. You don't know me personally, you don't know how I was at the moment of events. Just remember when assessing these facts.

Finally, I would like to thank my friends for their support. You helped me reconsider this situation.
