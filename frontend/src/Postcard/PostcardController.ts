import { PostcardModel } from "./PostcardModel";
import { PostcardView } from "./PostcardView";

export class PostcardController {
  private model: PostcardModel;
  private view: PostcardView;
  private onClose: (() => void) | null = null;
  private onTravel: (() => void) | null = null;
  constructor(model: PostcardModel, view: PostcardView, onClose?: () => void, onTravel?: () => void) {
    this.model = model;
    this.view = view;
    this.onClose = onClose ?? null;
    this.onTravel = onTravel ?? null;

    this.view.setClickHandler(() => this.handleCardClick());
    this.view.setCloseHandler(() => this.handleCloseClick());
    this.view.setTravelHandler(() => this.handleTravelClick());
    this.updateView();
  }

  private handleCardClick(): void {
    if (this.model.getIsMinimized()) {
      this.model.toggleMinimize();
    } else {
      this.model.flip();
    }
    this.updateView();
  }

  private handleCloseClick(): void {
    this.model.toggleMinimize();
    this.updateView();
    if (this.onClose) this.onClose();
  }

  private handleTravelClick(): void {
    // Default behavior: minimize card and notify coordinator to start travel
    this.model.toggleMinimize();
    this.updateView();
    if (this.onTravel) this.onTravel();
  }

  private updateView(): void {
    this.view.render(this.model);
  }

  destroy(): void {
    this.view.destroy();
  }
}
