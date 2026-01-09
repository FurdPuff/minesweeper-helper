class Cell:
    def __init__(self):
        self.revealed = False
        self.flagged = False
        self.number = None #0-8 or None if unrevealed

Board =list[list[Cell]]

# If number == flagged_neighbors then all unrevealed_neighbors = safe

# If number == unrevealed_neighbors then all unrevealed_neighbors = mine

def apply_basic_solve(board):
    for y in (0,3):
        print