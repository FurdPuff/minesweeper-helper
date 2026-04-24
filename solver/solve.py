# solve.py provides functions that solve a given minesweeper board

from board import Board, Cell

# apply_basic_solve(board) applies basic minesweeper algorithm to iteratively solve a board, 
#    returning true if the board has been solved and false otherwise.
# time: O(n^2) where n is the number of unknown tiles
def apply_basic_solve(board: Board) -> bool:
    while (True):
        revealed_cells: list[Cell] = board.revealed_cells
        if len(revealed_cells) == total_cells - board.mine_count: break

        total_cells = board.size
        has_changed = False
        
        # solve each cell
        for cell in revealed_cells:
            # counts number of neighboring flags, safe cells, and unknown cells
            neighbor_safe_count = 0
            neighbor_flag_count = 0
            for dy in range(-1, 1):
                for dx in range(-1, 1):
                    if dy == 0 and dx == 0: continue
                    ny = cell.y + dy
                    nx = cell.x + dx
                    if ny < 0 or nx < 0 or ny >= board.height or nx >= board.width: continue

                    neighbor_cell = board.get_cell(nx, ny)
                    if neighbor_cell.revealed: neighbor_safe_count += 1
                    if neighbor_cell.flagged: neighbor_flag_count += 1
            neighbor_unknown_count = 8 - neighbor_safe_count - neighbor_flag_count

            # solves when cell has adjacent unknown cells
            if neighbor_unknown_count > 0:
                # flag unknown neighbors if the number of unknown cells matches the number of
                #    remaining flags
                if neighbor_unknown_count + neighbor_flag_count == cell.number: 
                    for dy in range(-1, 1):
                        for dx in range(-1, 1):
                            if dy == 0 and dx == 0: continue
                            if dy == 0 and dx == 0: continue
                            ny = cell.y + dy
                            nx = cell.x + dx
                            if ny < 0 or nx < 0 or ny >= board.height or nx >= board.width: continue
                            board.actions.flag(nx, ny)
                    neighbor_unknown_count = 0
                    neighbor_flag_count = cell.number
                    has_changed = True
                
                # reveal unknown neighbors if neighboring mines are already flagged
                elif neighbor_flag_count == cell.number:
                    for dy in range(-1, 1):
                        for dx in range(-1, 1):
                            if dy == 0 and dx == 0: continue
                            if dy == 0 and dx == 0: continue
                            ny = cell.y + dy
                            nx = cell.x + dx
                            if ny < 0 or nx < 0 or ny >= board.height or nx >= board.width: continue
                            board.actions.reveal(nx, ny)
                    neighbor_unknown_count = 0
                    neighbor_safe_count = 8 - cell.number
                    has_changed = True
        
        # check if board has not been solved by basic algorithm
        if not has_changed:
            return False
    return True