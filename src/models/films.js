import {FilterType} from "../const";
import {getFilmsByFilter} from "../utils/filter";


export default class FilmsModel {
  constructor() {
    this._films = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  setFilms(films) {
    this._films = films;
  }

  getFilms() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  getFilmsAll() {
    return this._films;
  }

  setFilter(filterType) {
    if (this._activeFilterType === filterType) {
      return;
    }
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  removeComment(id) {
    let newFilm = null;
    this._films.forEach((film) => {
      const index = film.comments.findIndex((comment) => comment === id);
      if (index !== -1) {
        film.comments = [].concat(film.comments.slice(0, index), film.comments.slice(index + 1));
        newFilm = film;
      }
    });
    return newFilm;
  }

  addComment(filmId, commentId) {
    const index = this._films.findIndex((film) => film.id === filmId);
    const film = this._films[index];
    film.comments.push(commentId);
    return film;
  }

  updateFilm(id, film) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }
}
