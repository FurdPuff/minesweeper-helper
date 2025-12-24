import { Grid } from './grid'

export class Game {
    grid: Grid
    isGameOver: boolean = false
    isGameWon: boolean = false

    constructor(width: number, height: number) {
        this.grid = new Grid(width,height)
    }

    revealCell(x: number, y: number) {
        // reveal a cell, flood fill zeros
        const cell = this.grid.getCell(x,y)
        if (cell.isRevealed || cell.isFlagged) return
        cell.isRevealed = true
        if (cell.hasMine) {
            this.isGameOver = true
            return
        }
        if (cell.adjacentMines !== 0) return
        
        this.revealNeighbors(x,y)
    }

    toggleFlag(x: number, y: number) {
        // toggle flag on a cell
        const cell = this.grid.getCell(x,y)
        if (cell.isRevealed) return

        cell.isFlagged = !cell.isFlagged
    }

    chordCell(x: number, y: number) {
        // chord a cell if conditions are met
        const cell = this.grid.getCell(x,y)
        if (!cell.isRevealed || cell.isFlagged) return
        
        var adjacentFlags = 0
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) continue
                const ny = y + dy
                const nx = x + dx

                if (ny >= 0 && ny < this.grid.height && nx >= 0 && nx < this.grid.width) {
                    const neighborCell = this.grid.getCell(x,y)
                    if (neighborCell.isFlagged) adjacentFlags++
                }
            }
        }
        if (adjacentFlags !== cell.adjacentMines) return
        
        this.revealNeighbors(x,y, {skipFlagged: true, skipRevealed: true})
    }

    revealNeighbors(x: number,y: number, options?: {skipFlagged?: boolean, skipRevealed?: boolean}) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) continue
                const ny = y + dy
                const nx = x + dx
                const neighborCell = this.grid.getCell(nx,ny)
                const skipFlagged = options!.skipFlagged ?? false
                const skipRevealed = options!.skipRevealed ?? false

                if (skipFlagged && neighborCell.isFlagged) continue
                if (skipRevealed && neighborCell.isRevealed) continue
                this.revealCell(nx,ny)
            }
        }
    }
}