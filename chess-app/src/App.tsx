import { useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import './App.css';

function App() {
  const [game, setGame] = useState(new Chess());

  function makeAMove(move: { from: string; to: string; promotion?: string }) {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);
      setGame(gameCopy);
      return result; // null if illegal move
    } catch (e) {
        return null;
    }
  }

  function onDrop({ sourceSquare, targetSquare }: { sourceSquare: string, targetSquare: string | null }) {
    if (!targetSquare) return false;
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to queen for simplicity
    });

    if (move === null) return false;
    
    // Check for game over
    if (game.isGameOver()) {
        if (game.isCheckmate()) alert("Checkmate!");
        else if (game.isDraw()) alert("Draw!");
        else alert("Game Over!");
    }
    
    return true;
  }

  return (
    <div className="app-container">
      <h1>Chess App</h1>
      <div className="board-container">
        <Chessboard options={{ position: game.fen(), onPieceDrop: onDrop }} />
      </div>
      <div className="game-info">
        <button onClick={() => {
            setGame(new Chess());
        }}>
            Reset Game
        </button>
      </div>
    </div>
  );
}

export default App;