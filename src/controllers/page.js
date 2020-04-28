import {FilmsQuantity} from "../const";
import {render} from "../utils/render";
import Profile from "../components/profile";
import SiteMenu from "../components/site-menu";
import Sort from "../components/sort";
import Films from "../components/films";
import FilmsController from "./films";
import Statistics from "../components/statistics";
import {SortType} from "../const";

export default class PageController {
  constructor(films) {
    this._profileComponent = new Profile();
    this._sortComponent = new Sort();
    this._films = films;
    this._sortedFilms = films;
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DEFAULT:
        this._sortedFilms = this._films;
        break;
      case SortType.DATE:
        this._sortedFilms = this._films.slice().sort((a, b) => b.releaseDate - a.releaseDate);
        break;
      case SortType.RATING:
        this._sortedFilms = this._films.slice().sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  render() {
    const siteHeaderElement = document.querySelector(`.header`);
    const siteMainElement = document.querySelector(`.main`);
    const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);

    const siteMenuComponent = new SiteMenu(this._films);
    const filmsComponent = new Films(this._films);
    const filmsController = new FilmsController(filmsComponent, this._films);

    render(siteHeaderElement, this._profileComponent);
    render(siteMainElement, siteMenuComponent);
    render(siteMainElement, this._sortComponent);
    render(siteMainElement, filmsComponent);

    if (this._films.length > 0) {
      filmsController.render();
    }

    render(siteFooterStatisticsElement, new Statistics(this._films.length));

    this._sortComponent.setClickHandler((sortType) => {
      const showingFilmsCount = FilmsQuantity.SHOWING_ON_START;
      this._sortFilms(sortType);
      filmsController.renderFilmsAfterSorting(this._sortedFilms, 0, showingFilmsCount);
    });
  }
}
