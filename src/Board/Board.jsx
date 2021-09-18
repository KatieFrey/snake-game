import React, { useState, useEffect } from 'react';
import './Board.css'
import randomIntFromInterval from '../lib/utils';

const BOARD_SIZE = 10;

const Direction = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
}

class LinkListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor(value) {
    const node = new LinkListNode(value);
    this.head = node;
    this.tail = node;
  }
}

class Cell {
  constructor(row, col, value) {
    this.row = row;
    this.col = col;
    this.value = value;
  }
}

const createBoard = (BOARD_SIZE) => {
  let counter = 1;
  const board = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    const currentRow = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      currentRow.push(counter++)
    }
    board.push(currentRow);
  }
  return board;
}

const isOutOfBounds = (coords, board) => {
  const { row, col } = coords;
  if (row < 0 || col < 0) return true;
  if (row >= board.length || col >= board[0].length) return true;
  return false;
}

const getDirectionFromKey = (key) => {
  if (key === 'ArrowUp') return Direction.UP;
  if (key === 'ArrowDown') return Direction.DOWN;
  if (key === 'ArrowLeft') return Direction.LEFT;
  if (key === 'ArrowRight') return Direction.RIGHT;
  return '';
}

const getGrowthNodeCoords = (snakeTail, currentDirection) => {
  const tailNextNodeDirection = getNextNodeDirection(snakeTail, currentDirection);
  const growthDirection = getOppositeDirection(tailNextNodeDirection);
  const currentTailCoords = {
    row: snakeTail.value.row,
    col: snakeTail.value.col
  }
  const growthNodeCoords = getCoordsInDirection(
    currentTailCoords,
    growthDirection
  )
  return growthNodeCoords;
}

const getOppositeDirection = direction => {
  if (direction === Direction.UP) return Direction.DOWN;
  if (direction === Direction.DOWN) return Direction.UP;
  if (direction === Direction.LEFT) return Direction.RIGHT;
  if (direction === Direction.RIGHT) return Direction.LEFT;
  return '';
}

const Board = () => {
  const [score, setScore] = useState(0)
  const [board, setBoard] = useState(createBoard(BOARD_SIZE));
  const [foodCell, setFoodCell] = useState(48);
  const [snakeCells, setSnakeCells] = useState(new Set([44]));
  const [snake, setSnake] = useState(new LinkedList(new Cell(4, 3, 44)));
  const [direction, setDirection] = useState(Direction.RIGHT)

  useEffect(() => {
    setInterval(() => { }, 1000);

    window.addEventListener('keydown', e => {
      const newDirection = getDirectionFromKey(e.key);
      const isValidDirection = newDirection !== '';
      if (isValidDirection) setDirection(newDirection)
    })
  }, [])

  const getNextHeadCoords = (currentHeadCoords, direction) => {
    if (direction === Direction.UP) {
      return {
        row: currentHeadCoords.row - 1,
        col: currentHeadCoords.col
      }
    }
    if (direction === Direction.DOWN) {
      return {
        row: currentHeadCoords.row + 1,
        col: currentHeadCoords.col
      }
    }
    if (direction === Direction.LEFT) {
      return {
        row: currentHeadCoords.row,
        col: currentHeadCoords.col - 1
      }
    }
    if (direction === Direction.RIGHT) {
      return {
        row: currentHeadCoords.row,
        col: currentHeadCoords.col + 1
      }
    }
  }

  const growSnake = (newSnakeCells) => {
    const growthNodeCoords = getGrowthNodeCoords(snake.tail, direction);
    if (isOutOfBounds(growthNodeCoords, board)) {
      return;
    }
    const newTailCell = board[growthNodeCoords.row][growthNodeCoords.col];
    const newTail = new LinkListNode({
      row: growthNodeCoords.row,
      col: growthNodeCoords.col,
      cell: newTailCell
    })
    const currentTail = snake.tail;
    snake.tail = newTail;
    snake.tail.next = currentTail;

    newSnakeCells.add(newTailCell);
    setSnakeCells(newSnakeCells)
  }

  const handleFoodConsumption = () => {
    const maxPossibleCellValue = BOARD_SIZE * BOARD_SIZE;
    let nextFoodCell;
    while (true) {
      nextFoodCell = randomIntFromInterval(1, maxPossibleCellValue);
      if (snakeCells.has(nextFoodCell) || foodCell === nextFoodCell) { continue; }
      break;
    }
    setFoodCell(nextFoodCell);
  }

  return (
    <div className="board">
      {board.map((row, rowIdx) => (
        <div key={rowIdx} className="row">
          {row.map((cellValue, cellIdx) => (
            <div key={cellIdx} className={`cell ${snakeCells.has(cellValue) ? 'snake-cell' : ''}`}>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}



export default Board
