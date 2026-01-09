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
        this.game.mineCount = mineCount
        this.game.safeCellsRemaining = this.game.totalTiles - mineCount
    }

    private randomPlaceMines() {
        // randomly place mines on the grid
        var minesLeft = this.mineCount
        const totalTiles = this.game.grid.gridArea()
        if (minesLeft >= totalTiles) this.game.grid.setAll("hasMine", true)

        for (minesLeft = this.mineCount; minesLeft > 0; minesLeft--) {
            const allCells = this.game.grid.cells.flat()
            const candidates = allCells.filter(c => !c.hasMine)
            const selectedCandidate = candidates[Math.floor(Math.random() * candidates.length)]!

            const random_x = selectedCandidate.x
            const random_y = selectedCandidate.y
            const randomCell = this.game.grid.getCell(random_x,random_y)
            randomCell.hasMine = true
            this.game.revealedList.push([random_x,random_y])
        }
    }
}

//Manually places tiles on a grid given a Game and a list of mine coordinates
export class ManualGame {
    mineList: Coordinate[]
    mineCount: number
    game: Game

    constructor(game: Game, mineList: Coordinate[]) {
        this.game = game
        this.mineList = mineList
        this.mineCount = 0
        this.manualPlaceMines()
        calculateAdjacentMines(this.game)
        this.game.mineCount = this.mineCount
        this.game.safeCellsRemaining = this.game.totalTiles - this.mineCount
    }

    private manualPlaceMines() {
        for (let i = 0; i < this.mineList.length; i++) {
            const coordinate = this.mineList[i]
            const x = coordinate![0]
            const y = coordinate![1]
            const selectedCell = this.game.grid.getCell(x,y)
            
            if (!selectedCell.hasMine && y < this.game.grid.height && x < this.game.grid.width && x >= 0 && y >= 0) {
                selectedCell.hasMine = true
                this.game.revealedList.push([x,y])
                this.mineCount++
            }
        }
    }
}

//Randomly places tiles on a grid given a game difficulty
export class GameDifficulty {
    game: Game
    mineCount: number

    constructor(difficulty: Difficulty, customWidth?: number, customHeight?: number, customMineCount?: number) {
        let width: number
        let height: number
        let mineCount: number

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
        this.mineCount = mineCount
        this.game.mineCount = mineCount
        this.game.safeCellsRemaining = this.game.totalTiles - mineCount
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

export function relocateMine(game: Game, x: number, y: number) {
    const cell = game.grid.getCell(x,y)
    if (!cell.hasMine) return
    const allCells = game.grid.cells.flat()
    const candidates = allCells.filter(c =>
        !c.hasMine && !c.isRevealed && !(c.x === x && c.y === y)
    )
    const selectedCandidate = candidates[Math.floor((Math.random()) * candidates.length)]!

    const random_x = selectedCandidate.x
    const random_y = selectedCandidate.y
    const randomCell = game.grid.getCell(random_x,random_y)

    cell.hasMine = false
    randomCell.hasMine = true
}
