import { Game } from './game.js'
import { GameDifficulty, RandomGame, ManualGame } from './placements.js'
import { Coordinate, Difficulty } from './types.js'
import { Buttons } from './buttons.js'

//loading game
document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn")
    startBtn?.addEventListener("click", () => {
        const difficultySelect = document.getElementById("difficulty") as HTMLSelectElement
        const selectedDifficulty = difficultySelect.value as Difficulty
        startGame({ type: "Difficulty", difficulty: selectedDifficulty })
    })
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
    const cellSize = 50
    const boardWidth = game.grid.width * cellSize
    const boardHeight = game.grid.height * cellSize

    const board = document.getElementById("board")!
    board.style.width = `${boardWidth}px`;
    board.style.height = `${boardHeight}px`;    
    board.innerHTML = ""

    //Rendering the game
    function render() {
        board.innerHTML = ""

        for (let y = 0; y < game.grid.height; y++){
            for (let x = 0; x < game.grid.width; x++) {
                const cell = game.grid.getCell(x,y)
                const div = document.createElement("div")
                div.style.width = `${cellSize}px`;
                div.style.height = `${cellSize}px`;
                const mines = cell.adjacentMines

                div.addEventListener(Buttons.reveal.event, (e) => {
                    game.revealCell(x,y)
                    if (cell.hasMine) cell.isTriggeredMine = true
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
                        if (cell.hasMine && cell.isTriggeredMine) {
                            div.classList.add("isTriggeredMine")
                        }
                        div.innerHTML = '<img src="/public/images/mine.png" alt="Mine" width="35" height="35"/>'
                        game.isGameOver = true
                        game.grid.setAllWith("isRevealed", true, "hasMine", true)
                    }
                    else {
                        div.textContent = mines === 0 ? "" : String(mines)
                        if (mines !== 0) div.classList.add("x" + mines)
                    }
                } else if (cell.isFlagged) {
                    div.innerHTML = '<img src="/public/images/flag.svg" alt="Flag" width="40" height="40"/>'
                    div.classList.add("isFlagged")
                }

                board.appendChild(div)
            }
        }
    }

    console.log('Start Game clicked — rendering board')
    render()
}