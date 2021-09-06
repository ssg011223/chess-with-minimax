/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
const ChessBoard = require('chessboardjs');
const { Chess } = require('chess.js');

let board = null;
const game = new Chess();
const whiteSquareGrey = '#a9a9a9';
const blackSquareGrey = '#696969';

const onDragStart = (src, p, pos, ori) => {};

const greySquare = (sqr) => {
  const $sqr = $(`#board .square-${sqr}`);

  let background = whiteSquareGrey;
  if ($sqr.hasClass('black-3c85d')) {
    background = blackSquareGrey;
  }

  $sqr.css('background', background);
};

const onMouseoverSquare = (sqr, p) => {
  const moves = game.moves({
    square: sqr,
    verbose: true,
  });

  if (moves.length === 0) return;

  greySquare(sqr);

  for (let i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};

const removeGreySquares = () => {
  $('#board .square-55d63').css('background', '');
};

const onMouseoutSquare = (sqr, p) => {
  removeGreySquares();
};

const onDrop = (src, target) => {
  removeGreySquares();

  const move = game.move({
    from: src,
    to: target,
    promotion: 'q',
  });

  if (move === null) return 'snapback';
};

const onSnapEnd = () => {
  board.position(game.fen());
};

const boardConfig = {
  position: 'start',
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
  draggable: true,
  onDragStart,
  onMouseoverSquare,
  onMouseoutSquare,
  onDrop,
  onSnapEnd,
};

board = ChessBoard('board', boardConfig);
