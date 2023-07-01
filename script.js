function player(name, sign, score){
    this.name = name;
    this.sign = sign;
    this.score = score;
}

const player1 = new player("Player 1", "X", 0);
const player2 = new player("Player 2", "O", 0);
let round ;
let numberRounds ;
let isGameOn=false;
let whoStartedPrevRound = player2;
let againstBot = false;

belowBoardDiv.style.display = "none"
PvPRadio.checked= true


document.addEventListener("click", e=>{
    if (e.target.className == "tile"){
        clickTile(e);
        if(round == numberRounds && isGameOn == false){
            displayResult();
        }
    };
    if (e.target.id == "nextRoundBtn"){startNextRound(e);};
    if (e.target.classList.contains("restartBtnClass")){restart();};
    if (e.target.id == "PvBotRadio"){player2Name.style.display = "none"};
    if (e.target.id == "PvPRadio"){player2Name.style.display = "block"};
    if (e.target.id == "startBtn"){initiateGame();};
});

function clickTile(e){ 
    let placedTileInd =  parseInt(e.target.id.slice(-1));
    if (boardArr[placedTileInd] != null || isGameOn == false){
        return;
    } else{
        placeSign(e, placedTileInd);
        updateStatus(checkBoard());
        
        if (againstBot==true && playerOfTurn == player2){
            letBotPlayTurn()
        }
    }
}

function letBotPlayTurn(){
    let board2DArr=convertTo2DArr(boardArr);
    let bestMove = findBestMove(board2DArr);

    board2DArr[bestMove.row][bestMove.col] = player2.sign
    boardArr = convertTo1DArr(board2DArr);
    placeBotSign()
    updateStatus(checkBoard());
}

function switchPlayer(){
    if (playerOfTurn == player1){
        playerOfTurn = player2;
    } else{
        playerOfTurn =  player1;
    }
    whoseTurnDiv.innerHTML = `${playerOfTurn.name}'s turn (${playerOfTurn.sign})`
};

function placeSign(e, placedTileInd){
    boardArr[placedTileInd] = playerOfTurn.sign;
    e.target.classList.add(boardArr[placedTileInd])
}

function placeBotSign(){

    tempTileInd = 1;
    let tiles = document.getElementsByClassName("tile");
    for (let i = 0; i<tiles.length; i++){
        let eachTile = tiles[i]; 
        if (boardArr[tempTileInd]!==null){
            eachTile.classList.add(boardArr[tempTileInd]);
        }
        tempTileInd++;
    }

}

function checkBoard(){
    let sign = playerOfTurn.sign
    if (countNotNull(boardArr) == 9){
        console.log("it's a draw!");
        return "draw";
    } else if ((boardArr[1] == sign && boardArr[2] == sign && boardArr[3] == sign)||
               (boardArr[4] == sign && boardArr[5] == sign && boardArr[6] == sign)||
               (boardArr[7] == sign && boardArr[8] == sign && boardArr[9] == sign)||
               (boardArr[1] == sign && boardArr[4] == sign && boardArr[7] == sign)||
               (boardArr[2] == sign && boardArr[5] == sign && boardArr[8] == sign)||
               (boardArr[3] == sign && boardArr[6] == sign && boardArr[9] == sign)||
               (boardArr[1] == sign && boardArr[5] == sign && boardArr[9] == sign)||
               (boardArr[3] == sign && boardArr[5] == sign && boardArr[7] == sign)){
        let winner = playerOfTurn
        console.log(playerOfTurn.name + "wins!")
        return winner;
    } 
}

function updateStatus(status){
    switchPlayer();
    if (status == "draw"){
        whoseTurnDiv.innerHTML = "It's a draw!";
        isGameOn= false;
    }else if (typeof status == "object"){
        whoseTurnDiv.innerHTML = status.name + " wins!"
        status.score++;
        if (status.name == player1.name){
            player1Score.innerHTML =`${player1.name} : ${player1.score}`
        }else{
            player2Score.innerHTML =`${player2.name} : ${player2.score}`
        }
        
        isGameOn= false;
    }
}

function countNotNull(arr){
    let count = 0 
    for (let item of arr){
        if(item != null){
            count++
        }
    }
    return count
}

function startNextRound(){

    //increment round  
    round++;
    

    if (round>numberRounds){
        displayResult();
        return;
    }

    currentRoundText.innerHTML = `Round: ${round}/${numberRounds}`
    
    //clear array
    boardArr = new Array(10).fill(null);
    //clear tiles
    let tiles = document.getElementsByClassName("tile")
    for (let i = 0; i<tiles.length; i++){
        let eachTile = tiles[i]; 
        if (eachTile.classList.contains("O")){
            eachTile.classList.remove("O");
        }else{
            eachTile.classList.remove("X");
        }
    }

    if (whoStartedPrevRound == player1){
        playerOfTurn = player2;
        whoStartedPrevRound = player2;
    }else if(whoStartedPrevRound == player2){
        playerOfTurn = player1;
        whoStartedPrevRound = player1;
    }
    whoseTurnDiv.innerHTML = `${playerOfTurn.name}'s turn (${playerOfTurn.sign})`

    isGameOn=true;
    if (againstBot==true && playerOfTurn == player2){
        letBotPlayTurn()
    }
}

function restart(){
    resultPopUp.style.display = "none";
    round = 0;
    isGameOn=false;
    player1.score = 0;
    player2.score = 0; 
    player1Score.innerHTML =`${player1.name} : ${player1.score}`
    player2Score.innerHTML =`${player2.name} : ${player2.score}`
    startNextRound();
}

function displayResult(){
    resultPopUp.style.display = "flex";
    if (player1.score > player2.score){
        finalWinner = player1.name;
    }else if (player1.score < player2.score){
        finalWinner = player2.name;
    }else{
        finalWinner = "Everyone"
    }
    
    whoWon.innerHTML = finalWinner;
    player1ScorePopUp.innerHTML = `${player1.name}: ${player1.score}`
    player2ScorePopUp.innerHTML = `${player2.name}: ${player2.score}`

}

function initiateGame(){
    validateInputs()
    if (PvPRadio.checked==true){
        player1.name = player1Name.value;
        player2.name = player2Name.value;
    }else if (PvBotRadio.checked==true){
        player1.name = player1Name.value;
        player2.name = 'Bot';
        againstBot = true
    }
    numberRounds = numRounds.value;
    preGamePopUp.style.display = "none"
    belowBoardDiv.style.display = "flex"
    restart()
}

function validateInputs(){
    if (player1Name.value == ""){
        alert("Player name must be filled out");
        throw new Error("")
    }
    if (numRounds.value.split(' ').join('') == "" || parseInt(numRounds.value) <= 0){
        alert("Number of Rounds input not valid");
        throw new Error("")
    }
    
}

function convertTo2DArr(boardArr){
    let boardArr2D = [[null,null,null],[null,null,null],[null,null,null]]
    tempInd = 1
    for (let i = 0; i<3; i++){
        for (let j = 0; j<3; j++){
            boardArr2D[i][j] = boardArr[tempInd];
            tempInd++;
        }
    }
    return boardArr2D;
}

function convertTo1DArr(boardArr2D){
    let boardArr1D = [null,null,null,null,null,null,null,null,null,null]
    tempInd = 1
    for (let i = 0; i<3; i++){
        for (let j = 0; j<3; j++){
            boardArr1D[tempInd] = boardArr2D[i][j];
            tempInd++;
        }
    }
    return boardArr1D;
}


//code below this line is copied from https://www.geeksforgeeks.org/finding-optimal-move-in-tic-tac-toe-using-minimax-algorithm-in-game-theory/ 

// This function returns true if there are moves
// remaining on the board. It returns false if
// there are no moves left to play.
function isMovesLeft(board)
{
    for(let i = 0; i < 3; i++)
        for(let j = 0; j < 3; j++)
            if (board[i][j] == null)
                return true;
                  
    return false;
}
  
// This is the evaluation function as discussed
// in the previous article ( http://goo.gl/sJgv68 )
function evaluate(b)
{
      
    // Checking for Rows for X or O victory.
    for(let row = 0; row < 3; row++)
    {
        if (b[row][0] == b[row][1] &&
            b[row][1] == b[row][2])
        {
            if (b[row][0] == player2.sign)
                return +10;
                  
            else if (b[row][0] == player1.sign)
                return -10;
        }
    }
   
    // Checking for Columns for X or O victory.
    for(let col = 0; col < 3; col++)
    {
        if (b[0][col] == b[1][col] &&
            b[1][col] == b[2][col])
        {
            if (b[0][col] == player2.sign)
                return +10;
   
            else if (b[0][col] == player1.sign)
                return -10;
        }
    }
   
    // Checking for Diagonals for X or O victory.
    if (b[0][0] == b[1][1] && b[1][1] == b[2][2])
    {
        if (b[0][0] == player2.sign)
            return +10;
              
        else if (b[0][0] == player1.sign)
            return -10;
    }
   
    if (b[0][2] == b[1][1] && 
        b[1][1] == b[2][0])
    {
        if (b[0][2] == player2.sign)
            return +10;
              
        else if (b[0][2] == player1.sign)
            return -10;
    }
   
    // Else if none of them have
    // won then return 0
    return 0;
}
  
// This is the minimax function. It 
// considers all the possible ways 
// the game can go and returns the 
// value of the board
function minimax(board, depth, isMax)
{
    let score = evaluate(board);
   
    // If Maximizer has won the game
    // return his/her evaluated score
    if (score == 10)
        return score;
   
    // If Minimizer has won the game
    // return his/her evaluated score
    if (score == -10)
        return score;
   
    // If there are no more moves and
    // no winner then it is a tie
    if (isMovesLeft(board) == false)
        return 0;
   
    // If this maximizer's move
    if (isMax)
    {
        let best = -1000;
   
        // Traverse all cells
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                  
                // Check if cell is empty
                if (board[i][j]==null)
                {
                      
                    // Make the move
                    board[i][j] = player2.sign;
   
                    // Call minimax recursively 
                    // and choose the maximum value
                    best = Math.max(best, minimax(board,
                                    depth + 1, !isMax));
   
                    // Undo the move
                    board[i][j] = null;
                }
            }
        }
        return best;
    }
   
    // If this minimizer's move
    else
    {
        let best = 1000;
   
        // Traverse all cells
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                  
                // Check if cell is empty
                if (board[i][j] == null)
                {
                      
                    // Make the move
                    board[i][j] = player1.sign;
   
                    // Call minimax recursively and 
                    // choose the minimum value
                    best = Math.min(best, minimax(board,
                                    depth + 1, !isMax));
   
                    // Undo the move
                    board[i][j] = null;
                }
            }
        }
        return best;
    }
}

// Javascript program to find the
// next optimal move for a player
class Move
{
    constructor()
    {
        let row,col;
    }
}
  
// This will return the best possible
// move for the player
function findBestMove(board)
{
    let bestVal = -1000;
    let bestMove = new Move();
    bestMove.row = -1;
    bestMove.col = -1;
   
    // Traverse all cells, evaluate 
    // minimax function for all empty 
    // cells. And return the cell
    // with optimal value.
    for(let i = 0; i < 3; i++)
    {
        for(let j = 0; j < 3; j++)
        {
              
            // Check if cell is empty
            if (board[i][j] == null)
            {
                  
                // Make the move
                board[i][j] = player2.sign;
   
                // compute evaluation function 
                // for this move.
                let moveVal = minimax(board, 0, false);
   
                // Undo the move
                board[i][j] = null;
   
                // If the value of the current move 
                // is more than the best value, then 
                // update best
                if (moveVal > bestVal)
                {
                    bestMove.row = i;
                    bestMove.col = j;
                    bestVal = moveVal;
                }
            }
        }
    }
    return bestMove;
}
  