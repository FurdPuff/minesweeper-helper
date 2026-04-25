# board.py initializes Board and Cell classes

from typing import Literal
from dataclasses import dataclass

@dataclass
class Cell:
    x: int
    y: int
    revealed: bool
    flagged: bool
    number: int | None

# Types of playable moves
Move = Literal["reveal", "flag", "chord"]

@dataclass
class MoveLocation:
    action: Move
    cell: Cell

def create_grid(width: int, height: int) -> list[list[Cell]]:
    return [[Cell(x, y, False, False, None) 
             for x in range(width)] 
             for y in range(height)]

class Board:
    def __init__(self, width: int, height: int, mineCount: int, is_first_move: bool):
        self.width = width
        self.height = height
        self.mine_count = mineCount
        self.is_first_move = is_first_move
        self.cells = create_grid(width, height)
    
    @property
    def size(self) -> int:
        return self.width * self.height

    @property
    def revealed_cells(self) -> list[Cell]:
        """
        Returns:
            list[Cell]: list of revealed cells from a given board
        
        Time: O(n), n is size of board
        """
        revealed = []
        for row in self.cells:
            for cell in row:
                if cell.revealed: revealed.append(cell)
        return revealed

    def perform_action(self, move_list: list[MoveLocation], action: Move, cell: Cell):
        """Performs action onto given cell and appends a corresponding MoveLocation onto to move_list

        Args:
            move_list (list[MoveLocation]): _description_
            action (Move): _description_
            cell (Cell): _description_

        Raises:
            NotImplementedError: Chord not implemented
            ValueError: Invalid action provided
        """
        if action == "reveal":
            cell.revealed = True
        elif action == "flag":
            cell.flagged = True
        elif action == "chord":
            raise NotImplementedError("Chord not implemented")
            # add chord implementation
            # may be useful for efficiency solves, otherwise low priority
        else:
            raise ValueError("Invalid action provided")
        
        ml = MoveLocation(action, cell)
        move_list.append(ml)

    def get_cell(self, x: int, y: int) -> Cell:
        if x < 0 or y < 0 or x >= self.width or y >= self.height:
            raise IndexError('Coordinates out of bounds')
        return self.cells[y][x]
    
    def insert_cells(self, cells: list[Cell]) -> None:
        """Inserts a list of cells into the Board

        Args:
            cells (list[Cell]): cells to insert

        Raises:
            IndexError: x and y are outside the range of the board
        """
        for cell in cells:
            if cell.x < 0 or cell.y < 0 or cell.x >= self.width or cell.y >= self.height:
                raise IndexError('Coordinates out of bounds')
            old_cell = self.get_cell(cell.x, cell.y)
            old_cell.__dict__.update(cell.__dict__)