import {createElement} from "../util";

const createFooterStatistics = (count) => {
  return `<p>${count.toLocaleString()} movies inside</p>`;
};

export default class Statistics {
  constructor(count) {
    this._filmsCount = count;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatistics(this._filmsCount);
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
