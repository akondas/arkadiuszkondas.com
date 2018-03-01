---
layout: post
title: Design Patterns - Strategy
description: "One of the main assumptions of good project programming is the 'Open/closed' principle, which says that classes should be closed for modification, but open to extension. The strategy pattern allows you to easily maintain this standard in your code."
sources:
	-
		- "https://en.wikipedia.org/wiki/Open/closed_principle"
		- Open / closed principle
	-
		- "https://sourcemaking.com/design_patterns/strategy"
		- Strategy Design Pattern
---
## Problem

For years, there has been a tendency in the development community to **maximize cohesion and minimize coupling**. The strategy very well solves the problem of reducing connections. This pattern allows to achieve this by defining interfaces and using them in base classes (let's call such classes **clients**). Next, the implementation details are hidden in the derived classes implementing the defined interface. Thanks to this, clients can freely relate to abstraction.

In other words, we solve this problem by **programming to the interface instead of implementation**. Because clients are attached to abstraction, not a specific implementation, they are freely open to expansion (by adding a new class implementing the defined interface).

## Pattern goals

 * Defining the family of algorithms, encapsulating each of them, and making them spare. The strategy allows you to change the algorithm regardless of the clients who use it.
 * Capture abstraction in the interface, bury implementation details in derived classes.

## Structure

In the strategy, we define a common interface, for supported algorithms, having allowed methods. In the next step, we implement individual strategies in individual classes. Next, we build the client's class, which will allow to determine the strategy (for example by injecting it) and will have a reference to the currently selected strategy. The client works with the chosen strategy in order to perform a specific task.

## Example of implementation

An abstract problem: transport of guests to the airport. Transport can be done in several ways: by bus, car or taxi. An example of implementation in PHP:

```php
class User {}
class TransportResult {}

interface TransportStrategy
{
    public function transport(User $user): TransportResult;
}

class CityBusTransport implements TransportStrategy
{
    public function transport(User $user): TransportResult
    {
        // TODO: Implement transport() method.
        return new TransportResult();
    }
}

class PersonalCarTransport implements TransportStrategy
{
    public function transport(User $user): TransportResult
    {
        // TODO: Implement transport() method.
        return new TransportResult();
    }
}

class TaxiTransport implements TransportStrategy
{
    public function transport(User $user): TransportResult
    {
        // TODO: Implement transport() method.
        return new TransportResult();
    }
}

class TransportationToAirport
{
    /**
     * @var TransportStrategy
     */
    private $strategy;

    public function __construct(TransportStrategy $strategy)
    {
        $this->strategy = $strategy;
    }

    public function run(User $user): TransportResult
    {
        return $this->strategy->transport($user);
    }

}

$user = new User();
$transportation = new TransportationToAirport(new CityBusTransport());
$transportation->run($user);
```

Using the `TransportStrategy` interface, we can extend the domain with further implementations. However, the mere separation of individual behaviors to separate classes makes the whole thing easy to test:

```php
use PHPUnit\Framework\TestCase;

class StrategyTest extends TestCase
{
    public function testCityBusTransportationStrategy()
    {
        $user = new User();
        $transportation = new TransportationToAirport(new CityBusTransport());

        $result = $transportation->run($user);

        $this->assertInstanceOf(TransportResult::class, $result);
    }
}
```

## When to use

 * when there is a need to solve a given problem in a few different ways
 * when the system must be open for expansion
 * when you want to increase the readability of your code
 * when you want to express your intentions clearly and explicitly
 
## Real live example

At the end, I present a more real example of the use of a strategy pattern. The real problem: generating the value of the entity identifier in the database. The example is inspired by the `Doctrine` library. Suppose we have a class that saves entities in the database and needs a corresponding ID for each.

```php
class EntityPersister
{
    /**
     * @var IdGenerator
     */
    private $idGenerator;

    public function __construct(IdGenerator $idGenerator)
    {
        $this->idGenerator = $idGenerator;
    }

    public function executeInserts()
    {
        /* ... */
        $generatedId = $this->idGenerator->generate($this->em, $entity);
        /* ... */
    }

}
```

This ID can be generated in a few different ways, so creating an interface seems like a natural solution:

```php
interface IdGenerator
{
    public function generate(EntityManager $em, $entity);
}
```

Finally, the creation of specific implementations remains. For example, an ID creation strategy based on a global unique identifier (UUID).

```php
class UuidGenerator implements IdGenerator
{
    public function generate(EntityManager $em, $entity)
    {
        // generate UUID
    }
}
```

The next method can be generation based on a specific sequence controlled by the domain conditions:

```php
class SequenceGenerator implements IdGenerator
{
    public function generate(EntityManager $em, $entity)
    {
        // generate next sequence value
    }
}
```

Yet another time (as it turns out most often) we generate ID in the database itself (through the auto-increment mechanism):

```php
class IdentityGenerator implements IdGenerator
{
    public function generate(EntityManager $em, $entity)
    {
        // get value from auto-increment column
    }
}
```

Of course, in this way, we can extend our system and add a new implementation at any time. We can also use different implementations in different parts of the system.

You can find the source code for the examples at: [https://github.com/akondas/php-design-patterns](https://github.com/akondas/php-design-patterns)
