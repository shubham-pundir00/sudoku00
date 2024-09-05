import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [mistake, setMistake] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (mistake >= 3) {
      setIsModalOpen(true);
    }
  }, [mistake]);
// move check
  const isValid = (grid, row, col, num) => {
    for (let x = 0; x < 9; x++) {   //  check in row
      if (grid[row][x] === num) return false;
    }
    for (let x = 0; x < 9; x++) {   //  check in  col
      if (grid[x][col] === num) return false;
    }
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;  // check in 3x3 box
      }
    }
    return true;
  };
   
  const sudoku = (grid) => {
    for (let row = 0; row < 9; row++) {   
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          // 1-9
          for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;             // number valid hone par set num 
              if (sudoku(grid)) return true;    
              grid[row][col] = 0;               
            }
          }
          return false;
        }
      }
    }
    return true;
  };
  
  const generateGrid = () => {
    let grid = Array(9).fill(null).map(() => Array(9).fill(0));
    // console.log(grid, "generate grid")
    sudoku(grid);
    return grid;
  };

  const generatePuzzle = (grid, numberOfbox) => {
    let puzzle = grid.slice();
    let cells = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        cells.push([row, col]);        
      } 
    }
    // console.log(cells,"cellsconsole")
    cells.sort(() => Math.random() - 0.5);
    for (let i = 0; i < 81 - numberOfbox; i++) {
      let [row, col] = cells[i];       // row aur col pairs 
      puzzle[row][col] = 0;
    }
    return puzzle;
  };

  const fullGrid = generateGrid();
  const puz =  generatePuzzle(fullGrid, 40);

  const [grid, setGrid] = useState(puz);

  const handleChange = (e, row, col) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 9 && isValid(grid, row, col, value)) {
      const newGrid = grid.map((r, i) => 
        r.map((cell, j) => (i === row && j === col ? value : cell))
      );
      setGrid(newGrid);
    } else {
      setMistake(mistake + 1);
    }
  };

  const resetGame = () => {
    const fullGrid = generateGrid();
    setGrid(generatePuzzle(fullGrid, 40));
    setMistake(0);
    setIsModalOpen(false);
  };

  return (
    <div className="main-container">
      <div className="container">
        <p>Sudoku Game</p>
        <p>Mistake: {mistake}</p>
        <table>
          <tbody>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rindex) => (
              <tr key={rindex} className={(row + 1) % 3 === 0 ? "rBorder" : ""}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cindex) => (
                  <td key={rindex + cindex} className={(col + 1) % 3 === 0 ? "cBorder" : ""}>
                    <input
                      className="cell-input"
                      value={grid[row][col] === 0 ? '' : grid[row][col]}
                      maxLength={1}
                      onChange={(e) => handleChange(e, row, col)}
                      disabled={grid[row][col] !== 0}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button className="btn" onClick={resetGame}>
            Reset
          </button>
        </div>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <p>You lost this game. Reset to play again.</p>
              <button onClick={resetGame}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;