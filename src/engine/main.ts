import { Game } from './game.js'
import { GameDifficulty, RandomGame, ManualGame } from './placements.js'
import { Coordinate, Difficulty } from './types.js'
import { Buttons } from './buttons.js'

//loading game
document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn")

    //start game on button
    startBtn?.addEventListener("click", () => {
        startGame({type: "Random", mineCount: 9, width: 7, height: 7})
    })
    // auto-start on page load
    startGame({type: "Random", mineCount: 9, width: 7, height: 7})
})

//Start the game
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
            const gd = new GameDifficulty(options.difficulty)
            game = gd.game
            break
    }

    const board = document.getElementById("board")!
    board.innerHTML = ""

    //Rendering the game
    function render() {
        board.innerHTML = ""
        for (let y = 0; y < game.grid.height; y++){
            for (let x = 0; x < game.grid.width; x++) {
                const cell = game.grid.getCell(x,y)
                const div = document.createElement("div")
                const mines = cell.adjacentMines

                div.addEventListener(Buttons.reveal.event, (e) => {
                    game.revealCell(x,y)
                    render()
                })
                div.addEventListener(Buttons.flag.event, (e) => {
                    e.preventDefault()
                    game.toggleFlag(x,y)
                    render()
                })
                div.addEventListener(Buttons.chord.event, (e: Event) => {
                    if ((e as MouseEvent).button === Buttons.chord.button) {
                        game.chordCell(x, y)
                        render()
                    }
                })

                if (cell.isRevealed) {
                    div.classList.add("isRevealed")
                    if (cell.hasMine) { 
                        div.classList.add("isRevealedMine")
                        div.textContent = "M"
                        game.isGameOver = true
                    }
                    else {
                        div.textContent = mines === 0 ? "" : String(mines)
                        if (mines !== 0) div.classList.add("x" + mines)
                    }
                } else if (cell.isFlagged) {
                    div.textContent = "F"
                    div.classList.add("isFlagged")
                }

                board.appendChild(div)
            }
        }
    }

    console.log('Start Game clicked — rendering board')
    render()
}