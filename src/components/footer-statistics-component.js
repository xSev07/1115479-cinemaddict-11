import AbstractComponent from "./abstract-component";

const createFooterStatistics = (count) => {
  return `<p>${count.toLocaleString()} movies inside</p>`;
};

export default class FooterStatisticsComponent extends AbstractComponent {
  constructor(count) {
    super();
    this._filmsCount = count;
  }

  setFilmsCount(count) {
    this._filmsCount = count;
  }

  getTemplate() {
    return createFooterStatistics(this._filmsCount);
  }
}
