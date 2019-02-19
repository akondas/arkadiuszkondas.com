---
id: 3
title: Write your own simple chess AI in PHP
description: "A brief history of how to start writing your own chess engine in PHP. You will learn some basic algorithms, prepare a solid foundation allowing for further development and finally I will consider how you can push your AI further."
sources:
    -
        - "https://github.com/akondas/php-grandmaster"
        - PHP Grandmaster source code
    -
        - "https://www.chessprogramming.org/Main_Page"
        - Chess Programming Wiki
    -
        - "https://github.com/akondas/chess.php"
        - Chess.php - PHP chess library
    - 
        - "https://medium.freecodecamp.org/simple-chess-ai-step-by-step-1d55a9266977"
        - A step-by-step guide to building a simple chess AI
---

At the end of this article you will find all the links you are interested in, among them the source code for the entire engine.

## PHP vs Chess ♛

At the outset, let me point out that PHP will be responsible only for calculating the best next move. 
Visualization and the game itself will take place in the browser. Knowing the rules of playing chess is required.

To calculate the correct movements and check if the game was finished, we will use [chess.js](https://github.com/jhlywa/chess.js).
Next, [chessboard.js](https://chessboardjs.com/) will help us with chessboard visualization.

![chessboard](/assets/posts/chessboard.png)

With the help of the two above we can create initial boilerplate, that allow us to test and check our chess AI buddy.
You can find whole template in [index.html](https://github.com/akondas/php-grandmaster/blob/master/public/index.html), 
but I will show you the most important part:

```js
var loadMove = function () {
    $.post('/api.php', {
        "state": game.fen()
    }, function(data) {
        // ...
        game.move(data.move);
        // ...
    }, 'json');
};
```

As you can see, we will be creating one RESTwanabe endpoint, that will return next best move, calculated for given 
state of the game: `game.fen()`. What FEN is, you'll probably ask:
 
> Forsyth–Edwards Notation (FEN) is a standard notation for describing a particular board position of a chess game (source: [wikipedia](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation))

So for each player move we will send current state to PHP backend and we will be waiting (let's hope not too long) for a decision on the best move.

## Round 1: Random move strategy

In first round our task is very simple: return any possible random move. With little help of 
[chess.php](https://github.com/akondas/chess.php) library (which is my improved for performance fork from port of chess.js) we can safely
generate every possible move and return the random one. We want to also create nice and clean code so how to start?

Let's begin with simple contract:

```php
namespace Grandmaster;

interface Strategy
{
    public function nextMove(string $state): ?string;
}
```

Now, let's assume, that chess.php is not only one (and sure not best) chess library solution. 
We would like to not coupled our project with any specific implementation, so we need another contract:

```php
interface Chessboard
{
    public function setState(string $fen): void;
    
    /**
     * @return string[]
     */
    public function moves(): array;
}
```

This will allow us, in the future, to change any implementation to other. In the meantime, let's make a quick 
implementation with chess.php:

```php
namespace Grandmaster\Chessboard;

use Grandmaster\Chessboard;
use Ryanhs\Chess\Chess;

final class ChessphpChessboard implements Chessboard
{
    /**
     * @var Chess
     */
    private $chess;

    public function __construct()
    {
        $this->chess = new Chess();
    }
    
    public function setState(string $fen): void
    {
        if ($this->chess->load($fen) === false) {
            throw new InvalidFenException(sprintf('Given "%s" FEN is invalid', $fen));
        }
    }
    
    /**
     * @return string[]
     */
    public function moves(): array
    {
        return $this->chess->moves();
    }
}
```

So far so good. Now, as you probably guessed, implementation of our first strategy will be very easy:

```php
namespace Grandmaster\Strategy;

use Grandmaster\Chessboard;
use Grandmaster\Strategy;

final class RandomMove implements Strategy
{
    /**
     * @var Chessboard
     */
    private $board;

    public function __construct(Chessboard $board)
    {
        $this->board = $board;
    }

    public function nextMove(string $state): ?string
    {
        $this->board->setState($state);
        $moves = $this->board->moves();

        if (count($moves) === 0) {
            return null;
        }

        return $moves[array_rand($moves)];
    }
}
```

Live example: *Chess AI with `RandomMove` strategy*

<div class="board-wrapper">
    <div id="board-1" class="board"></div>
    <div id="board-1-loader" class="loader"><span>Invoking lambda ...</span></div>
    Time*: <span class="time"></span><br />
    <small>*php time on AWS Lambda, http request latency not included</small>
    <br /><br />
    Move history:<br />
    <div class="move-history"></div>
</div>


## Round 2: Position evaluation

Ok, since you can play chess with a new artificial friend, let's add some more power to it. 
We can assign a relative point value to each piece, based on human experience and learning ([Point Value](https://www.chessprogramming.org/Point_Value)).

```php
namespace Grandmaster\Pieces;

interface PointValue
{
    public const PAWN = 100;
    public const KNIGHT = 350;
    public const BISHOP = 350;
    public const ROOK = 525;
    public const QUEEN = 1000;
    public const KING = 10000;
}
```

We will need another contract `Evaluator`. It will be able to return the current value of the board, which will 
allow us to choose the best possible move. A positive value means a white advantage, a negative black one.

```php
namespace Grandmaster;

interface Evaluator
{
    public function evaluate(Chessboard $board): int;
}
```

Based on the above, we can implement `MaterialEvaluator`:

```php
namespace Grandmaster\Evaluator;

final class MaterialEvaluator implements Evaluator
{
    public function evaluate(Chessboard $board): int
    {
        // array_reduce is cleaner, but performance is the key here
        $sum = 0;
        foreach ($board->board() as $piece) {
            $sum += $this->getPieceValue($piece);
        }

        return $sum;
    }

    private function getPieceValue(?array $piece): int
    {
        if ($piece === null) {
            return 0;
        }
        $color = $piece['color'] === 'w' ? 1 : -1;

        switch ($piece['type']) {
            case 'p':
                return PointValue::PAWN * $color;
            case 'r':
                return PointValue::ROOK * $color;
            case 'n':
                return PointValue::KNIGHT * $color;
            case 'b':
                return PointValue::BISHOP * $color;
            case 'q':
                return PointValue::QUEEN * $color;
            case 'k':
                return PointValue::KING * $color;
            default:
                return 0;
        }
    }
 
}
```

As you can see, we sum up the value of all the pieces on the board (for black ones they will be negative values).
Now we are ready to implement `PositionEvaluation` strategy:

```php
    public function nextMove(string $state): ?string
    {
        $this->board->setState($state);
        $moves = $this->board->moves();
        $whiteTurn = $this->board->isWhiteTurn();
        $bestValue = $whiteTurn ? PHP_INT_MAX : PHP_INT_MIN;
        $bestMove = null;

        if (count($moves) === 0) {
            return null;
        }

        foreach ($moves as $san) {
            $this->board->move($san);
            $newValue = $this->evaluator->evaluate($this->board) * ($whiteTurn ? 1 : -1);
            if ($whiteTurn ? $newValue < $bestValue : $newValue > $bestValue) {
                $bestMove = $san;
                $bestValue = $newValue;
            }
            $this->board->undo();
        }

        return $bestMove;
    }
```

So in current moment our friend will kill the piece if he can do it. Not too much, but it starts to spin, be vigilant 😉.

Live example: *Chess AI with `PositionEvaluation` strategy*

<div class="board-wrapper">
    <div id="board-2" class="board"></div>
    <div id="board-2-loader" class="loader"><span>Invoking lambda ...</span></div>
    Time*: <span class="time"></span><br />
    <small>*php time on AWS Lambda, http request latency not included</small>
    <br /><br />
    Move history:<br />
    <div class="move-history"></div>
</div>


## Round 3: Search the tree

Now we will do a classic brute force attack. We will make every move possible and evaluate
 value of the board for everyone. Then we can generate another move (deeper level) and recalculate the value again. 
Such an algorithm is called `Minimax`. 

At the very end, we return the highest or lowest value, depending on whether the movement was white or black. 
From this also the name (`Minimax`) itself, we want to either maximize or minimize the result.

The strength of this algorithm depends on the depth of the search. At this point, only the performance of our
 machine and the libraries used limits us.
 
Let's add another contract:

```php
namespace Grandmaster;

interface Search
{
    public function bestMove(Chessboard $board): ?string;
}
```

The implementation will be a little bigger, but we can show her heart (full code [MinimaxFullSearch](https://github.com/akondas/php-grandmaster/blob/master/src/Search/MinimaxFullSearch.php)):

```php
    private function minimax(int $depth, Chessboard $board): int
    {
        if ($depth === 0) {
            return -$this->evaluator->evaluate($board);
        }

        if ($board->isWhiteTurn()) {
            $bestValue = 99999;
            foreach ($board->moves() as $san) {
                $board->move($san);
                $bestValue = min($bestValue, $this->minimax($depth - 1, $board));
                $board->undo();
            }
        } else {
            $bestValue = -99999;
            foreach ($board->moves() as $san) {
                $board->move($san);
                $bestValue = max($bestValue, $this->minimax($depth - 1, $board));
                $board->undo();
            }
        }

        return $bestValue;
    }
```
 
Let's see how it looks in practice for depth: 3. I also added the number of evaluated moves.

Live example: *Chess AI with `TreeSearch` strategy (brute force)*

<div class="board-wrapper">
    <div id="board-3" class="board"></div>
    <div id="board-3-loader" class="loader"><span>Invoking lambda ...</span></div>
    Time*: <span class="time"></span><br />
    Moves evaluated: <span class="movesEvaluated"></span><br />
    <small>*php time on AWS Lambda, http request latency not included</small>
    <br /><br />
    Move history:<br />
    <div class="move-history"></div>
</div>

Our friend starts to understand some basic patterns. 
But the algorithm itself unnecessarily analyzes all the possibilities that eats resources. We will try to improve.

## Round 4: Cutting off leaves

A tricky trick is coming: `Alpha–beta pruning` - a search algorithm that reduces the number of nodes that must be
 solved in the search trees.

Now during the search of the tree we will get rid of the paths, which we know would give a worse result than currently 
the best. This will save you the analysis of deeper paths and save resources. In the end, why analyze the next move, 
knowing that the previous one was hopeless.
 
![alpha_beta_pruning](/assets/posts/ab_pruning.jpg)

This will require a minor correction in the code:

```php
    private function minimax(int $depth, int $alpha, int $beta, Chessboard $board): int
    {
        if ($depth === 0) {
            return -$this->evaluator->evaluate($board);
        }

        if ($board->isWhiteTurn()) {
            $bestValue = 99999;
            foreach ($board->moves() as $san) {
                $board->move($san);
                $bestValue = min($bestValue, $this->minimax($depth - 1, $alpha, $beta, $board));
                $board->undo();
                $beta = min($beta, $bestValue);
                if ($beta <= $alpha) {
                    return $bestValue;
                }
            }
        } else {
            $bestValue = -99999;
            foreach ($board->moves() as $san) {
                $board->move($san);
                $bestValue = max($bestValue, $this->minimax($depth - 1, $alpha, $beta, $board));
                $board->undo();
                $alpha = max($alpha, $bestValue);
                if ($beta <= $alpha) {
                    return $bestValue;
                }
            }
        }
        
        return $bestValue;
    }
```

Note now how much less evaluated are the moves for the same move.

Live example: *Chess AI with `TreeSearch` strategy with alpha-beta pruning*

<div class="board-wrapper">
    <div id="board-4" class="board"></div>
    <div id="board-4-loader" class="loader"><span>Invoking lambda ...</span></div>
    Time*: <span class="time"></span><br />
    Moves evaluated: <span class="movesEvaluated"></span><br />
    <small>*php time on AWS Lambda, http request latency not included</small>
    <br /><br />
    Move history:<br />
    <div class="move-history"></div>
</div>

## Round 5: Position matters 

In chess, not only the piece has meanings but also the position it occupies.
For example, a pawn moved forward two spaces is worth more than in its initial position.
For simplicity, we will use a ready-made  and battle tested "Piece-Square Tables" 
from Chessprogramming wiki - [Simplified Evaluation Function](https://www.chessprogramming.org/Simplified_Evaluation_Function).

We will need the value of all figures and colors:

```php

namespace Grandmaster\Pieces;

interface PositionValue
{
    public const PAWN_WHITE = [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5,  5, 10, 25, 25, 10,  5,  5],
        [0,  0,  0, 20, 20,  0,  0,  0],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [5, 10, 10,-20,-20, 10, 10,  5],
        [0,  0,  0,  0,  0,  0,  0,  0]
    ];
    
    // ...
    
    public const KING_BLACK = [
        [20, 30, 10,  0,  0, 10, 30, 20],
        [20, 20,  0,  0,  0,  0, 20, 20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
    ];
}
```

This will allow us to implement new `PositionEvaluator` which thanks to the interface `Evaluator` can be easily and quickly exchanged.

Wait ✋. Not so fast. We also want to take into account the value of the piece itself (from `MaterialEvaluator`). 
It's time to add one more `Evaluator`:

```php
namespace Grandmaster\Evaluator;

use Grandmaster\Chessboard;
use Grandmaster\Evaluator;

final class CombinedEvaluator implements Evaluator
{
    /**
     * @var Evaluator[]
     */
    private $evaluators;

    public function __construct(array $evaluators)
    {
        $this->evaluators = array_map(function (Evaluator $evaluator): Evaluator {
            return $evaluator;
        }, $evaluators);
    }

    public function evaluate(Chessboard $board): int
    {
        $sum = 0;
        foreach ($this->evaluators as $evaluator) {
            $sum += $evaluator->evaluate($board);
        }

        return $sum;
    }
}
```

Such an implementation will allow for further development and preservation of the "[Open–closed principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)".
This should also significantly improve the abilities of our artificial bro. Let's find out.

Live example: *Chess AI with `CombinedEvaluator` and `TreeSearch` strategy*

<div class="board-wrapper">
    <div id="board-5" class="board"></div>
    <div id="board-5-loader" class="loader"><span>Invoking lambda ...</span></div>
    Time*: <span class="time"></span><br />
    Moves evaluated: <span class="movesEvaluated"></span><br />
    <small>*php time on AWS Lambda, http request latency not included</small>
    <br /><br />
    Move history:<br />
    <div class="move-history"></div>
</div>


## Future rounds

In fact, this is only the beginning of the road, but at this stage our AI can think and do not forgive mistakes. 
At least for the occasional player (like me). However, it is bad at the endings. 

The code is also suitable for further development and should be easy to 
maintain thanks to the good isolation of interfaces.

In the next rounds you can:

 * learn to recognize the end game (f.e. both sides have no queens)
 * change position values for king in the end game
 * evaluate known patterns
 * tuning performance to allow deeper search within a reasonable time

At the end, go to [Chess Programming Wiki](https://www.chessprogramming.org/Main_Page) where you will find more knowledge.  

In subsequent posts we will try deploy our little chess engine to mythical serverless solution: AWS Lambda. 
 
That's it!



<script src="https://chessboardjs.com/js/chessboard.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.2/chess.js"></script>
<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
<script src="/assets/js/chess.js"></script>
<link rel="stylesheet" href="/assets/css/chess.css?v=2" />
