import {DISPLAYED_FILMS_IN_MENU} from "../const";
import AbstractComponent from "./abstract-component";

const createSiteMenuTemplate = (films) => {
  let filterCounts = new Map();
  filterCounts.set(`watchlist`, 0);
  filterCounts.set(`history`, 0);
  filterCounts.set(`favorites`, 0);

  films.forEach((it) => {
    for (const pair of filterCounts) {
      const key = pair[0];
      const value = pair[1];
      filterCounts.set(key, value + it[key]);
    }
  });

  return (`
    <nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        <a href="#watchlist" class="main-navigation__item">Watchlist 
        ${filterCounts.get(`watchlist`) <= DISPLAYED_FILMS_IN_MENU ?
      `<span class="main-navigation__item-count">${filterCounts.get(`watchlist`)}</span>` : ``
    }
        </a>
        <a href="#history" class="main-navigation__item">History 
        ${filterCounts.get(`history`) <= DISPLAYED_FILMS_IN_MENU ?
      `<span class="main-navigation__item-count">${filterCounts.get(`history`)}</span>` : ``
    } 
        </a>
        <a href="#favorites" class="main-navigation__item">Favorites 
        ${filterCounts.get(`favorites`) <= DISPLAYED_FILMS_IN_MENU ?
      `<span class="main-navigation__item-count">${filterCounts.get(`favorites`)}</span></a>` : ``
    } 
        </a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
  `);
};

export default class SiteMenu extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._films);
  }
}
