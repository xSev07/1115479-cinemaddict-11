import {FilmsQuantity, Pages, SortType} from "../const";
import {render} from "../utils/render";
import {sortFilms} from "../utils/common";
import Profile from "../components/profile";
import Sort from "../components/sort";
import Statistic from "../components/statistic";
import Films from "../components/films";
import FilmsController from "./films";
import FilmsModel from "../models/films";
import FilterController from "../controllers/filter";
import FooterStatistics from "../components/footer-statistics";

export default class PageController {
  constructor(films) {
    this._showedPage = Pages.FILMS;
    this._siteHeaderElement = document.querySelector(`.header`);
    this._siteMainElement = document.querySelector(`.main`);
    this._siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);
    this._showingFilmsCount = FilmsQuantity.SHOWING_ON_START;
    this._films = films;
    this._sortedFilms = films;
    this._filmsModel = new FilmsModel(this._films);
    this._profileComponent = new Profile();
    this._sortComponent = new Sort();
    this._filmsComponent = new Films(this._films);
    this._filmsController = new FilmsController(this._filmsComponent, this._filmsModel);
    this._statistic = new Statistic();
    this._onPageChange = this._onPageChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setClickHandler(this._onSortTypeChange);
    this._filterController = new FilterController(this._siteMainElement, this._filmsModel, this._onPageChange);
    this._statistic.setStatsChangeHandler(this._onStatsChange);
  }

  render() {
    render(this._siteHeaderElement, this._profileComponent);
    this._filterController.render();

    render(this._siteMainElement, this._sortComponent);
    render(this._siteMainElement, this._filmsComponent);

    if (this._films.length > 0) {
      this._filmsController.render();
    }

    render(this._siteMainElement, this._statistic);
    this.hide(this._statistic);
    this._statistic.createChart();

    render(this._siteFooterStatisticsElement, new FooterStatistics(this._films.length));
  }

  hide(container) {
    container.hide();
  }

  show(container) {
    container.show();
  }

  _onPageChange(page) {
    if (this._showedPage === page) {
      return;
    }

    switch (page) {
      case Pages.STATISTIC:
        this.hide(this._sortComponent);
        this.hide(this._filmsComponent);
        this.show(this._statistic);
        break;
      case Pages.FILMS:
        this._sortComponent.setSortType(SortType.DEFAULT);
        this._onSortTypeChange(SortType.DEFAULT);
        this.show(this._sortComponent);
        this.show(this._filmsComponent);
        this.hide(this._statistic);
        break;
    }
    this._showedPage = page;
  }

  _onSortTypeChange(sortType) {
    this._sortComponent.rerender();
    this._sortedFilms = sortFilms(this._films, sortType);
    this._filmsController.renderFilmsAfterSorting(this._sortedFilms, 0, this._showingFilmsCount);
  }

  _onStatsChange(evt) {
    // console.log(evt.target.value);
  }
}
