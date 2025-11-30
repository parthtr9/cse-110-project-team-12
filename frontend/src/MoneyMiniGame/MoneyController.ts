import Konva from "konva";
import { MoneyView } from "./MoneyView";
import { MoneyModel } from "./MoneyModel";
import { TIME_LIMIT, WIDTH, HEIGHT } from "./constants";

export class MoneyController {
	
    private gameTimer: number |NodeJS.Timeout| null = null;
    private anim: Konva.Animation;
    private view: MoneyView;
    private model: MoneyModel;
    private overlay: HTMLDivElement;
    private modalContainer: HTMLDivElement;
    private closeBtn : HTMLButtonElement;

	constructor() {

        // Create overlay and modal
        this.overlay = this.createOverlay();
        this.modalContainer = document.createElement("div");
        this.closeBtn = document.createElement("button");
        this.createModal();
        //this.modalContainer = this.createModal();
        var layer= new Konva.Layer();
        var stage = new Konva.Stage({
            container: this.modalContainer as HTMLDivElement,
            width: WIDTH,
            height: HEIGHT,
        });

        this.anim = new Konva.Animation((frame)=>{
            const time = frame.time;
            const timeDiff = frame.timeDiff;
            const frameRate = frame.frameRate;

            if(time % 4 == 0){
                this.view.addMoneyImg();
            }
            let col = this.view.handleCollision();
            this.model.incrementScore(col);
            this.view.updateScore(this.model.getScore());
        
            this.view.updateY();

        
        }, layer);
        this.view = new MoneyView(this.handleNextClick, stage, layer, WIDTH, HEIGHT);
        this.model = new MoneyModel();

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

    private createModal(): void {
        this.modalContainer = document.createElement('div');
        this.modalContainer.style.backgroundColor = 'white';
        this.modalContainer.style.borderRadius = '20px';
        this.modalContainer.style.padding = '20px';
        this.modalContainer.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)';
        this.modalContainer.style.position = 'relative';

        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = 'x';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '100px';
        closeBtn.style.right = '300px';
        closeBtn.style.background = 'red';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '30px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.color = 'black';
        closeBtn.style.lineHeight = '1';
        closeBtn.style.padding = '0';
        closeBtn.style.width = '30px';
        closeBtn.style.height = '30px';
        closeBtn.style.visibility = "visible";


        // closeBtn.addEventListener('mouseenter', () => {
        //     closeBtn.style.color = '#333';
        // });
        // closeBtn.addEventListener('mouseleave', () => {
        //     closeBtn.style.color = 'red';
        // });
        closeBtn.addEventListener('click', () => {
            this.destroy();
        });
        this.closeBtn = closeBtn;
        //this.modalContainer.append(closeBtn);
        //document.body.appendChild(closeBtn);

        //this.modalContainer.appendChild(closeBtn);
        //return modal;
    }
    startGame(): void{
        // Reset model state
		this.model.reset();

        // Add to DOM
        document.body.appendChild(this.overlay);
        this.overlay.appendChild(this.modalContainer);
        document.body.appendChild(this.closeBtn);

        // Show overlay
        this.overlay.style.display = 'flex';

		// Update view
        this.view.displayIntro();
		this.view.show();

    }
    private handleNextClick = () => {
        this.view.updateScore(this.model.getScore());
		this.view.updateTimer(TIME_LIMIT);
        this.view.displayGame();
        this.startTimer();
        this.anim.start();
    }
   
    private stopTimer(): void {
		// TODO: Task 3 - Stop the timer using clearInterval
		if(this.gameTimer){
			clearInterval(this.gameTimer);
			this.gameTimer = null;
		}
	}
    private startTimer(): void {
		// TODO: Task 3 - Implement countdown timer using setInterval
		let timeRemaining : number =  TIME_LIMIT;
		const timerId = setInterval(() => {
			timeRemaining--;
			this.view.updateTimer(timeRemaining);
			if(timeRemaining < 0){
				this.endGame();
			}
			}, 1000);
		this.gameTimer = timerId;

	}
    private endGame(): void {
		this.stopTimer();
        this.anim.stop();
        this.view.displayEndScreen(this.model.getScore());
	}
    getView(): MoneyView {
        return this.view;
    }
    destroy(): void {
        this.view.destroy();

        // Remove from DOM
        if (this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        if(this.closeBtn.parentNode){
            this.closeBtn.parentNode.removeChild(this.closeBtn);
        }
    }

}