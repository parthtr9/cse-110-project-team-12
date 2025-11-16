import { FlagGameModel } from './FlagGameModel';
import { FlagGameView } from './FlagGameView';
import { FlagGameConfig, FlagGameState } from './types';

export class FlagGameController {
    private model: FlagGameModel;
    private view: FlagGameView;
    private gameState: FlagGameState;
    private config: FlagGameConfig;
    private autoAdvanceTimeout: number | null = null;
    private overlay: HTMLDivElement;
    private modalContainer: HTMLDivElement;

    constructor(config: FlagGameConfig = {}) {
        this.config = {
            width: 800,
            height: 600,
            totalRounds: 5,
            ...config
        };

        // Create overlay and modal
        this.overlay = this.createOverlay();
        this.modalContainer = this.createModal();

        this.model = new FlagGameModel(this.config.totalRounds);
        this.view = new FlagGameView(
            this.modalContainer,
            this.config.width,
            this.config.height
        );
        this.gameState = 'idle';
    }

    private createOverlay(): HTMLDivElement {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.display = 'none';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.destroy();
            }
        });

        return overlay;
    }

    private createModal(): HTMLDivElement {
        const modal = document.createElement('div');
        modal.style.backgroundColor = 'white';
        modal.style.borderRadius = '20px';
        modal.style.padding = '20px';
        modal.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)';
        modal.style.position = 'relative';

        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '10px';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '30px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.color = '#999';
        closeBtn.style.lineHeight = '1';
        closeBtn.style.padding = '0';
        closeBtn.style.width = '30px';
        closeBtn.style.height = '30px';

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.color = '#333';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.color = '#999';
        });
        closeBtn.addEventListener('click', () => {
            this.destroy();
        });

        modal.appendChild(closeBtn);
        return modal;
    }

    start(): void {
        // Add to DOM
        document.body.appendChild(this.overlay);
        this.overlay.appendChild(this.modalContainer);

        // Show overlay
        this.overlay.style.display = 'flex';

        // Start game
        this.model.reset();
        this.gameState = 'playing';
        this.startNewRound();
    }

    private startNewRound(): void {
        if (this.model.isGameComplete()) {
            this.finishGame();
            return;
        }

        this.model.startNewRound();
        this.gameState = 'playing';
        this.render();
    }

    private handleFlagClick(countryId: string): void {
        if (this.gameState !== 'playing') return;

        const isCorrect = this.model.checkAnswer(countryId);
        this.gameState = isCorrect ? 'correct' : 'wrong';

        this.render();

        // Auto-advance after 2 seconds
        this.autoAdvanceTimeout = window.setTimeout(() => {
            this.startNewRound();
        }, 2000);
    }

    private render(): void {
        this.view.render(
            this.model.getScenario(),
            this.model.getAnswer(),
            this.model.getOptions(),
            this.gameState,
            this.model.getRound(),
            this.model.getTotalRounds(),
            (countryId) => this.handleFlagClick(countryId)
        );
    }

    private finishGame(): void {
        this.gameState = 'finished';
        this.view.showFinishScreen(
            this.model.getScore(),
            this.model.getTotalRounds()
        );

        // Auto-close after 4 seconds
        setTimeout(() => {
            this.destroy();
        }, 4000);
    }

    destroy(): void {
        if (this.autoAdvanceTimeout) {
            clearTimeout(this.autoAdvanceTimeout);
        }
        this.view.destroy();

        // Remove from DOM
        if (this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
    }
}