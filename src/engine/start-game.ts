import { Game } from './game.js'
import { GameDifficulty, RandomGame, ManualGame } from './placements.js'
import { Coordinate, Difficulty } from './types.js'
import { Buttons } from './buttons.js'

//Start the game
export function startGame (options:
    {type: "Random"; mineCount: number; width: number; height: number} |
    {type: "Manual"; mineList: Coordinate[]; width: number; height: number} |
    {type: "Difficulty"; difficulty: Difficulty; width?: number; height?: number}) {
    
    let game: Game
    let flagsLeft: number
    let totalSafeTiles: number
    let revealedTiles = 0

    switch (options.type) {
        case "Random":
            game = new Game(options.width, options.height)
            const rg = new RandomGame(game, options.mineCount)
            flagsLeft = rg.mineCount
            totalSafeTiles = game.grid.gridArea() - rg.mineCount
            break
        case "Manual":
            game = new Game(options.width, options.height)
            const mg = new ManualGame(game, options.mineList)
            flagsLeft = mg.mineList.length
            totalSafeTiles = game.grid.gridArea() - mg.mineCount
            break
        case "Difficulty":
            const gd = new GameDifficulty(options.difficulty)
            game = gd.game
            flagsLeft = gd.mineCount
            totalSafeTiles = game.grid.gridArea() - gd.mineCount
            break
    }

    const cellSize = 50
    const boardWidth = game.grid.width * cellSize
    const boardHeight = game.grid.height * cellSize

    const board = document.getElementById("board")!
    board.style.width = `${boardWidth}px`;
    board.style.height = `${boardHeight}px`;    
    board.innerHTML = ""

    document.getElementById("flags-display")?.remove()
    const flagsDisplay = document.createElement("h1")
    flagsDisplay.id = "flags-display"
    flagsDisplay.textContent = `Flags left: ${flagsLeft}`
    document.body.appendChild(flagsDisplay)

    document.getElementById("game-over")?.remove()
    const gameOver = document.createElement("h1")
    gameOver.id = "game-over"
    gameOver.textContent = `Is the game over?: ${game.isGameOver}`
    document.body.appendChild(gameOver)

    document.getElementById("game-won")?.remove()
    const gameWon = document.createElement("h1")
    gameWon.id = "game-won"
    gameWon.textContent = `${game.isGameOver}`
    document.body.appendChild(gameWon)

    //Rendering the game
    function render() {
        board.innerHTML = ""
        revealedTiles = 0

        for (let y = 0; y < game.grid.height; y++){
            for (let x = 0; x < game.grid.width; x++) {
                const cell = game.grid.getCell(x,y)
                const div = document.createElement("div")
                div.style.width = `${cellSize}px`;
                div.style.height = `${cellSize}px`;
                const mines = cell.adjacentMines

                if (cell.isRevealed) revealedTiles++

                //Player interaction event listeners:
                
                //Reveal tile
                div.addEventListener(Buttons.reveal.event, (e) => {
                    if (game.isGameOver) return
                    if (cell.hasMine) cell.isTriggeredMine = true
                    game.revealCell(x,y)
                    render()
                })

                //Toggle flag
                div.addEventListener(Buttons.flag.event, (e) => {
                    e.preventDefault()
                    if (game.isGameOver) return
                    if (cell.isFlagged) flagsLeft++
                    else if (!cell.isRevealed) flagsLeft--
                    game.toggleFlag(x,y)
                    render()
                })

                //Chord cell attempt
                div.addEventListener(Buttons.chord.event, (e: Event) => {
                    if (game.isGameOver) return
                    if ((e as MouseEvent).button === Buttons.chord.button) {
                        game.chordCell(x, y)
                        render()
                    }
                })

                if (totalSafeTiles === revealedTiles) {
                    game.isGameWon = true
                    game.isGameOver = true
                } 

                if (cell.isRevealed) {
                    div.classList.add("isRevealed")
                    if (cell.hasMine) { 
                        if (cell.hasMine && cell.isTriggeredMine) {
                            div.classList.add("isTriggeredMine")
                        }
                        div.innerHTML = '<img src="/public/images/mine.png" alt="Mine" width="35" height="35"/>'
                        div.ondragstart = function() { return false; };
                        game.isGameOver = true
                        game.grid.setAllWhere("isRevealed", true, {"hasMine": true, "isFlagged": false})
                    }
                    else {
                        div.textContent = mines === 0 ? "" : String(mines)
                        if (mines !== 0) div.classList.add("x" + mines)
                    }
                } else if (cell.isFlagged) {
                    div.innerHTML = '<img src="/public/images/flag.svg" alt="Flag" width="40" height="40"/>'
                    div.classList.add("isFlagged")
                    div.ondragstart = function() { return false; };
                }

                board.appendChild(div)
            }
        }
        
        flagsDisplay.textContent = `Flags left: ${flagsLeft}`
        gameOver.textContent = `Is the game over?: ${game.isGameOver ? "Yes": "No"}`
        if (game.isGameOver) {
            gameWon.textContent = `${game.isGameWon ? "You win!": "You lost :("}`
        }
    }

    console.log('Start Game clicked — rendering board')
    render()
}