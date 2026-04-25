# run.py handles the interaction between the solver and html file

from fastapi import FastAPI, WebSocket
from solve import apply_basic_solve
from board import Board, Cell, MoveLocation
import asyncio
import json

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()

    while True:
        data = await ws.receive_json()

        if data["type"] == "board_state":
            board = Board(
                data["width"], 
                data["height"], 
                data["mineCount"], 
                data["isFirstMove"]
                )
            board.insert_cells([
                Cell(
                    cell["x"],
                    cell["y"],
                    cell["revealed"],
                    cell["flagged"],
                    cell["number"]
                    )
                    for row in data["cells"] for cell in row])
            
            # Empty board case (assume safe first tile)
            if board.is_first_move: 
                cell = board.get_cell(0, 0)
                # move = MoveLocation("reveal", cell)
                # board.is_first_move = False
                # cell.revealed = True
                # await ws.send_json({
                #     "action": move.action,
                #     "x": move.cell.x,
                #     "y": move.cell.y
                # })
            else:
                # Basic solve
                move_list = apply_basic_solve(board)
                for move in move_list:
                    cell = board.get_cell(move.cell.x, move.cell.y)
                    if move.action == "reveal":
                        cell.revealed = True
                    elif move.action == "flag":
                        cell.flagged = True
                    await ws.send_json({
                        "action": move.action,
                        "x": move.cell.x,
                        "y": move.cell.y
                    })
