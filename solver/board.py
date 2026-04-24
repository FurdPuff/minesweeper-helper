# board.py initializes Board and Cell classes

from actions import Actions

class Cell:
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y
        self.revealed = False
        self.flagged = False
        self.number: int | None = None

# create_cells(width, height) creates a 2d array of cells
def create_cells(width: int, height: int) -> list[list[Cell]]:
    return [[Cell(x, y) 
             for x in range(width)] 
             for y in range(height)]

class Board:
    def __init__(self, width: int, height: int, mineCount: int):
        self.width = width
        self.height = height
        self.mine_count = mineCount
        self.cells = create_cells(width, height)
        self.actions = Actions(self)
    
    # get_cell(x, y) returns the desired cell in the board given (x,y) coordinates
    # requires: x and y are within the range of the board
    @property
    def get_cell(self, x: int, y: int) -> Cell:
        if x < 0 or y < 0 or x >= self.width or y >= self.height:
            raise IndexError('Coordinates out of bounds')
        return self.cells[y][x]
    
    # size() returns size of the board
    @property
    def size(self) -> int:
        return self.width * self.height

    # get_revealed_list() returns a list of revealed cells from a given board
    # time: O(n), n is size of board
    @property
    def revealed_cells(self) -> list[Cell]:
        list = []
        for row in self.cells:
            for cell in row:
                if cell.revealed: list.append(cell)
    
    # insert_cells(cells) inserts a list of cells into the Board
    # requires: x and y are within the range of the board
    @property
    def insert_cells(self, cells: list[Cell]) -> None:
        for cell in cells:
            if cell.x < 0 or cell.y < 0 or cell.x >= self.width or cell.y >= self.height:
                raise IndexError('Coordinates out of bounds')
            old_cell = self.get_cell(cell.x, cell.y)
            old_cell.x = cell.x
            old_cell.y = cell.y
            old_cell.revealed = cell.revealed
            old_cell.flagged = cell.flagged
            old_cell.number = cell.number