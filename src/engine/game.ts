import type { Cell } from './cell.ts'
import { Grid } from './grid.ts'

export class Game {
    grid: Grid
    mineCount: number
    isGameOver: boolean = false
    isGameWon: boolean = false

    constructor(width: number, height: number, mines: number) {
        this.grid = new Grid(width,height)
        this.mineCount = mines
        this.placeMines()
        this.calculateAdjacentMines()
    }

    private placeMines() {
        // randomly place mines on the grid
        for (let minesLeft = this.mineCount; minesLeft > 0; ) {
            const random_y = Math.floor(Math.random() * this.grid.height)
            const random_x = Math.floor(Math.random() * this.grid.width)
            const randomCell = this.grid.cells[random_y][random_x]

            if (randomCell.hasMine) continue
            randomCell.hasMine = true
            minesLeft--
        }
    }

    private calculateAdjacentMines() {
        // calculate adjacent mines for each cell on the grid
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const cell = this.grid.cells[y][x]
                if (!cell.hasMine) continue
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dy === 0 && dx === 0) continue
                        const ny = y + dy
                        const nx = x + dx

                        if (ny >= 0 && ny < this.grid.height && nx >= 0 && nx < this.grid.width) {
                            const neighborCell = this.grid.cells[ny][nx]
                            neighborCell.adjacentMines++
                        }
                    }
                }
            }
        }
    }

    revealCell(x: number, y: number) {
        // reveal a cell, flood fill zeros
        const cell = this.grid.cells[y][x]
        if (cell.isRevealed || cell.isFlagged) return
        cell.isRevealed = true
        if (cell.hasMine) {
            this.isGameOver = true
            return
        }
        if (cell.adjacentMines !== 0) return
        
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) continue
                const ny = y + dy
                const nx = x + dx

                if (ny >= 0 && ny < this.grid.height && nx >= 0 && nx < this.grid.width) {
                    const neighborCell = this.grid.cells[ny][nx]
                    this.revealCell(nx,ny)
                }
            }
        }
    }

    toggleFlag(x: number, y: number) {
        // toggle flag on a cell
        const cell = this.grid.cells[y][x]
        if (cell.isRevealed) return

        cell.isFlagged = !cell.isFlagged
    }

    chordCell(x: number, y: number) {
        // chord a cell if conditions are met
        const cell = this.grid.cells[y][x]
        if (!cell.isRevealed) return
        
        var adjacentFlags = 0
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) continue
                const ny = y + dy
                const nx = x + dx

                if (ny >= 0 && ny > this.grid.height && nx >= 0 && nx < this.grid.width) {
                    const neighborCell = this.grid.cells[ny][nx]
                    if (neighborCell.isFlagged) adjacentFlags++
                }
            }
        }
        if (adjacentFlags !== cell.adjacentMines) return
        
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) continue
                const ny = y + dy
                const nx = x + dx

                if (ny >= 0 && ny > this.grid.height && nx >= 0 && nx < this.grid.width) {
                    const neighborCell = this.grid.cells[ny][nx]
                    if (neighborCell.isFlagged || neighborCell.isRevealed) continue
                    this.revealCell(nx,ny)
                }
            }
        }
    }
}