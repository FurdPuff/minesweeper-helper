import { Difficulty } from './types.js'
import { startGame } from './start-game.js'
import { Game } from './game.js'

const socket = new WebSocket("ws://localhost:8000/ws")

socket.addEventListener('open', () => {
    console.log('Connected to solver server')
})

export type Move = {
    action: "reveal" | "flag" | "chord",
    x: number,
    y: number
}

let solverHandler: ((move: Move) => void) | null = null

socket.addEventListener('message', (event) => {
    const text = event.data

    const data: Move = JSON.parse(text)

    if (solverHandler) {
        solverHandler(data)
    }
    console.log('Received from server:', data)
})

socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event)
})

socket.addEventListener('close', () => {
    console.log('WebSocket closed')
})

export function sendBoardState(game: Game) {
    if (socket.readyState !== WebSocket.OPEN) {
        console.warn('WebSocket not open, cannot send board state')
        return
    }
    socket.send(JSON.stringify({
        type: 'board_state',
        width: game.grid.width,
        height: game.grid.height,
        isFirstMove: game.isFirstMove,
        mineCount: game.mineCount,
        cells: game.grid.cells.map(row =>
            row.map(cell => ({
                x: cell.x,
                y: cell.y,
                revealed: cell.isRevealed,
                flagged: cell.isFlagged,
                number: cell.adjacentMines
            }))
        )
    }))
}

//loading game
document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn")
    startBtn?.addEventListener("click", () => {
        const difficultySelect = document.getElementById("difficulty") as HTMLSelectElement
        
        // remove custom form when difficulty changes to non-Custom
        difficultySelect.addEventListener("change", () => {
            if (difficultySelect.value !== "Custom") {
                const customForm = document.getElementById("custom-form")
                customForm?.remove()
            }
        })
        const selectedDifficulty = difficultySelect.value as Difficulty | "Custom"
        if (selectedDifficulty === "Custom") {
            // reuse existing form if present
            let container = document.getElementById('custom-form') as HTMLDivElement | null
            if (!container) {
                container = document.createElement('div')
                container.id = 'custom-form'
                container.style.margin = '8px'
            } else {
                container.innerHTML = ''
            }

            const width = document.createElement("input")
            width.type = "number"
            width.placeholder = "Width"
            width.min = "1"
            width.value = localStorage.getItem('customWidth') ?? ''

            const height = document.createElement("input")
            height.type = "number"
            height.placeholder = "Height"
            height.min = "1"
            height.value = localStorage.getItem('customHeight') ?? ''

            const mineCount = document.createElement("input")
            mineCount.type = "number"
            mineCount.placeholder = "Mines"
            mineCount.min = "0"
            mineCount.value = localStorage.getItem('customMines') ?? ''

            const startCustom = document.createElement("button")
            startCustom.textContent = "Start Custom"
            startCustom.addEventListener('click', () => {
                const w = Number(width.value)
                const h = Number(height.value)
                const m = Number(mineCount.value)
                if (!Number.isInteger(w) || !Number.isInteger(h) || !Number.isInteger(m) || w <= 0 || h <= 0 || m < 0) {
                    alert('Please enter valid positive integers for width, height, and non-negative mines.')
                    return
                }
                // remember values
                localStorage.setItem('customWidth', String(w))
                localStorage.setItem('customHeight', String(h))
                localStorage.setItem('customMines', String(m))
                
                container?.remove()
                startGame({ type: 'Random', width: w, height: h, mineCount: m },
                    true, (handler) => solverHandler = handler)
            })

            container.append(width, height, mineCount, startCustom)
            
            const startBtnEl = document.getElementById('startBtn')
            startBtnEl?.insertAdjacentElement('afterend', container)
        } else {
            startGame({ type: "Difficulty", difficulty: selectedDifficulty },
                true, (handler) => solverHandler = handler)
        }
    })
})