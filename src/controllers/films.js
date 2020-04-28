import {PlaceInsert, remove, render} from "../utils/render";
import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";
import {AdditionalCategory, FilmsQuantity} from "../const";
import ShowMoreButton from "../components/show-more-button";
import FilmsExtra from "../components/films-extra";

// const filmsElement = this._container.getElement();
// const filmsListElement = filmsElement.querySelector(`.films-list__container`);
const siteFooterElement = document.querySelector(`.footer`);

const renderFilm = (filmsListElement, film) => {

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      closeFilmDetails();
    }
  };

  const closeFilmDetails = () => {
    remove(filmDetailsComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const openFilmDetails = () => {
    render(siteFooterElement, filmDetailsComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const filmComponent = new FilmCard(film);
  filmComponent.setOpenClickHandler(openFilmDetails);

  const filmDetailsComponent = new FilmDetails(film);
  filmDetailsComponent.setCloseClickHandler(closeFilmDetails);
  render(filmsListElement, filmComponent);
};

const renderFilmsCards = (element, array, start = 0, finish = array.length) => {
  array.slice(start, finish).
  forEach((it) => {
    renderFilm(element, it);
  });
};

export default class FilmsController {
  constructor(container) {
    this._container = container;
    this._showMoreButtonComponent = new ShowMoreButton();
  }

  renderFilmsAfterSorting(films, start, finish) {
    const filmsElement = this._container.getElement();
    filmsElement.innerHTML = ``;
    renderFilmsCards(filmsElement, films, start, finish);
  }

  render(films) {
    const filmsElement = this._container.getElement();
    const filmsListElement = filmsElement.querySelector(`.films-list__container`);

    let showingFilmsCount = FilmsQuantity.SHOWING_ON_START;
    renderFilmsCards(filmsListElement, films, 0, showingFilmsCount);
    render(filmsListElement, this._showMoreButtonComponent, PlaceInsert.AFTER_END);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmCount = showingFilmsCount;
      showingFilmsCount += FilmsQuantity.SHOWING_BY_BUTTON;
      renderFilmsCards(filmsListElement, films, prevFilmCount, showingFilmsCount);
      if (showingFilmsCount >= films.length) {
        remove(this._showMoreButtonComponent);
      }
    });

    const topRatedFilms = films.slice().sort((a, b) => b.rating - a.rating);
    if (topRatedFilms[0].rating !== 0) {
      render(filmsElement, new FilmsExtra(AdditionalCategory.RATE));
      const filmsRatedElement = filmsElement.querySelector(`.js-tr`);
      renderFilmsCards(filmsRatedElement, topRatedFilms, 0, FilmsQuantity.ADDITIONAL);
    }

    const mostCommentedFilms = films.slice().sort((a, b) => b.comments.length - a.comments.length);
    if (mostCommentedFilms[0].comments.length !== 0) {
      render(filmsElement, new FilmsExtra(AdditionalCategory.COMMENT));
      const filmsCommentedElement = filmsElement.querySelector(`.js-mc`);
      renderFilmsCards(filmsCommentedElement, mostCommentedFilms, 0, FilmsQuantity.ADDITIONAL);
    }
  }
}
