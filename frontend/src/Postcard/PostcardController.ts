import { PostcardModel } from "./PostcardModel";
import { PostcardView } from "./PostcardView";

export class PostcardController {
  private model: PostcardModel;
  private view: PostcardView;

  constructor(model: PostcardModel, view: PostcardView) {
    this.model = model;
    this.view = view;

    this.view.setClickHandler(() => this.handleCardClick());
    this.view.setCloseHandler(() => this.handleCloseClick());
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
  }

  private updateView(): void {
    this.view.render(this.model);
  }

  destroy(): void {
    this.view.destroy();
  }
}
