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
const aiSearchDepth = 3;
let counter = 0;

// AI
const wPawn = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const bPawn = wPawn.reverse();

const wKnight = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const bKnight = wKnight.reverse();

const wBishop = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const bBishop = wBishop.reverse();

const wRook = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

const bRook = wRook.reverse();

const wQueen = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const bQueen = wQueen.reverse();

const wKing = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

const bKing = wKing.reverse();

const evalPos = (i, j, b) => {
  const p = b[i][j];

  if (p === null) return 0;

  let posValue = 0;
  let pieceValue = 0;

  switch (p.type) {
    case 'p':
      posValue = p.color === 'w' ? wPawn[i][j] : bPawn[i][j];
      pieceValue = 100 + posValue;
      break;
    case 'r':
      posValue = p.color === 'w' ? wRook[i][j] : bRook[i][j];
      pieceValue = 500 + posValue;
      break;
    case 'n':
      posValue = p.color === 'w' ? wKnight[i][j] : bKnight[i][j];
      pieceValue = 320;
      break;
    case 'b':
      posValue = p.color === 'w' ? wBishop[i][j] : bBishop[i][j];
      pieceValue = 330 + posValue;
      break;
    case 'q':
      posValue = p.color === 'w' ? wQueen[i][j] : bQueen[i][j];
      pieceValue = 900 + posValue;
      break;
    case 'k':
      posValue = p.color === 'w' ? wKing[i][j] : bKing[i][j];
      pieceValue = 20000 + posValue;
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
  if (gameToPass.in_checkmate()) {
    return gameToPass.turn() === 'w' ? -50000 : 50000;
  }
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
  makeBestMove(aiSearchDepth);
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
