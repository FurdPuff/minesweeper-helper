import { Game } from './game'
import { RandomGame } from './placements'
import { ManualGame } from './placements'

//Creating randomly generated game
const randomGame = new RandomGame(4, 5, 8)

//initial
console.log("Initial random game grid: ")
console.log(randomGame.game.grid.cells)

//after flagging (0,0)
randomGame.game.toggleFlag(0,0)
console.log("Flagging (0,0):")
console.log(randomGame.game.grid.cells)

//after revealling (2,3) and (0,4)
randomGame.game.revealCell(2,3)
randomGame.game.revealCell(0,4)
console.log("Revealling (2,3) and (0,4)")
console.log(randomGame.game.grid.cells)


//Creating manually generated game
const manualGame = new ManualGame(7, 7, [[0,0],[4,0],[0,1],[3,2],[5,2],[5,3],[1,4],[4,4],[5,4],[0,5],[2,5],[0,6]])

//initial
console.log("Initial manual game grid: ")
console.log(manualGame.game.grid.cells)

//after revealling 6,6
manualGame.game.revealCell(6,6)
console.log("Revealling (6,6)")
console.log(manualGame.game.grid.cells)

//after flagging (4,4) and (2,5)
manualGame.game.toggleFlag(4,4)
manualGame.game.toggleFlag(2,5)
console.log("Flagging (4,4) and (2,5)")
console.log(manualGame.game.grid.cells)

//after chording (3,5)
manualGame.game.chordCell(3,5)
console.log("Chording (3,5)")
console.log(manualGame.game.grid.cells)