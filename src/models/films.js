import {FilterType} from "../const";
import {getFilmsByFilter} from "../utils/filter";


export default class FilmsModel {
  constructor(films) {
    this._films = films;
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

  // removeFilm(id) {
  //   const index = this._films.findIndex((it) => it.id === id);
  //
  //   if (index === -1) {
  //     return false;
  //   }
  //
  //   this._films = [].concat(this._films.slice(0, index), this._films.slice(index + 1));
  //   this._callHandlers(this._dataChangeHandlers);
  //
  //   return true;
  // }

  // addFilm(film) {
  //   this._films = [].concat(film, this._films);
  //   this._callHandlers(this._dataChangeHandlers);
  // }

  setFilter(filterType) {
    if (this._activeFilterType === filterType) {
      return;
    }
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
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

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
