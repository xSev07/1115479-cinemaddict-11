import {createElement} from "../util";

const createFilmsExtraTemplate = (title, additionalClass) => {
  return (`
    <section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>

      <div class="films-list__container ${additionalClass}"></div>
     </section>
  `);
};

export default class FilmsExtra {
  constructor(data) {
    this._title = data.title;
    this._additionalClass = data.additionalClass;
    this._element = null;
  }

  getTemplate() {
    return createFilmsExtraTemplate(this._title, this._additionalClass);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
