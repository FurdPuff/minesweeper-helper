from board import Board

# possible actions the solver can use (incomplete)
class Actions:
    def __init__(self, board: Board):
        self.board = board
    
    # reveals cell at (x, y) coordinate
    def reveal(self, x: int, y: int):
        self.board.get_cell(x, y).revealed = True
        # add reveal implementation
    
    # flags cell at (x, y) coordinate
    def flag(self, x: int, y: int):
        self.board.get_cell(x, y).flagged = True
        # add flag implementation
    
    # attempts to chord cell at (x, y) coordinate
    def chord(x: int, y: int):
        None
        # add chord implementation
        # may be useful for efficiency solves, otherwise low priority
            