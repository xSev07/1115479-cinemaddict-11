import {DISPLAYED_FILMS_IN_MENU, FilterType} from "../const";
import AbstractComponent from "./abstract-component";
import {transformToFirstCapitalSymbol} from "../utils/common";

const createFilterMarkup = (filter) => {
  const {name, count, checked} = filter;
  const title = `${transformToFirstCapitalSymbol(name)} ${name === FilterType.ALL ? `movies` : ``}`;
  const isChecked = checked ? `main-navigation__item--active` : ``;
  const countMarkup = count > DISPLAYED_FILMS_IN_MENU ? `` : `<span class="main-navigation__item-count">${count}</span>`;

  return `<a href="#${name}" class="main-navigation__item ${isChecked}">${title}${countMarkup}</a>`;
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it)).join(`\n`);

  return (`
    <nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
  `);
};

export default class FilterComponent extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}
