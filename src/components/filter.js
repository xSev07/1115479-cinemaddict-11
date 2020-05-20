import {DISPLAYED_FILMS_IN_MENU, FilterType} from "../const";
import {transformToFirstCapitalSymbol} from "../utils/common";
import AbstractSmartComponent from "./abstract-smart-component";

const createFilterMarkup = (filter) => {
  const {name, count, checked} = filter;
  const title = `${transformToFirstCapitalSymbol(name)} ${name === FilterType.ALL ? `movies` : ``}`;
  const isChecked = checked ? `main-navigation__item--active` : ``;
  const countMarkup = (name !== FilterType.ALL && count <= DISPLAYED_FILMS_IN_MENU) ? `<span class="main-navigation__item-count">${count}</span>` : ``;

  return `<a href="#${name}" class="main-navigation__item ${isChecked}" data-filter-type="${name}">${title}${countMarkup}</a>`;
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it)).join(`\n`);

  const hasChecked = filters.findIndex((it) => it.checked);
  const statisticChecked = hasChecked === -1 ? `main-navigation__additional--active` : ``;

  return (`
    <nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional ${statisticChecked}">Stats</a>
    </nav>
  `);
};

export default class FilterComponent extends AbstractSmartComponent {
  constructor(filters) {
    super();
    this._filters = filters;
    this._filterChangeHandler = null;
    this._statisticClickHandler = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandler = handler;
    this.getElement().querySelectorAll(`.main-navigation__item`)
      .forEach((it) => {
        it.addEventListener(`click`, (evt) => {
          const filterName = evt.target.dataset.filterType;
          handler(filterName);
        });
      });
  }

  setStatisticClickHandler(handler) {
    this._statisticClickHandler = handler;
    this.getElement().querySelector(`.main-navigation__additional`)
      .addEventListener(`click`, () => {
        handler();
      });
  }

  recoveryListeners() {
    this.setFilterChangeHandler(this._filterChangeHandler);
    this.setStatisticClickHandler(this._statisticClickHandler);
  }
}
