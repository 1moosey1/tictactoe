var playerMark, computerMark;
var computerChoice;

var boardSize, gameBoard, gameOver;
var blankSpace = "_";

$("document").ready(function () {

  $("#selection").show();
  $("#X").click(selectX);
  $("#O").click(selectO);
  $(".cell").hover(hoverHandler);
  $(".cell").click(markCell);
  $("#msgdisplay").click(resetGame);
  
  boardSize = 9;
  initalizeGame();
});

// selectX - selectY
// Setup up game variables when user selects a marker
// 0 = O & 1 = X
function selectX(eventObj) {
  
  playerMark = 1;
  computerMark = 0;
  $("#selection").hide();
  $("#board").show();
}

function selectO(eventObj) {
  
  playerMark = 0;
  computerMark = 1;
  $("#selection").hide();
  $("#board").show();
}

// Handles the event when a user hovers over a cell
function hoverHandler(eventObj) {
  
  var cell = $(eventObj.target);
  cell.toggleClass("hover");
}

// Meant to initalize or reinitalize game board
function initalizeGame() {
  
  gameOver = false;
  gameBoard = new Array(boardSize);
  for (var i = 0; i < boardSize; i++)
    gameBoard[i] = blankSpace;
}

function resetGame() {
  
  $("#msgdisplay").hide();
  $(".cell").text("");
  initalizeGame();
  
  $("#board").hide();
  $("#selection").show();
}

function getXO(mark) {
  
  if(mark == 0)
    return "O";
  else
    return "X";
}

// Handles the event when a user clicks a cell
function markCell(eventObj) {
  
  var cell = $(eventObj.target);
  var index = parseInt(cell.attr("data-id"));
  
  if(!gameOver && gameBoard[index] == blankSpace) {
    
    cell.text(getXO(playerMark));
    gameBoard[index] = playerMark; 
    markAI();
  }
}

function markAI() {
  
  minimax(gameBoard, computerMark, -Infinity, Infinity);
  
  var cell = $("[data-id=" + computerChoice + "]");    
  cell.text(getXO(computerMark));
  gameBoard[computerChoice] = computerMark;
  
  var result = checkWin(gameBoard);
  if(result != 2) {
    
    gameOver = true;
    $("#msgdisplay").show();
    
    if(result == 1)
      $("#message").text("You are the Winner!");
    
    else if(result == -1)
      $("#message").text("Computer Wins!");
    
    else if(result == 0)
      $("#message").text("Game is a Draw!");
  }
}

// Determine the best move to make to minimize players score
function minimax(board, mark, alpha, beta) {
  
  var scores = [];
  var moves = [];
  var index, result, newBoard;
  
  result = checkWin(board);
  if(result != 2)
    return result;
  
  for(index = 0; index < boardSize; index++) {
    
    if(alpha >= beta)
      break;
    
    if(board[index] == blankSpace) {
      
      newBoard = board.slice(0);
      newBoard[index] = mark;
      
      result = minimax(newBoard, 1 - mark, alpha, beta);
      if(mark == playerMark && result > alpha)
        alpha = result;
  
      else if(mark == computerMark && result < beta)
        beta = result;
      
      moves.push(index);
      scores.push(result);
    }
  }
  
  if(mark == playerMark) {
    
    result = scores.reduce(function(a, b) {
      return Math.max(a, b); });
    index = scores.indexOf(result);
  }    
  
  else {
    
    result = scores.reduce(function(a, b) {
      return Math.min(a, b); });
    index = scores.indexOf(result);
  }
      
  computerChoice = moves[index];
  return scores[index];
}

// Check whether the game is a win, loss or draw
// -1 = Computer Win
//  0 = Draw
//  1 = Player Win
//  2 = Incomplete Game
function checkWin(board) {
  
  var winExps = [
	  "^(\\d)\\1\\1......$",
	  "^...(\\d)\\1\\1...$",
	  "^......(\\d)\\1\\1$",
	  "^(\\d)..\\1..\\1..$",
	  "^.(\\d)..\\1..\\1.$",
	  "^..(\\d)..\\1..\\1$",
	  "^(\\d)...\\1...\\1$",
	  "^..(\\d).\\1.\\1..$"
  ];

  var winRegex, matchArray;
  for(var i = 0; i < winExps.length; i++) {

	  winRegex = new RegExp(winExps[i]);
	  matchArray = winRegex.exec(board.join(""));
	  if(matchArray) break;
  }
  
  if(!matchArray) {
  
    if(board.includes(blankSpace))
      return 2;
    
    return 0;
  }
  
  else if(parseInt(matchArray[1]) == playerMark)
    return 1;
    
  else  
    return -1;
}