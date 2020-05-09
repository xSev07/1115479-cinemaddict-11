import {FilmsQuantity} from "../const";
import {render} from "../utils/render";
import {sortFilms} from "../utils/common";
import Profile from "../components/profile";
import FilterComponent from "../components/filter";
import Sort from "../components/sort";
import Films from "../components/films";
import FilmsController from "./films";
import FilmsModel from "../models/films";
import FilterController from "../controllers/filter";
import Statistics from "../components/statistics";

export default class PageController {
  constructor(films) {
    this._siteHeaderElement = document.querySelector(`.header`);
    this._siteMainElement = document.querySelector(`.main`);
    this._siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);
    this._showingFilmsCount = FilmsQuantity.SHOWING_ON_START;
    this._films = films;
    this._sortedFilms = films;
    this._filmsModel = new FilmsModel(this._films);
    this._profileComponent = new Profile();
    this._sortComponent = new Sort();
    this._filterController = new FilterController(this._siteMainElement, this._filmsModel);
    this._filmsComponent = new Films(this._films);
    this._filmsController = new FilmsController(this._filmsComponent, this._filmsModel);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setClickHandler(this._onSortTypeChange);
  }

  render() {
    render(this._siteHeaderElement, this._profileComponent);
    this._filterController.render();

    render(this._siteMainElement, this._sortComponent);
    render(this._siteMainElement, this._filmsComponent);

    if (this._films.length > 0) {
      this._filmsController.render();
    }

    render(this._siteFooterStatisticsElement, new Statistics(this._films.length));
  }

  _onSortTypeChange(sortType) {
    this._sortedFilms = sortFilms(this._films, sortType);
    this._filmsController.renderFilmsAfterSorting(this._sortedFilms, 0, this._showingFilmsCount);
  }
}
