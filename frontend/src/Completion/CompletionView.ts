import Konva from 'konva';
import badge1 from './badges/badge1.png'
import badge2 from './badges/badge2.png'
import badge3 from './badges/badge3.png'
import badge4 from './badges/badge4.png'

export class CompletionView {
    private layer: Konva.Layer;
    private stage: Konva.Stage;
    private group: Konva.Group;

    constructor(layer: Konva.Layer, stage: Konva.Stage) {
        this.layer = layer;
        this.stage = stage;
        this.group = new Konva.Group({
            x: 0,
            y: 0,
            visible: false,
        });
    }

    private getBadgeImagePath(days: number): string {
        if (days <= 10) {
            return badge1;
        } else if (days <= 15) {
            return badge2;
        } else if (days <= 20) {
            return badge3;
        } else {
            return badge4;
        }
    }

    render(
        daysTravelled: number,
        onPlayAgain: () => void
    ): void {
        this.group.destroyChildren();

        const width = this.stage.width();
        const height = this.stage.height();
        const badgeImagePath = this.getBadgeImagePath(daysTravelled);

        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: width,
            height: height,
            fill: '#f8f9fa',
        });
        this.group.add(background);

        // Title
        const title = new Konva.Text({
            x: 0,
            y: height * 0.1,  // Moved up slightly
            width: width,
            text: 'You Completed Mei Mei\'s Journey!',
            fontSize: Math.min(56, width * 0.05),  // Responsive font size
            fontFamily: 'Arial',
            fill: '#2c3e50',
            align: 'center',
            fontStyle: 'bold',
            padding: 20,
        });
        this.group.add(title);

        // Calculate dynamic positions based on screen height
        const sectionSpacing = height * 0.08;
        let currentY = height * 0.2;  // Start lower to give title more space

        // Days travelled display
        const daysLabel = new Konva.Text({
            x: 0,
            y: currentY,
            width: width,
            text: 'Days Travelled',
            fontSize: Math.min(32, width * 0.03),
            fontFamily: 'Arial',
            fill: '#7f8c8d',
            align: 'center',
        });
        this.group.add(daysLabel);

        currentY += daysLabel.height() + 10;  // Add some space after label

        const daysValue = new Konva.Text({
            x: 0,
            y: currentY,
            width: width,
            text: `${daysTravelled}`,
            fontSize: Math.min(72, width * 0.1),
            fontFamily: 'Arial',
            fill: 'black',
            align: 'center',
            fontStyle: 'bold',
        });
        this.group.add(daysValue);

        // Position badge with proper spacing - moved down further
        currentY += daysValue.height() + (sectionSpacing * 2);  // Increased spacing before badge
        const badgeSize = Math.min(200, width * 0.3);  // Responsive badge size
        const badgeY = currentY;
        currentY += badgeSize + (sectionSpacing * 1.5);  // Slightly reduced spacing after badge

        const imageObj = new Image();
        imageObj.onload = () => {
            const badgeImage = new Konva.Image({
                x: width / 2 - badgeSize / 2,
                y: badgeY - badgeSize / 2,
                image: imageObj,
                width: badgeSize,
                height: badgeSize,
            });
            this.group.add(badgeImage);
            this.layer.draw();
        };
        imageObj.src = badgeImagePath;

        // Play Again button - positioned lower
        const buttonWidth = Math.min(300, width * 0.6);
        const buttonHeight = Math.min(70, height * 0.1);
        const buttonX = (width - buttonWidth) / 2;
        const buttonY = Math.min(currentY + (sectionSpacing * 0.5), height * 0.85);  // Moved down further

        const playAgainBtn = new Konva.Rect({
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight,
            fill: 'green',
            cornerRadius: 35,
            shadowColor: 'rgba(102, 126, 234, 0.4)',
            shadowBlur: 15,
            shadowOffset: { x: 0, y: 5 },
        });

        const playAgainText = new Konva.Text({
            x: buttonX,
            y: buttonY + (buttonHeight / 2) - 12,  // Center text vertically in button
            width: buttonWidth,
            text: 'Play Again',
            fontSize: Math.min(28, buttonWidth * 0.08),
            fontFamily: 'Arial',
            fill: '#ffffff',
            align: 'center',
            fontStyle: 'bold',
        });

        playAgainBtn.on('mouseenter', () => {
            document.body.style.cursor = 'pointer';
            playAgainBtn.fill('#4ba34b');
            this.layer.draw();
        });

        playAgainBtn.on('mouseleave', () => {
            document.body.style.cursor = 'default';
            playAgainBtn.fill('green');
            this.layer.draw();
        });

        playAgainBtn.on('click tap', () => {
            onPlayAgain();
        });

        this.group.add(playAgainBtn);
        this.group.add(playAgainText);
    }

    show(): void {
        this.group.visible(true);
        this.layer.add(this.group);
        this.layer.draw();
    }

    hide(): void {
        this.group.visible(false);
        this.layer.draw();
    }

    getGroup(): Konva.Group {
        return this.group;
    }
}