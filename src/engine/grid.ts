import type { Cell } from './types.js'

//Create a grid given a width and height
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

    //Get the cell given that it is within bounds
    getCell(x: number, y: number): Cell {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
            throw new Error('Coordinates out of bounds')
        return this.cells[y]![x]!
    }

    //Set the target property of all cells in the grid to the desired value
    setAll<K extends keyof Cell>(property: K, value: Cell[K]) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.getCell(x,y)[property] = value
            }
        }
    }
}