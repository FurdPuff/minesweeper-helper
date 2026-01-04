//Cell data
export type Cell = {
    hasMine: boolean
    isRevealed: boolean
    isFlagged: boolean
    adjacentMines: number
}

//Coordinate type
export type Coordinate = [number, number]

//Difficulty names
export type Difficulty = "Beginner" | "Intermediate" | "Expert"