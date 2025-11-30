
export class MoneyModel{
    private score = 0;

	/**
	 * Reset game state for a new game
	 */
	reset(): void {
		this.score = 0;
	}

	/**
	 * Increment score when based on value passed
	 */
	incrementScore(incr : number = 1): void {
		this.score+= incr;
	}

	/**
	 * Get current score
	 */
	getScore(): number {
		return this.score;
	}
}