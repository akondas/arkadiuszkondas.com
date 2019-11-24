---
id: 15
title: "What is software architecture?"
description: "Why is the word architect in our industry not always associated well? Should an architect participate in programming? What is software architecture really like? Is it possible to describe architecture in one sentence?"
sources:
    -
        - "https://www.youtube.com/watch?v=DngAZyWMGR0"
        - "Making Architecture Matter - Martin Fowler Keynote"
    -
        - "http://files.catwell.info/misc/mirror/2003-martin-fowler-who-needs-an-architect.pdf"
        - "Who Needs an Architect?"
    -
        - "https://www.bookdepository.com/Mythical-Man-Month-Frederick-P-Brooks-Jr/9780201835953"
        - "The Mythical Man-Month : Essays on Software Engineering, Anniversary Edition"
    -
        - "https://c4model.com/"
        - "The C4 model for visualising software architecture"
    -
        - "https://pragprog.com/book/mkdsa/design-it"
        - "Design It! From Programmer to Software Architect"
    -
        - "https://martinfowler.com/architecture/"
        - "Software Architecture Guide"
---

> You don't understand something until you understand it more then one way (Marvin Minsky)

When asked what software architecture is, we will get dozens of different definitions.  Each of them is
different, but if we delve into it, we will see a certain regularity. We are able to divide these definitions into three different categories.

 1. Architecture as a set of decisions.
 2. Architecture as a description of the system structure.
 3. Architecture as a design process.
 
A look at the architecture from all three perspectives shows us the full picture.

I will try to discuss each of them and then present one common and universal definition of software architecture.

## Architecture as a set of decisions

In Martin Fowler's entry "[Who Needs an Architect?](http://files.catwell.info/misc/mirror/2003-martin-fowler-who-needs-an-architect.pdf)" we can read:

> There is another style of definition of architecture which is something like "architecture is the set of design decisions that
  must be made early in a project." I complain about that one, too, saying that architecture is the decisions that you wish
  you could get right early in a project, but that you are not necessarily more likely to get them right than any other.

Sounds pretty sensible. Because what does an architect do? An architect decides whether or not to we're gonna use this 
technology or this pattern. Or will we solve this problem in one way or another. 

Indeed, we can treat architecture as a set of decisions. In banks or corporations we have several types of architects.
Enterprise architect, solution architect or application architect. Maybe you once wondered how they differ from each other.

In the perspective of this definition, they differ in the scope of the decisions they take.

For this reason, architecture can be considered at different levels. Each of these levels has its own patterns and good practices. 
And on each level a different field of knowledge can be useful.

Ultimately, the role of the architect is to make sure that **all important decisions can be made as late as possible**. 
As time goes by, we gain more and more data to help us choose the right decisions.

We do not want to make difficult decisions in the early stages of the system development. 
There may be a constraint that we do not yet know about.

## Architecture as a description of the system structure

Decisions have an impact on our system, i.e. they shape its structure.
We can say that architecture is a collection of elements, relations between them and their properties.

Comparing this concept with the building industry (which is not always accurate) architecture is site plans, floor plans, 
elevation views, cross-section views and detail drawings. 

As programmers, we often focus on the lowest level of our system. However, the architecture must go beyond this level. 
A running application also includes testing, deployment, monitoring, scaling and maintenance. 
A good description of the structure should also include these elements.

Ironically, the presentation of the software system structure in each team looks different. 
There is no coherent communication platform. Theoretically, we have UML, but in reality, who really uses it?

Fortunately, there is a very good and simple technique to create a consistent platform for data exchange.

The [C4 model](https://c4model.com/) by Simon Brown.

![C4 overview](/assets/posts/c4-overview.png)

Martin Fowler also writes that architecture is **the shared understanding that the expert developers have of the system design**.

Visualization and maintenance of this visualization in the form of a **coherent diagram** will help to keep the common 
understanding of the concept of the system in good shape.

## Architecture as a design process

Since we have said before that architecture is a set of decisions, architecture as a process is a decision-making process.
This is very well illustrated by the [OODA model](https://pl.wikipedia.org/wiki/OODA). 
This model distinguishes 4 basic areas of information processing.

![OODA Circle](/assets/posts/ooda.svg)

 - **Observation** consists in collecting data on various aspects of the environment in which we operate. 
   The technique called **Event Storming** works very well here, which I will definitely write more about.
 - **Orientation** is an application of our experience, patterns that we know, techniques, tools to make the right 
   decision on the basis of information that comes to us from the environment.
 - **Decision** we discussed it at the beginning, it is nothing more than choosing one of the possible options for action.
 - **Action** is implementation of the decision made. Starting the action, we test the decision to provide further data 
   for observation (in this way we close the cycle).

Information processing processes in all four areas are mostly parallel. 
The essence of OODA is the synchronization between observation and orientation; between orientation, 
decision and action; and finally, the monitoring of the impact of actions taken through observations.

The key is that an architect is a person who makes informed decisions. He or she is able to justify his or her decisions. 
Understands the environment in which he or she makes these decisions. 
Applies tools and **observes the effect of those decisions** in the system.

Always make sure you have the right feedback from your decisions and that you can measure it effectively.

## Consistency of the concept

It is worth mentioning here the words of Brooks from the book "The mythical man-month". 
He says that the most important factor influencing the quality is the **consistency of the concept**. 

A clean and elegant application (or system) must present each user with a coherent mental model. 
In this way, the user receives a well-designed interface allowing for the implementation of specific operations.
Otherwise, why design systems at all?

I will try to close the whole post in one sentence (collecting all three points in one).

**Software architecture is a coherent concept, for which the architect is responsible by making appropriate decisions in 
the process of designing the system, which affects its entire structure.**

Do you have any other thoughts about this?
Let me know in the comments or on the Tweeter.
