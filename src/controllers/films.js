import {PlaceInsert, remove, render} from "../utils/render";
import {sortFilms} from "../utils/common";
import FilmController from "./film";
import {AdditionalCategory, FilmsQuantity, SortType} from "../const";
import ShowMoreButton from "../components/show-more-button";
import FilmsExtra from "../components/films-extra";

const siteFooterElement = document.querySelector(`.footer`);

export default class FilmsController {
  constructor(container) {
    this._container = container;
    this._films = [];
    this._showedFilmController = [];
    this._showingFilmsCount = FilmsQuantity.SHOWING_ON_START;
    this._showMoreButtonComponent = new ShowMoreButton();
    this._filmsElement = this._container.getElement();
    this._filmsContainerElement = container.getElement().querySelector(`.films-list__container`);
  }

  renderFilmsAfterSorting(films, start, finish) {
    this._films = films;
    this._showedFilmController = [];
    this._showingFilmsCount = FilmsQuantity.SHOWING_ON_START;
    this._filmsContainerElement.innerHTML = ``;
    remove(this._showMoreButtonComponent);
    this._renderShowMoreButton();
    this._renderFilmsCards(this._filmsContainerElement, this._films, start, finish);
  }

  render(films) {
    this._films = films;
    this._renderFilmsCards(this._filmsContainerElement, this._films, 0, this._showingFilmsCount);
    this._renderShowMoreButton();
    this._renderTopRateFilms();
    this._renderMostCommentedFilms();
  }

  _renderFilmsCards(element, array, start = 0, finish = array.length) {
    const newFilms = array.slice(start, finish)
      .map((film) => {
        const filmController = new FilmController(element, siteFooterElement);
        filmController.render(film);
        return filmController;
      });
    this._showedFilmController = this._showedFilmController.concat(newFilms);
  }

  _renderTopRateFilms() {
    const topRatedFilms = sortFilms(this._films, SortType.RATING);
    if (topRatedFilms[0].rating !== 0) {
      render(this._filmsElement, new FilmsExtra(AdditionalCategory.RATE));
      const filmsRatedElement = this._filmsElement.querySelector(`.js-tr`);
      this._renderFilmsCards(filmsRatedElement, topRatedFilms, 0, FilmsQuantity.ADDITIONAL);
    }
  }

  _renderMostCommentedFilms() {
    const mostCommentedFilms = sortFilms(this._films, SortType.COMMENTS);
    if (mostCommentedFilms[0].comments.length !== 0) {
      render(this._filmsElement, new FilmsExtra(AdditionalCategory.COMMENT));
      const filmsCommentedElement = this._filmsElement.querySelector(`.js-mc`);
      this._renderFilmsCards(filmsCommentedElement, mostCommentedFilms, 0, FilmsQuantity.ADDITIONAL);
    }
  }

  _renderShowMoreButton() {
    if (this._films.length <= this._showingFilmsCount) {
      return;
    }
    render(this._filmsContainerElement, this._showMoreButtonComponent, PlaceInsert.AFTER_END);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmCount = this._showingFilmsCount;
      this._showingFilmsCount += FilmsQuantity.SHOWING_BY_BUTTON;

      this._renderFilmsCards(this._filmsContainerElement, this._films, prevFilmCount, this._showingFilmsCount);
      if (this._showingFilmsCount >= this._films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }
}
