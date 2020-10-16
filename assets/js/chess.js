var chessboard = {
    init: function(id, strategy) {
        var board, game;
        game = new Chess();

        var onDragStart = function (source, piece, position, orientation) {
            if (game.in_checkmate() === true || game.in_draw() === true ||
                piece.search(/^b/) !== -1) {
                return false;
            }
        };

        var loadMove = function () {
            $('#' + id + '-loader').show();
            $.ajax({
                type: 'POST',
                url: 'https://fkldch2ljd.execute-api.us-east-1.amazonaws.com/Prod/',
                crossDomain: true,
                dataType: "json",
                data: {
                    "state": game.fen(),
                    "strategy": strategy,
                    "depth": 3
                },
                success: function (data) {
                    $('#' + id + '-loader').hide();
                    if (data.error) {
                        alert(data.error);
                        return;
                    }
                    if (data.move === null) {
                        alert('Game over');
                        return;
                    }

                    game.move(data.move);

                    // chessboard.js have some problems if we do it too fast ...
                    setTimeout(function () {
                        board.position(game.fen());
                    }, 100);

                    renderMoveHistory(game.history());
                    if($('#'+id).parent().find('.movesEvaluated')) {
                        $('#'+id).parent().find('.movesEvaluated').text(data.movesEvaluated);
                    }
                    $('#'+id).parent().find('.time').text(data.time.toFixed(4) + 's');

                    if (game.game_over()) {
                        alert('Game over');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $('#' + id + '-loader').hide();
                    alert(textStatus);
                    game.undo();
                    setTimeout(function () {
                        board.position(game.fen());
                    }, 100);
                }
            });
        };

        var renderMoveHistory = function (moves) {
            var historyElement = $('#'+id).parent().find('.move-history').empty();
            historyElement.empty();
            for (var i = 0; i < moves.length; i = i + 2) {
                historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
            }
            historyElement.scrollTop(historyElement[0].scrollHeight);

        };

        var onDrop = function (source, target) {

            var move = game.move({
                from: source,
                to: target,
                promotion: 'q'
            });

            removeGreySquares();
            if (move === null) {
                return 'snapback';
            }

            renderMoveHistory(game.history());
            loadMove();
        };

        var onMouseoverSquare = function (square, piece) {
            var moves = game.moves({
                square: square,
                verbose: true
            });

            if (moves.length === 0) return;

            greySquare(square);

            for (var i = 0; i < moves.length; i++) {
                greySquare(moves[i].to);
            }
        };

        var onMouseoutSquare = function (square, piece) {
            removeGreySquares();
        };

        var removeGreySquares = function () {
            $('#'+id+' .square-55d63').css('background', '');
        };

        var greySquare = function (square) {
            var squareEl = $('#'+id+' .square-' + square);

            var background = '#a9a9a9';
            if (squareEl.hasClass('black-3c85d') === true) {
                background = '#696969';
            }

            squareEl.css('background', background);
        };

        board = ChessBoard(id, {
            draggable: true,
            position: 'start',
            onDragStart: onDragStart,
            onDrop: onDrop,
            onMouseoutSquare: onMouseoutSquare,
            onMouseoverSquare: onMouseoverSquare,
            pieceTheme: 'http://chessboardjs.com/img/chesspieces/alpha/{piece}.png'
        });
    }
};

$(function() {
    chessboard.init('board-1', 'Grandmaster\\Strategy\\RandomMove');
    chessboard.init('board-2', 'Grandmaster\\Strategy\\PositionEvaluation');
    chessboard.init('board-3', 'Grandmaster\\Strategy\\TreeSearchFullMaterial');
    chessboard.init('board-4', 'Grandmaster\\Strategy\\TreeSearchPruningMaterial');
    chessboard.init('board-5', 'Grandmaster\\Strategy\\TreeSearch');
});
