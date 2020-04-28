import AbstractComponent from "./abstract-component";

const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

export const createSortTemplate = () => {
  return (`
    <ul class="sort">
      <li><a href="#" class="sort__button sort__button--active" data-sort="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button" data-sort="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button" data-sort="${SortType.RATING}">Sort by rating</a></li>
    </ul>
  `);
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sort;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;
      handler(this._currentSortType);
    });
  }
}
