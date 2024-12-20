// Set up the Gameboard module
const Gameboard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const updateBoard = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    return { getBoard, updateBoard, resetBoard };
})();

// Player factory function
const Player = (name, marker) => {
    return { name, marker };
};

// Game Controller module
const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameActive = true;

    const startGame = (player1Name, player2Name) => {
        players = [Player(player1Name, "X"), Player(player2Name, "O")];
        currentPlayerIndex = 0;
        gameActive = true;
        Gameboard.resetBoard();
        DisplayController.renderBoard();
        DisplayController.updateMessage(`${players[currentPlayerIndex].name}'s turn!`);
    };

    const playTurn = (index) => {
        if (!gameActive) return;

        if (Gameboard.updateBoard(index, players[currentPlayerIndex].marker)) {
            if (checkWin(players[currentPlayerIndex].marker)) {
                gameActive = false;
                DisplayController.updateMessage(`${players[currentPlayerIndex].name} wins!`);
                return;
            }

            if (checkTie()) {
                gameActive = false;
                DisplayController.updateMessage("It's a tie!");
                return;
            }

            currentPlayerIndex = 1 - currentPlayerIndex;
            DisplayController.updateMessage(`${players[currentPlayerIndex].name}'s turn!`);
            DisplayController.renderBoard();
        }
    };

    const checkWin = (marker) => {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        return winningCombos.some(combo =>
            combo.every(index => Gameboard.getBoard()[index] === marker)
        );
    };

    const checkTie = () => {
        return Gameboard.getBoard().every(cell => cell !== "");
    };

    return { startGame, playTurn };
})();

// Display Controller module
const DisplayController = (() => {
    const boardElement = document.querySelector(".gameboard");
    const messageElement = document.querySelector(".message");
    const restartButton = document.querySelector(".restart");

    boardElement.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        if (index) GameController.playTurn(parseInt(index));
    });

    restartButton.addEventListener("click", () => {
        const player1Name = document.querySelector("#player1").value || "Player 1";
        const player2Name = document.querySelector("#player2").value || "Player 2";
        GameController.startGame(player1Name, player2Name);
    });

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        boardElement.innerHTML = "";
        board.forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.dataset.index = index;
            cellElement.textContent = cell;
            boardElement.appendChild(cellElement);
        });
    };

    const updateMessage = (message) => {
        messageElement.textContent = message;
    };

    return { renderBoard, updateMessage };
})();

// Initialize the game
GameController.startGame("Player 1", "Player 2");
