import {FilmsQuantity} from "../const";
import {render} from "../utils/render";
import {sortFilms} from "../utils/common";
import Profile from "../components/profile";
import SiteMenu from "../components/site-menu";
import Sort from "../components/sort";
import Films from "../components/films";
import FilmsController from "./films";
import Statistics from "../components/statistics";

export default class PageController {
  constructor(films) {
    this._showingFilmsCount = FilmsQuantity.SHOWING_ON_START;
    this._films = films;
    this._sortedFilms = films;
    this._profileComponent = new Profile();
    this._sortComponent = new Sort();
    this._siteMenuComponent = new SiteMenu(this._films);
    this._filmsComponent = new Films(this._films);
    this._filmsController = new FilmsController(this._filmsComponent);
    this._siteHeaderElement = document.querySelector(`.header`);
    this._siteMainElement = document.querySelector(`.main`);
    this._siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setClickHandler(this._onSortTypeChange);
  }

  render() {
    render(this._siteHeaderElement, this._profileComponent);
    render(this._siteMainElement, this._siteMenuComponent);
    render(this._siteMainElement, this._sortComponent);
    render(this._siteMainElement, this._filmsComponent);

    if (this._films.length > 0) {
      this._filmsController.render(this._films);
    }

    render(this._siteFooterStatisticsElement, new Statistics(this._films.length));
  }

  _onSortTypeChange(sortType) {
    this._sortedFilms = sortFilms(this._films, sortType);
    this._filmsController.renderFilmsAfterSorting(this._sortedFilms, 0, this._showingFilmsCount);
  }
}
