import Konva from 'konva';
import { CompletionView } from './CompletionView';

export class CompletionController {
    private view: CompletionView;
    private onPlayAgainCallback?: () => void;

    constructor(layer: Konva.Layer, stage: Konva.Stage) {
        this.view = new CompletionView(layer, stage);
    }

    showCompletionScreen(daysTravelled: number): void {
        this.view.render(
            daysTravelled,
            () => this.handlePlayAgain()
        );

        this.view.show();
    }

    private handlePlayAgain(): void {
        this.view.hide();
        if (this.onPlayAgainCallback) {
            this.onPlayAgainCallback();
        }
    }

    setOnPlayAgain(callback: () => void): void {
        this.onPlayAgainCallback = callback;
    }

    hide(): void {
        this.view.hide();
    }
}