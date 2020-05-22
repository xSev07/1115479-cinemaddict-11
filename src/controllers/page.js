import API from "../api";
import {FilmsQuantity, NoDataStatus, Pages, SortType} from "../const";
import {remove, render, replace} from "../utils/render";
import {sortFilms} from "../utils/common";
import Profile from "../components/profile";
import Sort from "../components/sort";
import Statistic from "../components/statistic";
import Films from "../components/films";
import FilmsController from "./films";
import FilmsModel from "../models/films";
import FilterController from "../controllers/filter";
import FooterStatistics from "../components/footer-statistics";
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
    this._films = [];
    this._sortedFilms = [];
    this._filmsModel = new FilmsModel();
    this._profileComponent = new Profile();
    this._sortComponent = new Sort();
    this._filmsComponent = new Films();
    // this._filmsController = new FilmsController(this._filmsComponent, this._filmsModel);
    this._filmsController = null;
    this._statistic = new Statistic();
    this._footerComponent = new FooterStatistics(this._films.length);
    this._onPageChange = this._onPageChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setClickHandler(this._onSortTypeChange);
    this._filterController = new FilterController(this._siteMainElement, this._filmsModel, this._onPageChange);
    this._statistic.setStatsChangeHandler(this._onStatsChange);
  }

  render() {
    this._filmsNoData = new FilmsNoData();

    render(this._siteHeaderElement, this._profileComponent);
    this._filterController.render();

    render(this._siteMainElement, this._sortComponent);
    render(this._siteMainElement, this._filmsNoData);

    render(this._siteMainElement, this._statistic);
    this.hide(this._statistic);
    this._statistic.createChart();

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

  _getCommentsAndRender(films){
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
    this._films = films;
    this._filmsModel.setFilms(films);
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
