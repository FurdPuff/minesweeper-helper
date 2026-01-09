import { Grid } from './grid.js'
import { Coordinate } from './types.js'

//Initialize grid and game logic
export class Game {
    grid: Grid
    isGameWon = false
    isGameOver = false
    isFirstMove = true
    mineCount = 0
    revealedTiles = 0
    totalTiles: number
    safeCellsRemaining = 0
    mineList: Coordinate[] = []
    revealedList: Coordinate[] = []

    constructor(width: number, height: number) {
        this.grid = new Grid(width,height)
        this.totalTiles = this.grid.gridArea()
    }

    //Reveal a cell
    revealCell(x: number, y: number) {
        const cell = this.grid.getCell(x,y)
        if (cell.isRevealed || cell.isFlagged) return
        cell.isRevealed = true
        if (cell.hasMine) {
            this.isGameOver = true
            return
        } else this.safeCellsRemaining--
        this.revealedTiles++
        this.revealedList.push([x,y])
        
        if (this.safeCellsRemaining === 0 && !this.isGameOver) {
            this.isGameOver = true
            this.isGameWon = true
        }
        if (cell.adjacentMines !== 0) return
        
        this.revealNeighbors(x,y)
    }

    //Toggle flag on a cell
    toggleFlag(x: number, y: number) {
        const cell = this.grid.getCell(x,y)
        if (cell.isRevealed) return

        cell.isFlagged = !cell.isFlagged
    }

    //Attempt to chord a cell
    chordCell(x: number, y: number) {
        const cell = this.grid.getCell(x,y)
        if (!cell.isRevealed || cell.isFlagged) return
        
        var adjacentFlags = 0
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) continue
                const ny = y + dy
                const nx = x + dx

                if (ny >= 0 && ny < this.grid.height && nx >= 0 && nx < this.grid.width) {
                    const neighborCell = this.grid.getCell(nx,ny)
                    if (neighborCell.isFlagged) adjacentFlags++
                }
            }
        }
        if (adjacentFlags !== cell.adjacentMines) return
        
        this.revealNeighbors(x,y, {skipFlagged: true, skipRevealed: true})
    }

    //Reveal adjacent "neighbor" cells
    revealNeighbors(x: number,y: number, options?: {skipFlagged?: boolean, skipRevealed?: boolean}) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) continue
                const ny = y + dy
                const nx = x + dx
                if (ny < 0 || ny >= this.grid.height || nx < 0 || nx >= this.grid.width) continue
                const neighborCell = this.grid.getCell(nx,ny)
                const skipFlagged = options?.skipFlagged ?? false
                const skipRevealed = options?.skipRevealed ?? false

                if (skipFlagged && neighborCell.isFlagged) continue
                if (skipRevealed && neighborCell.isRevealed) continue
                this.revealCell(nx,ny)
            }
        }
    }
}