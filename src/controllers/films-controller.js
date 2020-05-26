import {PlaceInsert, remove, render} from "../utils/render";
import {sortFilms} from "../utils/common";
import FilmController from "./film-controller";
import {AdditionalCategory, CommentMode, FilmsQuantity, SortType} from "../const";
import ShowMoreButtonComponent from "../components/show-more-button-component";
import FilmsExtra from "../components/films-extra";
import CommentsModel from "../models/comments-model";

const siteFooterElement = document.querySelector(`.footer`);

export default class FilmsController {
  constructor(container, filmsModel, comments, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._showedFilmController = [];
    this._showedAdditionalFilmController = [];
    this._api = api;
    this._showingFilmsCount = FilmsQuantity.SHOWING_ON_START;
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._filmsExtraRateComponent = null;
    this._filmsExtraCommentComponent = null;
    this._filmsElement = this._container.getElement();
    this._filmsContainerElement = container.getElement().querySelector(`.films-list__container`);
    this._onDataChange = this._onDataChange.bind(this);
    this._onCommentChange = this._onCommentChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
    this._commentsModel = new CommentsModel(comments, this._onCommentChange);
  }

  renderFilmsAfterSorting(start, finish) {
    this._showingFilmsCount = FilmsQuantity.SHOWING_ON_START;
    this._removeFilms();
    remove(this._showMoreButtonComponent);
    this._renderShowMoreButton();
    this._renderFilmsCards(this._filmsContainerElement, this._filmsModel.getFilms(), start, finish);
  }

  render() {
    this._renderFilmsCards(this._filmsContainerElement, this._filmsModel.getFilms(), 0, this._showingFilmsCount);
    this._renderShowMoreButton();
    if (this._showedAdditionalFilmController.length === 0) {
      this._renderExtraFilms();
    }
  }

  _renderFilmsCards(element, array, start = 0, finish = array.length, additional = false) {
    const newFilms = array.slice(start, finish)
      .map((film) => {
        const filmController = new FilmController(element, siteFooterElement, this._api, this._getChangeFunctions());
        filmController.render(film, this._commentsModel, false);
        return filmController;
      });
    if (additional) {
      this._showedAdditionalFilmController = this._showedAdditionalFilmController.concat(newFilms);
    } else {
      this._showedFilmController = this._showedFilmController.concat(newFilms);
    }
  }

  _renderTopRateFilms() {
    const topRatedFilms = sortFilms(this._filmsModel.getFilms(), SortType.RATING);
    if (topRatedFilms[0].rating !== 0) {
      this._filmsExtraRateComponent = new FilmsExtra(AdditionalCategory.RATE);
      render(this._filmsElement, this._filmsExtraRateComponent);
      const filmsRatedElement = this._filmsElement.querySelector(`.js-tr`);
      this._renderFilmsCards(filmsRatedElement, topRatedFilms, 0, FilmsQuantity.ADDITIONAL, true);
    } else {
      this._filmsExtraRateComponent = null;
    }
  }

  _renderMostCommentedFilms() {
    const mostCommentedFilms = sortFilms(this._filmsModel.getFilms(), SortType.COMMENTS);
    if (mostCommentedFilms[0].comments.length !== 0) {
      this._filmsExtraCommentComponent = new FilmsExtra(AdditionalCategory.COMMENT);
      render(this._filmsElement, this._filmsExtraCommentComponent);
      const filmsCommentedElement = this._filmsElement.querySelector(`.js-mc`);
      this._renderFilmsCards(filmsCommentedElement, mostCommentedFilms, 0, FilmsQuantity.ADDITIONAL, true);
    } else {
      this._filmsExtraCommentComponent = null;
    }
  }

  _renderExtraFilms() {
    this._showedAdditionalFilmController = [];
    if (this._filmsExtraRateComponent) {
      remove(this._filmsExtraRateComponent);
    }
    if (this._filmsExtraCommentComponent) {
      remove(this._filmsExtraCommentComponent);
    }
    this._renderTopRateFilms();
    this._renderMostCommentedFilms();
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
    const index = this._getFilmIndexInControllers(oldData.id);
    this._setFilmStatusDisabled(index, true);
    this._api.updateFilm(oldData.id, newData)
      .then((film) => {
        const isSuccess = this._filmsModel.updateFilm(oldData.id, film);
        if (isSuccess) {
          this._renderUpdatedFilm(film, index);
        }
      })
      .catch(() => {
        this._setFilmStatusDisabled(index, false);
      });
  }

  _setFilmStatusDisabled(index, status) {
    this._showedFilmController[index.base].setStatusDisabled(status);
    if (index.additional !== -1) {
      this._showedAdditionalFilmController[index.additional].setStatusDisabled(status);
    }
  }

  _getFilmIndexInControllers(id) {
    return {
      base: this._showedFilmController.findIndex((it) => it.compareFilmData(id)),
      additional: this._showedAdditionalFilmController.findIndex((it) => it.compareFilmData(id))
    };
  }

  _renderUpdatedFilm(film, index) {
    if (index.base !== -1) {
      this._showedFilmController[index.base].render(film);
    }

    if (index.additional !== -1) {
      this._showedAdditionalFilmController[index.additional].render(film);
    }
  }

  _onCommentChange(comment, film, mode) {
    let targetFilm = film;
    switch (mode) {
      case CommentMode.ADD:
        this._commentsModel.addComment(comment);
        this._filmsModel.addComment(film.id, comment.id);
        break;
      case CommentMode.DELETE:
        targetFilm = this._filmsModel.removeComment(comment.id);
        break;
    }

    const index = this._getFilmIndexInControllers(targetFilm.id);
    this._renderUpdatedFilm(targetFilm, index);

    this._renderExtraFilms();
  }

  _onViewChange() {
    this._showedFilmController.forEach((it) => it.setDefaultView());
    this._showedAdditionalFilmController.forEach((it) => it.setDefaultView());
  }

  _getChangeFunctions() {
    return {
      FILM_DATA: this._onDataChange,
      COMMENT_DATA: this._onCommentChange,
      VIEW: this._onViewChange,
    };
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
    this._showingFilmsCount = FilmsQuantity.SHOWING_ON_START;
    this._updateFilms();
    remove(this._showMoreButtonComponent);
    this._renderShowMoreButton();
  }
}
