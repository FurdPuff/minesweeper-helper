# solve.py provides functions that solve a given minesweeper board

from board import Board, Cell, MoveLocation
from collections import deque

def apply_basic_solve(board: Board) -> list[MoveLocation]:
    """Basic Minesweeper board solver

    Args:
        board (Board)

    Returns:
        list[MoveLocation]: list of moves made by solver
    
    Time: O(n) where n is the number of unknown tiles
    """

    move_list: list[MoveLocation] = []
    revealed_cells = deque(board.revealed_cells)
    seen = set((cell.x, cell.y) for cell in revealed_cells)

    while revealed_cells:
        cell = revealed_cells.popleft()
        unknown_neighbors = False

        # counts number of neighboring flags, safe cells, and unknown cells
        neighbor_safe_count = 0
        neighbor_flag_count = 0
        neighbor_unknown_count = 0
        for dy in range(-1, 2):
            for dx in range(-1, 2):
                if dy == 0 and dx == 0: continue
                ny = cell.y + dy
                nx = cell.x + dx
                if ny < 0 or nx < 0 or ny >= board.height or nx >= board.width: continue

                neighbor_cell = board.get_cell(nx, ny)
                if neighbor_cell.revealed: neighbor_safe_count += 1
                if neighbor_cell.flagged: neighbor_flag_count += 1
                
                if not neighbor_cell.revealed and not neighbor_cell.flagged: neighbor_unknown_count += 1
                else: unknown_neighbors = True
        
        # breaks loop if the cell does not have unknown neighbors
        if unknown_neighbors: break

        # solves when cell has adjacent unknown cells
        if neighbor_unknown_count > 0:
            # flag unknown neighbors if the number of unknown cells matches the number of
            #    remaining flags
            if neighbor_unknown_count + neighbor_flag_count == cell.number: 
                for dy in range(-1, 2):
                    for dx in range(-1, 2):
                        if dy == 0 and dx == 0: continue
                        ny = cell.y + dy
                        nx = cell.x + dx
                        
                        if ny < 0 or nx < 0 or ny >= board.height or nx >= board.width: continue
                        neighbor_cell = board.get_cell(nx, ny)
                        if neighbor_cell.flagged or neighbor_cell.revealed: continue
                        
                        board.perform_action(move_list, "flag", neighbor_cell)
                        seen.add((nx, ny))
            
            # reveal unknown neighbors if neighboring mines are already flagged
            elif neighbor_flag_count == cell.number:
                for dy in range(-1, 2):
                    for dx in range(-1, 2):
                        if dy == 0 and dx == 0: continue
                        ny = cell.y + dy
                        nx = cell.x + dx

                        if ny < 0 or nx < 0 or ny >= board.height or nx >= board.width: continue
                        neighbor_cell = board.get_cell(nx, ny)
                        if neighbor_cell.flagged or neighbor_cell.revealed: continue
                        
                        if (nx, ny) not in seen:
                            seen.add((nx, ny))
                            board.perform_action(move_list, "reveal", neighbor_cell)
                            revealed_cells.append(neighbor_cell)
    return move_list