import {PlaceInsert, remove, render} from "../utils/render";
import {sortFilms} from "../utils/common";
import FilmController from "./film";
import {AdditionalCategory, FilmsQuantity, SortType} from "../const";
import ShowMoreButton from "../components/show-more-button";
import FilmsExtra from "../components/films-extra";

const siteFooterElement = document.querySelector(`.footer`);

export default class FilmsController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._showedFilmController = [];
    this._showingFilmsCount = FilmsQuantity.SHOWING_ON_START;
    this._showMoreButtonComponent = new ShowMoreButton();
    this._filmsElement = this._container.getElement();
    this._filmsContainerElement = container.getElement().querySelector(`.films-list__container`);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
  }

  renderFilmsAfterSorting(films, start, finish) {
    this._films = films;
    this._showingFilmsCount = FilmsQuantity.SHOWING_ON_START;
    this._removeFilms();
    remove(this._showMoreButtonComponent);
    this._renderShowMoreButton();
    this._renderFilmsCards(this._filmsContainerElement, this._films, start, finish);
  }

  render() {
    this._renderFilmsCards(this._filmsContainerElement, this._filmsModel.getFilms(), 0, this._showingFilmsCount);
    this._renderShowMoreButton();
    this._renderTopRateFilms();
    this._renderMostCommentedFilms();
  }

  _renderFilmsCards(element, array, start = 0, finish = array.length) {
    const newFilms = array.slice(start, finish)
      .map((film) => {
        const filmController = new FilmController(element, siteFooterElement, this._onDataChange, this._onViewChange);
        filmController.render(film);
        return filmController;
      });
    this._showedFilmController = this._showedFilmController.concat(newFilms);
  }

  _renderTopRateFilms() {
    const topRatedFilms = sortFilms(this._filmsModel.getFilms(), SortType.RATING);
    if (topRatedFilms[0].rating !== 0) {
      render(this._filmsElement, new FilmsExtra(AdditionalCategory.RATE));
      const filmsRatedElement = this._filmsElement.querySelector(`.js-tr`);
      this._renderFilmsCards(filmsRatedElement, topRatedFilms, 0, FilmsQuantity.ADDITIONAL);
    }
  }

  _renderMostCommentedFilms() {
    const mostCommentedFilms = sortFilms(this._filmsModel.getFilms(), SortType.COMMENTS);
    if (mostCommentedFilms[0].comments.length !== 0) {
      render(this._filmsElement, new FilmsExtra(AdditionalCategory.COMMENT));
      const filmsCommentedElement = this._filmsElement.querySelector(`.js-mc`);
      this._renderFilmsCards(filmsCommentedElement, mostCommentedFilms, 0, FilmsQuantity.ADDITIONAL);
    }
  }

  _renderShowMoreButton() {
    if (this._filmsModel.getFilms().length <= this._showingFilmsCount) {
      return;
    }
    render(this._filmsContainerElement, this._showMoreButtonComponent, PlaceInsert.AFTER_END);

    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _onShowMoreButtonClick() {
    const prevFilmCount = this._showingFilmsCount;
    this._showingFilmsCount += FilmsQuantity.SHOWING_BY_BUTTON;

    this._renderFilmsCards(this._filmsContainerElement, this._filmsModel.getFilms(), prevFilmCount, this._showingFilmsCount);
    if (this._showingFilmsCount >= this._filmsModel.getFilms().length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _onDataChange(oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }
    this._films = [].concat(this._films.splice(0, index), newData, this._films.splice(index + 1));
    const controllerIndex = this._showedFilmController.findIndex((it) => it.compareFilmData(oldData));
    this._showedFilmController[controllerIndex].render(newData);
  }

  _onViewChange() {
    this._showedFilmController.forEach((it) => it.setDefaultView());
  }

  _removeFilms() {
    this._showedFilmController.forEach((it) => it.destroy());
    this._showedFilmController = [];
  }

  _updateFilms() {
    this._removeFilms();
    this.render();
  }

  _onFilterChange() {
    this._updateFilms();
    // this.renderFilmsAfterSorting(this._filmsModel.getFilms(), 0, FilmsQuantity.SHOWING_ON_START);
  }
}
