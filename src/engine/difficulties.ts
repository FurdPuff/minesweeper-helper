import { Game } from "./game.js";
import { RandomGame } from "./placements.js";
import { Difficulty } from "./types.js";


export class GameDifficulty {
    game: Game

    constructor(difficulty: Difficulty) {
        let width: number
        let height: number
        let mineCount: number

        switch (difficulty) {
            case "Beginner":
                width = 9
                height = 9
                mineCount = 10
                break
            case "Intermediate":
                width = 16
                height = 16
                mineCount = 40
                break
            case "Expert":
                width = 30
                height = 16
                mineCount = 99
                break
        }

        this.game = new Game(width, height)
        new RandomGame(this.game, mineCount)
    }
}