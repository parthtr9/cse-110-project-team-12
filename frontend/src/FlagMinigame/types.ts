export type FlagGameState = 'idle' | 'playing' | 'correct' | 'wrong' | 'finished';

export interface FlagGameConfig {
    width?: number;
    height?: number;
    totalRounds?: number;
}