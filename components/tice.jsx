import React, { useState, useEffect } from "react";

const TicTacToe = () => {
  const winnerPosibility = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");

  useEffect(() => {
    const checkWinner = () => {
      for (let possibility of winnerPosibility) {
        const [a, b, c] = possibility;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          setWinner(board[a]);
          return;
        }
      }
      if (board.every((cell) => cell !== null)) {
        setWinner("tie");
      }
    };
    checkWinner();
  }, [board]);

  useEffect(() => {
    const aiMove = () => {
      if (!xTurn && !winner) {
        if (difficulty === "easy") {
          easyAI();
        } else if (difficulty === "medium") {
          mediumAI();
        } else if (difficulty === "hard") {
          hardAI();
        }
      }
    };
    const timer = setTimeout(aiMove, 500); // تأخیر برای شبیه‌سازی تفکر AI
    return () => clearTimeout(timer); // پاک‌سازی تایمر در صورت تغییر xTurn یا winner
  }, [xTurn, winner, board, difficulty]);

  const easyAI = () => {
    const emptyCells = board
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null);
    const randomIndex =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    handleClick(randomIndex);
  };

  const mediumAI = () => {
    // بررسی برای برنده شدن یا جلوگیری از باخت
    for (let possibility of winnerPosibility) {
      const [a, b, c] = possibility;
      if (board[a] === "O" && board[b] === "O" && board[c] === null) {
        handleClick(c);
        return;
      }
      if (board[a] === "O" && board[c] === "O" && board[b] === null) {
        handleClick(b);
        return;
      }
      if (board[b] === "O" && board[c] === "O" && board[a] === null) {
        handleClick(a);
        return;
      }
    }
    // اگر نمی‌تواند برنده شود، مانع از برنده شدن کاربر می‌شود
    for (let possibility of winnerPosibility) {
      const [a, b, c] = possibility;
      if (board[a] === "X" && board[b] === "X" && board[c] === null) {
        handleClick(c);
        return;
      }
      if (board[a] === "X" && board[c] === "X" && board[b] === null) {
        handleClick(b);
        return;
      }
      if (board[b] === "X" && board[c] === "X" && board[a] === null) {
        handleClick(a);
        return;
      }
    }
    // حرکت تصادفی اگر هیچ کدام از شرایط بالا برقرار نبود
    easyAI();
  };

  const hardAI = () => {
    // الگوریتم Minimax برای بهترین حرکت
    const minimax = (newBoard, depth, isMaximizing) => {
      const scores = { X: -1, O: 1, tie: 0 };
      let result = checkWinnerMinimax(newBoard);
      if (result !== null) {
        return scores[result];
      }

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newBoard.length; i++) {
          if (newBoard[i] === null) {
            newBoard[i] = "O";
            let score = minimax(newBoard, depth + 1, false);
            newBoard[i] = null;
            bestScore = Math.max(score, bestScore);
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < newBoard.length; i++) {
          if (newBoard[i] === null) {
            newBoard[i] = "X";
            let score = minimax(newBoard, depth + 1, true);
            newBoard[i] = null;
            bestScore = Math.min(score, bestScore);
          }
        }
        return bestScore;
      }
    };

    const checkWinnerMinimax = (board) => {
      for (let possibility of winnerPosibility) {
        const [a, b, c] = possibility;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }
      if (board.every((cell) => cell !== null)) {
        return "tie";
      }
      return null;
    };

    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";
        let score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    handleClick(bestMove);
  };

  const handleClick = (index) => {
    if (board[index] || winner) return; // جلوگیری از کلیک روی خانه‌های پر شده
    const newBoard = [...board];
    newBoard[index] = xTurn ? "X" : "O";
    setBoard(newBoard);
    setXTurn(!xTurn);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setXTurn(true);
  };

  return (
    <>
      <div className="card card-game ">
        <h1 className="game-title mt-20 p-16 font-bold text-4xl text-slate-600 text-center">
          Tic Tac Toe
        </h1>
        <div className="difficulty-selector lg:w-50 flex justify-end mr-20 ">
          <label className="text-green-600 font-bold">Select Difficulty:</label>
          <select
            value={difficulty}
            className="md:h-full md:w-35 text-center justify-end font-medium text-gary-400 p-1"
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="board" id="board">
          {board.map((cell, index) => (
            <div
              key={index}
              className="cell"
              data-cell
              onClick={() => handleClick(index)}
            >
              {cell}
            </div>
          ))}
        </div>
        {winner && (
          <div className="victory-modal show" id="modal">
            <div className="victory-message" data-msg>
              {winner === "tie" ? "It's a tie!" : `The winner is: ${winner}`}
            </div>
            <input
              type="button"
              className="restart-Btn"
              id="restartBtn"
              value="Restart"
              onClick={resetGame}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TicTacToe;
