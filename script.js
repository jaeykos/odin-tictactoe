function player(name, sign){
    this.name = name;
    this.sign = sign;
}

const player1 = new player("Player 1", "X");
const player2 = new player("Player 2", "O");

boardArr = new Array(9).fill(null);

let playerOfTurn = player1;

document.addEventListener("click", e=>{
    if (e.target.className == "tile"){clickTile(e);}
});

function clickTile(e){ 
    let placedTileInd =  parseInt(e.target.id.slice(-1));
    if (boardArr[placedTileInd] != null){
        return;
    } else{
        placeSign(e, placedTileInd);
        checkBoard();
        switchPlayer();
    }
}

function switchPlayer(){
    if (playerOfTurn == player1){
        playerOfTurn = player2;
    } else{
        playerOfTurn =  player1;
    }
};

function placeSign(e, placedTileInd){
    boardArr[placedTileInd] = playerOfTurn.sign;
    e.target.innerHTML = boardArr[placedTileInd]
}

function checkBoard(){
    let sign = playerOfTurn.sign
    if (countNull == 9){
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

function countNull(arr){
    let count = 0 
    for (let item of arr){
        if(item == null){
            count++
        }
    }
    return count
}