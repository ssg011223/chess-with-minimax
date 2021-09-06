const ChessBoard = require('chessboardjs');
const { Chess } = require('chess.js');

const boardConfig = {
  position: 'start',
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
};

const game = new Chess();
console.log(game.fen());

const board = ChessBoard('board', boardConfig);
console.log(board.fen());
