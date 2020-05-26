import API from "../api";
import {FilmsQuantity, NoDataStatus, Pages, SortType} from "../const";
import {remove, render} from "../utils/render";
import {getProfileRank, getWatchedFilmsByPeriod, sortFilms} from "../utils/common";
import ProfileComponent from "../components/profile-component";
import SortComponent from "../components/sort-component";
import StatisticComponent from "../components/statistic-component";
import FilmsComponent from "../components/films-component";
import FilmsController from "./films-controller";
import FilmsModel from "../models/films";
import FilterController from "./filter-controller";
import FooterStatisticsComponent from "../components/footer-statistics-component";
import FilmsNoData from "../components/films-no-data";

const AUTHORIZATION = `Basic gfjdoHFJDL59fdsfds7`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const api = new API(END_POINT, AUTHORIZATION);

export default class PageController {
  constructor() {
    this._showedPage = Pages.FILMS;
    this._siteHeaderElement = document.querySelector(`.header`);
    this._siteMainElement = document.querySelector(`.main`);
    this._siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);
    this._showingFilmsCount = FilmsQuantity.SHOWING_ON_START;
    this._filmsModel = new FilmsModel();
    this._profileComponent = new ProfileComponent();
    this._sortComponent = new SortComponent();
    this._filmsComponent = new FilmsComponent();
    this._filmsController = null;
    this._statistic = new StatisticComponent();
    this._footerComponent = new FooterStatisticsComponent(0);
    this._onPageChange = this._onPageChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onStatsChange = this._onStatsChange.bind(this);
    this._onFilmChange = this._onFilmChange.bind(this);
    this._sortComponent.setClickHandler(this._onSortTypeChange);
    this._filterController = new FilterController(this._siteMainElement, this._filmsModel, this._onPageChange);
    this._statistic.setStatsChangeHandler(this._onStatsChange);
    this._filmsModel.setDataChangeHandler(this._onFilmChange);
  }

  render() {
    this._filmsNoData = new FilmsNoData();

    render(this._siteHeaderElement, this._profileComponent);
    this._filterController.render();

    render(this._siteMainElement, this._sortComponent);
    render(this._siteMainElement, this._filmsNoData);

    render(this._siteMainElement, this._statistic);
    this.hide(this._statistic);

    render(this._siteFooterStatisticsElement, this._footerComponent);

    api.getFilms()
    .then((films) => this._getCommentsAndRender(films))
    .catch(() => {
      this._filmsNoData.setStatus(NoDataStatus.NO_DATA);
    });
  }

  hide(container) {
    container.hide();
  }

  show(container) {
    container.show();
  }

  _getCommentsAndRender(films) {
    const commentsPromises = films.map((film) => api.getComments(film.id));
    Promise.all(commentsPromises)
      .then((rawComments) => {
        const comments = [].concat(...rawComments);
        this._filmsController = new FilmsController(this._filmsComponent, this._filmsModel, comments, api);
        this._renderAfterAcceptFilms(films);
      });
  }

  _renderAfterAcceptFilms(films) {
    if (films.length === 0) {
      throw new Error(`No films in base`);
    }
    const rank = getProfileRank(films);
    this._filmsModel.setFilms(films);
    this._changeRank(rank);
    this._filterController.render();
    remove(this._filmsNoData);
    render(this._siteMainElement, this._filmsComponent);
    this._filmsController.render();
    remove(this._footerComponent);
    this._footerComponent.setFilmsCount(films.length);
    render(this._siteFooterStatisticsElement, this._footerComponent);
  }

  _onPageChange(page) {
    if (this._showedPage === page) {
      return;
    }

    switch (page) {
      case Pages.STATISTIC:
        this._statistic.setFilms(this._filmsModel.getFilmsAll());
        this._statistic.rerender();
        this.hide(this._sortComponent);
        this.hide(this._filmsComponent);
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
    const sortedFilms = sortFilms(this._filmsModel.getFilmsAll(), sortType);
    this._filmsModel.setFilms(sortedFilms);
    this._filmsController.renderFilmsAfterSorting(0, this._showingFilmsCount);
  }

  _onStatsChange(evt) {
    const filmsByPeriod = getWatchedFilmsByPeriod(this._filmsModel.getFilmsAll(), evt.target.value);
    this._statistic.setFilms(filmsByPeriod);
    this._statistic.setPeriod(evt.target.value);
    this._statistic.rerender();
  }

  _onFilmChange() {
    const rank = getProfileRank(this._filmsModel.getFilmsAll());
    const oldRank = this._profileComponent.getRank(rank);
    if (oldRank !== rank) {
      this._changeRank(rank);
    }
  }

  _changeRank(rank) {
    remove(this._profileComponent);
    this._profileComponent.setRank(rank);
    render(this._siteHeaderElement, this._profileComponent);
    this._statistic.setRank(rank);
  }
}
