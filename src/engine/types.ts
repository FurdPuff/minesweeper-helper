//Cell data
export type Cell = {
    hasMine: boolean
    isRevealed: boolean
    isFlagged: boolean
    adjacentMines: number
    isTriggeredMine: boolean
    isFirstRevealed: boolean
}

//Coordinate type
export type Coordinate = [number, number]

//Difficulty names
export type Difficulty = "Beginner" | "Intermediate" | "Expert"