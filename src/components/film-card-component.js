import {DESCRIPTION_PREVIEW_LENGTH} from "../const";
import AbstractSmartComponent from "./abstract-smart-component";
import {getFormatedNumber} from "../utils/common";

const createFilmCardTemplate = (film) => {
  const {title, poster, rating, genres, description, releaseDate, runtime, comments, watchlist, history, favorites} = film;
  const formatedRuntime = getFormatedNumber(runtime);
  const year = releaseDate.getFullYear();
  const activeClass = `film-card__controls-item--active`;
  const descriptionPreview = description.length > DESCRIPTION_PREVIEW_LENGTH ? `${description.substring(0, DESCRIPTION_PREVIEW_LENGTH - 1)}...` : description;
  return (`
    <article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${formatedRuntime}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${descriptionPreview}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist ? activeClass : ``}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${history ? activeClass : ``}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favorites ? activeClass : ``}">Mark as favorite</button>
      </form>
    </article>  
  `);
};

export default class FilmCardComponent extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
    this._openClickHandler = null;
    this._watchlistClickHandler = null;
    this._watchedClickHandler = null;
    this._favoriteClickHandler = null;
  }

  getFilmData() {
    return this._film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  recoveryListeners() {
    this.setOpenClickHandler(this._openClickHandler);
    this.setWatchlistClickHandler(this._watchlistClickHandler);
    this.setWatchedClickHandler(this._watchedClickHandler);
    this.setFavoriteClickHandler(this._favoriteClickHandler);
  }

  setOpenClickHandler(handler) {
    this._openClickHandler = handler;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, handler);
  }

  setWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }

  setWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }

  setFavoriteClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }

  setStatusDisabled(value) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).disabled = value;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).disabled = value;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).disabled = value;
  }
}
