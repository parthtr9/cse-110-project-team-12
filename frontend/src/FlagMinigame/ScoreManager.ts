export class ScoreManager {
    private static readonly STORAGE_KEY = 'flag_minigame_top_scores';
    private static readonly MAX_SCORES = 5;

    static getTopScores(): number[] {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    static addScore(score: number): void {
        const scores = this.getTopScores();
        scores.push(score);

        // Sort by highest score and keep top 5
        scores.sort((a, b) => b - a);
        const topScores = scores.slice(0, this.MAX_SCORES);

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(topScores));
    }

    static resetScores(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}