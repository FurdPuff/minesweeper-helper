import { GameDifficulty } from './difficulties.js'
import { Game } from './game.js'
import { RandomGame } from './placements.js'
import { ManualGame } from './placements.js'
import { Coordinate, Difficulty } from './types.js'

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn")

    startBtn?.addEventListener("click", () => {
        startGame({type: "Random", mineCount: 9, width: 7, height: 7})
    })
})

function startGame (options:
    {type: "Random"; mineCount: number; width: number; height: number} |
    {type: "Manual"; mineList: Coordinate[]; width: number; height: number} |
    {type: "Difficulty"; difficulty: Difficulty}) {
    
    let game: Game
    switch (options.type) {
        case "Random":
            game = new Game(options.width, options.height)
            new RandomGame(game, options.mineCount)
            break
        case "Manual":
            game = new Game(options.width, options.height)
            new ManualGame(game, options.mineList)
            break
        case "Difficulty":
            game = new Game(7,7)
            new GameDifficulty(options.difficulty)
            break
    }
    const board = document.getElementById("board")!
    board.innerHTML = ""

    function render() {
        board.innerHTML = ""
        for (let y = 0; y < game.grid.height; y++){
            for (let x = 0; x < game.grid.width; x++) {
                const cell = game.grid.getCell(x,y)
                var div = document.createElement("div")
                const mines = cell.adjacentMines

                div.textContent = mines === 0 ? "" : String(mines)
                if (mines !== 0) div.classList.add("x" + mines)
                div.classList.add("isRevealed")
                board.appendChild(div)
            }
        }
    }

    console.log('Start Game clicked — rendering board')
    render()
}