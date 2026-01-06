//Cell data
export type Cell = {
    x: number
    y: number
    hasMine: boolean
    isRevealed: boolean
    isFlagged: boolean
    adjacentMines: number
    isTriggeredMine: boolean
}

//Coordinate type
export type Coordinate = [number, number]

//Difficulty names
export type Difficulty = "Beginner" | "Intermediate" | "Expert"