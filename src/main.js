/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
const ChessBoard = require('chessboardjs');
const { Chess } = require('chess.js');

let board = null;
const game = new Chess();
const whiteSquareGrey = '#a9a9a9';
const blackSquareGrey = '#696969';
let counter = 0;

// AI
const evalPos = (i, j, b) => {
  const p = b[i][j];

  if (p === null) return 0;

  let pieceValue = 0;

  switch (p.type) {
    case 'p':
      pieceValue = 100;
      break;
    case 'r':
      pieceValue = 500;
      break;
    case 'n':
      pieceValue = 320;
      break;
    case 'b':
      pieceValue = 330;
      break;
    case 'q':
      pieceValue = 900;
      break;
    case 'k':
      pieceValue = 20000;
      break;
    default:
      throw `Unknown piece type: ${p.type}`;
  }

  return p.color === 'w' ? pieceValue : -pieceValue;
};

const evalBoard = (b) => {
  let score = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      score += evalPos(i, j, b);
    }
  }
  return score;
};

const minimax = (depth, gameToPass, alpha, beta, isMaximizingPlayer) => {
  counter++;
  if (depth === 0) {
    return evalBoard(gameToPass.board());
  }

  const possibleMoves = gameToPass.moves();

  if (isMaximizingPlayer) {
    let score = -Infinity;
    for (let i = 0; i < possibleMoves.length; i++) {
      gameToPass.move(possibleMoves[i]);
      score = Math.max(
        score,
        minimax(depth - 1, gameToPass, alpha, beta, false)
      );
      gameToPass.undo();
      alpha = Math.max(score, alpha);
      if (beta <= score) return score;
    }
    return score;
  } else {
    let score = Infinity;
    for (let i = 0; i < possibleMoves.length; i++) {
      gameToPass.move(possibleMoves[i]);
      score = Math.min(
        score,
        minimax(depth - 1, gameToPass, alpha, beta, true)
      );
      gameToPass.undo();
      beta = Math.min(score, beta);
      if (alpha >= score) return score;
    }
    return score;
  }
};

const getBestMove = (depth) => {
  const tempGame = Chess(game.fen());

  let bestScore = Infinity;
  let bestMove = null;
  const possibleMoves = tempGame.moves();

  for (let i = 0; i < possibleMoves.length; i++) {
    const move = tempGame.move(possibleMoves[i]);
    const score = minimax(depth - 1, tempGame, true);
    tempGame.undo();
    if (score < bestScore) {
      bestScore = score;
      bestMove = {
        from: move.from,
        to: move.to,
      };
    }
  }

  return bestMove;
};

const makeBestMove = (depth) => {
  const bestMove = getBestMove(depth);
  game.move(bestMove);
  console.log(counter);
  counter = 0;
};

// Base game logic
const onDragStart = (src, p, pos, ori) => {
  if (game.game_over()) return false;

  if (
    (game.turn() === 'w' && p.search(/^b/) !== -1) ||
    (game.turn() === 'b' && p.search(/^w/) !== -1)
  ) {
    return false;
  }
};

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
  makeBestMove(3);
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
