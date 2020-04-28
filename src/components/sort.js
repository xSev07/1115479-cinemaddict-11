import AbstractComponent from "./abstract-component";
import {SortType} from "../const";

const createSortTemplate = (sortType = SortType.DEFAULT) => {
  return (`
    <ul class="sort">
      <li><a href="#" class="sort__button ${sortType === SortType.DEFAULT ? `sort__button--active` : ``}" data-sort="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button ${sortType === SortType.DATE ? `sort__button--active` : ``}" data-sort="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button ${sortType === SortType.RATING ? `sort__button--active` : ``}" data-sort="${SortType.RATING}">Sort by rating</a></li>
    </ul>
  `);
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
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
