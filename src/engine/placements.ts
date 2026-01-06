import { Game } from './game.js'
import type { Coordinate, Difficulty } from './types.js'

//Randomly places tiles on a grid given a Game and a mine count
export class RandomGame {
    mineCount: number
    game: Game
    
    constructor(game: Game, mineCount: number) {
        this.game = game
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
            const randomCell = this.game.grid.getCell(random_x,random_y)

            if (!randomCell.hasMine) {
                randomCell.hasMine = true
                minesLeft--
            }
        }
    }
}

//Manually places tiles on a grid given a Game and a list of mine coordinates
export class ManualGame {
    mineList: Coordinate[]
    game: Game

    constructor(game: Game, mineList: Coordinate[]) {
        this.game = game
        this.mineList = mineList
        this.manualPlaceMines()
        calculateAdjacentMines(this.game)
    }

    private manualPlaceMines() {
        for (let i = 0; i < this.mineList.length; i++) {
            const coordinate = this.mineList[i]
            const x = coordinate![0]
            const y = coordinate![1]
            const selectedCell = this.game.grid.getCell(x,y)
            
            if (!selectedCell.hasMine && y < this.game.grid.height && x < this.game.grid.width && x >= 0 && y >= 0) {
                selectedCell.hasMine = true
            }
        }
    }
}

//Randomly places tiles on a grid given a game difficulty
export class GameDifficulty {
    game: Game

    constructor(difficulty: Difficulty, customWidth?: number, customHeight?: number, customMineCount?: number) {
        let width!: number
        let height!: number
        let mineCount!: number

        switch (difficulty) {
            case "Beginner":
                width = 9
                height = 9
                mineCount = 10
                break
            case "Intermediate":
                width = 16
                height = 16
                mineCount = 40
                break
            case "Expert":
                width = 30
                height = 16
                mineCount = 99
                break
            default:
                const _exhaustive: never = difficulty
                throw new Error(`Unknown difficulty: ${_exhaustive}`)
        }

        this.game = new Game(width, height)
        new RandomGame(this.game, mineCount)
    }
}

// Calculates adjacent mines for each cell on the grid
export function calculateAdjacentMines(game: Game) {
    game.grid.setAll("adjacentMines", 0)
    for (let y = 0; y < game.grid.height; y++) {
        for (let x = 0; x < game.grid.width; x++) {
            const cell = game.grid.getCell(x,y)
            if (!cell.hasMine) continue
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dy === 0 && dx === 0) continue
                    const ny = y + dy
                    const nx = x + dx

                    if (ny >= 0 && ny < game.grid.height && nx >= 0 && nx < game.grid.width) {
                        const neighborCell = game.grid.getCell(nx,ny)
                        neighborCell.adjacentMines++
                    }
                }
            }
        }
    }
}