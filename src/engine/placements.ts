import { Game } from './game.ts'
import type { Coordinate } from './types.ts'

export class RandomGame {
    mineCount: number
    game: Game
    
    constructor(width: number, height: number, mineCount: number) {
        this.game = new Game(width, height)
        this.mineCount = mineCount
        this.randomPlaceMines()
        calculateAdjacentMines(this.game)
    }

    private randomPlaceMines() {
        // randomly place mines on the grid
        var minesLeft = this.mineCount
        const totalTiles = this.game.grid.height * this.game.grid.width
        if (minesLeft >= totalTiles) this.game.grid.setAll("hasMine", true)

        while (minesLeft > 0) {
            const random_y = Math.floor(Math.random() * this.game.grid.height)
            const random_x = Math.floor(Math.random() * this.game.grid.width)
            const randomCell = this.game.grid.cells[random_y][random_x]

            if (!randomCell.hasMine) {
                randomCell.hasMine = true
                minesLeft--
            }
        }
    }
}

export class ManualGame {
    mineList: Coordinate[]
    game: Game

    constructor(width: number, height: number, mineList: Coordinate[]) {
        this.game = new Game(width, height)
        this.mineList = mineList
        this.manualPlaceMines()
        calculateAdjacentMines(this.game)
    }

    private manualPlaceMines() {
        for (let i = 0; i < this.mineList.length; i++) {
            const coordinate = this.mineList[i]
            const x = coordinate[0]
            const y = coordinate[1]
            const selectedCell = this.game.grid.cells[y][x]
            
            if (!selectedCell.hasMine && y < this.game.grid.height && x < this.game.grid.width && x >= 0 && y >= 0) {
                selectedCell.hasMine = true
            }
        }
    }
}

function calculateAdjacentMines(game: Game) {
    // calculate adjacent mines for each cell on the grid
    for (let y = 0; y < game.grid.height; y++) {
        for (let x = 0; x < game.grid.width; x++) {
            const cell = game.grid.cells[y][x]
            if (!cell.hasMine) continue
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dy === 0 && dx === 0) continue
                    const ny = y + dy
                    const nx = x + dx

                    if (ny >= 0 && ny < game.grid.height && nx >= 0 && nx < game.grid.width) {
                        const neighborCell = game.grid.cells[ny][nx]
                        neighborCell.adjacentMines++
                    }
                }
            }
        }
    }
}