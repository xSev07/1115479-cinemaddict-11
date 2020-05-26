import AbstractComponent from "./abstract-component";

const createShowMoreButtonTemplate = () => {
  return (`
    <button class="films-list__show-more">Show more</button>
  `);
};

export default class ShowMoreButtonComponent extends AbstractComponent {
  getTemplate() {
    return createShowMoreButtonTemplate(this._film);
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
