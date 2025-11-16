import Konva from 'konva';
import { FlagEmojis } from './data/FlagEmojis';

export class FlagRenderer {
    static createFlag(
        countryId: string,
        x: number,
        y: number,
        size: number,
        isAnswer: boolean,
        gameState: 'playing' | 'correct' | 'wrong',
        onClick: () => void
    ): Konva.Group {
        const group = new Konva.Group({ x, y });

        // Background color
        let bgColor = '#ffffff';
        if (gameState !== 'playing' && isAnswer) {
            bgColor = '#d4edda';
        }

        // Background
        const bg = new Konva.Rect({
            width: size,
            height: size,
            fill: bgColor,
            cornerRadius: 12,
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            shadowBlur: 10,
            shadowOffset: { x: 0, y: 4 },
        });
        group.add(bg);

        // Flag emoji
        const emoji = FlagEmojis[countryId] || '🏳️';
        const flagText = new Konva.Text({
            text: emoji,
            fontSize: size * 0.5,
            width: size,
            height: size,
            align: 'center',
            verticalAlign: 'middle',
        });
        group.add(flagText);

        // Border
        const borderColor = gameState !== 'playing' && isAnswer ? '#28a745' : '#dee2e6';
        const borderWidth = gameState !== 'playing' && isAnswer ? 4 : 2;

        const border = new Konva.Rect({
            width: size,
            height: size,
            stroke: borderColor,
            strokeWidth: borderWidth,
            cornerRadius: 12,
        });
        group.add(border);

        // Interaction only when playing
        if (gameState === 'playing') {
            group.on('mouseenter', () => {
                document.body.style.cursor = 'pointer';
                bg.fill('#e9ecef');
                group.getLayer()?.batchDraw();
            });

            group.on('mouseleave', () => {
                document.body.style.cursor = 'default';
                bg.fill('#ffffff');
                group.getLayer()?.batchDraw();
            });

            group.on('click tap', onClick);
        }

        return group;
    }
}
