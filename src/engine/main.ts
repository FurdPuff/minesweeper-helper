import { Grid } from './grid.ts'
import { Game } from './game.ts'

const game1 = new Game(4, 5, 5)

//initial
console.log("Initial grid: (4x5 grid)")
console.log(game1.grid.cells)

//after flagging 0,0
game1.toggleFlag(0,0)
console.log("Flagging 0,0:")
console.log(game1.grid.cells)

//after revealling 2,3 and 0,4
game1.revealCell(2,3)
game1.revealCell(0,4)
console.log("Revealling 2,3 and 0,4")
console.log(game1.grid.cells)