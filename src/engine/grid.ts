import type { Cell } from './cell.ts'

export class Grid {
    width: number
    height: number
    cells: Cell[][]

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
        this.cells = this.createGrid()
    }

    private createGrid(): Cell[][] {
        const grid: Cell[][] = []
        for (let y = 0; y < this.height; y++) {
            const row: Cell[] = []
            for (let x = 0; x < this.width; x++) {
                row.push({ hasMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0})
            }
            grid.push(row)
        }
        return grid
    }
}