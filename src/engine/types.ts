//Cell data
export type Cell = {
    x: number
    y: number
    hasMine: boolean
    isRevealed: boolean
    isFlagged: boolean
    adjacentMines: number //0-8
    isTriggeredMine: boolean //is a mine and is clicked on
    isIncorrectlyFlagged: boolean
}

//Coordinate type
export type Coordinate = [number, number]

//Difficulty names
export type Difficulty = "Beginner" | "Intermediate" | "Expert"