export type Cell = {
    hasMine: boolean
    isRevealed: boolean
    isFlagged: boolean
    adjacentMines: number
}

export type Coordinate = [number, number]