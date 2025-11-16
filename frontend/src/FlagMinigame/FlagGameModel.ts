import { FlagEmojis } from './data/FlagEmojis';
import { Scenarios } from './data/Scenarios';

export class FlagGameModel {
    private countries: string[];
    private currentAnswer: string;
    private currentScenario: string;
    private options: string[];
    private score: number;
    private round: number;
    private totalRounds: number;

    constructor(totalRounds: number = 5) {
        this.countries = Object.keys(FlagEmojis);
        this.currentAnswer = '';
        this.currentScenario = '';
        this.options = [];
        this.score = 0;
        this.round = 0;
        this.totalRounds = totalRounds;
    }

    // Starts a new round of the flag minigame
    startNewRound(): void {
        this.round++;

        // Gets a random flag and scenario to be the right answer
        this.currentScenario = Scenarios[Math.floor(Math.random() * Scenarios.length)];
        this.currentAnswer = this.countries[Math.floor(Math.random() * this.countries.length)];
        this.options = [this.currentAnswer];

        // Gets 3 more flags that are different from the right answer
        while (this.options.length < 4) {
            const randomCountry = this.countries[Math.floor(Math.random() * this.countries.length)];
            if (!this.options.includes(randomCountry)) {
                this.options.push(randomCountry);
            }
        }

        // Shuffles the flags randomly
        for (let i = this.options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.options[i], this.options[j]] = [this.options[j], this.options[i]];
        }
    }

    // Checks if a flag guess is correct
    checkAnswer(selected: string): boolean {
        const correct = selected === this.currentAnswer;
        if (correct) {
            this.score++;
        }
        return correct;
    }

    // Checks if the game if complete
    isGameComplete(): boolean {
        return this.round >= this.totalRounds;
    }

    // Get methods for class fields
    getScenario(): string {
        return this.currentScenario;
    }

    getAnswer(): string {
        return this.currentAnswer;
    }

    getOptions(): string[] {
        return this.options;
    }

    getScore(): number {
        return this.score;
    }

    getRound(): number {
        return this.round;
    }

    getTotalRounds(): number {
        return this.totalRounds;
    }

    // Resets the state of the minigame
    reset(): void {
        this.score = 0;
        this.round = 0;
        this.currentAnswer = '';
        this.currentScenario = '';
        this.options = [];
    }
}