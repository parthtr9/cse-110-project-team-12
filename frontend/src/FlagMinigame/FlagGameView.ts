import Konva from 'konva';
import { FlagRenderer } from './FlagRenderer';
import { FlagGameState } from './types';

export class FlagGameView {
    private stage: Konva.Stage;
    private layer: Konva.Layer;
    private overlayLayer: Konva.Layer;
    private width: number;
    private height: number;

    constructor(container: HTMLElement, width: number = 800, height: number = 600) {
        this.width = width;
        this.height = height;

        this.stage = new Konva.Stage({
            container: container as HTMLDivElement,
            width: this.width,
            height: this.height,
        });

        this.layer = new Konva.Layer();
        this.overlayLayer = new Konva.Layer();
        this.stage.add(this.layer);
        this.stage.add(this.overlayLayer);
    }

    render(
        scenario: string,
        answer: string,
        options: string[],
        gameState: FlagGameState,
        round: number,
        totalRounds: number,
        onFlagClick: (countryId: string) => void
    ): void {
        this.layer.destroyChildren();

        // Background
        const bg = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.width,
            height: this.height,
            fill: '#f8f9fa',
        });
        this.layer.add(bg);

        // Round indicator
        const roundText = new Konva.Text({
            x: 20,
            y: 20,
            text: `Round ${round}/${totalRounds}`,
            fontSize: 18,
            fontFamily: 'Arial',
            fill: '#6c757d',
        });
        this.layer.add(roundText);

        // Scenario text
        const scenarioText = new Konva.Text({
            x: 50,
            y: 60,
            width: this.width - 100,
            text: `${scenario} ${answer}.`,
            fontSize: 24,
            fontFamily: 'Arial',
            fill: '#2c3e50',
            align: 'center',
            wrap: 'word',
        });
        this.layer.add(scenarioText);

        // Instructions or feedback
        if (gameState === 'playing') {
            const instructions = new Konva.Text({
                x: 50,
                y: 130,
                width: this.width - 100,
                text: 'Help her identify the correct flag:',
                fontSize: 16,
                fontFamily: 'Arial',
                fill: '#7f8c8d',
                align: 'center',
            });
            this.layer.add(instructions);
        } else if (gameState === 'correct') {
            const feedback = new Konva.Text({
                x: 50,
                y: 130,
                width: this.width - 100,
                text: 'Correct! Mei Mei approves.',
                fontSize: 24,
                fontFamily: 'Arial',
                fill: '#28a745',
                align: 'center',
                fontStyle: 'bold',
            });
            this.layer.add(feedback);
        } else if (gameState === 'wrong') {
            const feedback = new Konva.Text({
                x: 50,
                y: 130,
                width: this.width - 100,
                text: `Not quite!`,
                fontSize: 20,
                fontFamily: 'Arial',
                fill: '#dc3545',
                align: 'center',
                fontStyle: 'bold',
            });
            this.layer.add(feedback);
        }

        // Flags in 2x2 grid
        const flagSize = 180;
        const spacing = 20;
        const startX = (this.width - (2 * flagSize + spacing)) / 2;
        const startY = 200;

        options.forEach((countryId, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const x = startX + col * (flagSize + spacing);
            const y = startY + row * (flagSize + spacing);

            const isAnswer = countryId === answer;
            const playingState = gameState === 'playing' ? 'playing' :
                gameState === 'correct' ? 'correct' : 'wrong';

            const flagGroup = FlagRenderer.createFlag(
                countryId,
                x,
                y,
                flagSize,
                isAnswer,
                playingState,
                () => onFlagClick(countryId)
            );

            this.layer.add(flagGroup);
        });

        this.layer.draw();
    }

    showFinishScreen(score: number, totalRounds: number): void {
        this.layer.destroyChildren();

        const bg = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.width,
            height: this.height,
            fill: '#f8f9fa',
        });
        this.layer.add(bg);

        const scoreText = new Konva.Text({
            x: 50,
            y: 250,
            width: this.width - 100,
            text: `Score: ${score}/${totalRounds}`,
            fontSize: 36,
            fontFamily: 'Arial',
            fill: '#667eea',
            align: 'center',
        });
        this.layer.add(scoreText);

        const percentage = Math.round((score / totalRounds) * 100);
        let message = '';
        if (percentage === 100)
            message = '🎉 Mei Mei is amazed!';
        else if (percentage >= 80)
            message = '🌟 Mei Mei is impressed!';
        else if (percentage >= 60)
            message = '👍 Mei Mei gives you a nod of approval.';
        else
            message = '😢 Mei Mei is disappointed...';


        const messageText = new Konva.Text({
            x: 50,
            y: 320,
            width: this.width - 100,
            text: message,
            fontSize: 28,
            fontFamily: 'Arial',
            fill: '#7f8c8d',
            align: 'center',
        });
        this.layer.add(messageText);

        this.layer.draw();
    }

    showInstructions(onClose: () => void): void {
        this.overlayLayer.destroyChildren();

        // Semi-transparent background
        const overlay = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.width,
            height: this.height,
            fill: 'rgba(0, 0, 0, 0.7)',
        });
        this.overlayLayer.add(overlay);

        // Modal box
        const modalWidth = 500;
        const modalHeight = 400;
        const modalX = (this.width - modalWidth) / 2;
        const modalY = (this.height - modalHeight) / 2;

        const modal = new Konva.Rect({
            x: modalX,
            y: modalY,
            width: modalWidth,
            height: modalHeight,
            fill: '#ffffff',
            cornerRadius: 10,
            shadowColor: 'black',
            shadowBlur: 20,
            shadowOpacity: 0.3,
        });
        this.overlayLayer.add(modal);

        // Title
        const title = new Konva.Text({
            x: modalX,
            y: modalY + 30,
            width: modalWidth,
            text: 'Guess the Flag!',
            fontSize: 28,
            fontFamily: 'Arial',
            fill: 'black',
            align: 'center',
            fontStyle: 'bold',
        });
        this.overlayLayer.add(title);

        // Instructions text
        const instructions = `Mei Mei is visiting different countries and needs your help identifying their flags! Click on the flag that matches the country Mei Mei is visiting. Good luck!`;

        const instructionsText = new Konva.Text({
            x: modalX + 40,
            y: modalY + 90,
            width: modalWidth - 80,
            text: instructions,
            fontSize: 16,
            fontFamily: 'Arial',
            fill: '#2c3e50',
            lineHeight: 1.6,
        });
        this.overlayLayer.add(instructionsText);

        // Start button
        const buttonWidth = 120;
        const buttonHeight = 40;
        const buttonX = modalX + (modalWidth - buttonWidth) / 2;
        const buttonY = modalY + modalHeight - 70;

        const closeButton = new Konva.Rect({
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight,
            fill: 'white',
            cornerRadius: 5,
            shadowColor: 'black',
            shadowBlur: 5,
            shadowOpacity: 0.5,
        });

        const buttonText = new Konva.Text({
            x: buttonX,
            y: buttonY + 12,
            width: buttonWidth,
            text: 'Start',
            fontSize: 16,
            fontFamily: 'Arial',
            fill: 'black',
            align: 'center',
            fontStyle: 'bold',
        });

        closeButton.on('mouseenter', () => {
            closeButton.fill('green');
            this.overlayLayer.draw();
            document.body.style.cursor = 'pointer';
        });

        closeButton.on('mouseleave', () => {
            closeButton.fill('white');
            this.overlayLayer.draw();
            document.body.style.cursor = 'default';
        });

        closeButton.on('click', () => {
            this.overlayLayer.destroyChildren();
            this.overlayLayer.draw();
            document.body.style.cursor = 'default';
            onClose();
        });

        buttonText.on('click', () => {
            this.overlayLayer.destroyChildren();
            this.overlayLayer.draw();
            document.body.style.cursor = 'default';
            onClose();
        });

        this.overlayLayer.add(closeButton);
        this.overlayLayer.add(buttonText);

        this.overlayLayer.draw();
    }

    destroy(): void {
        this.stage.destroy();
    }
}