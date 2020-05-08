export default class Films {
  constructor() {
    this._films = [];

    this._dataChangeHandlers = [];
  }

  setFilms(films) {
    this._films = films;
  }

  getFilms() {
    return this._films;
  }

  updateFilm(id, film) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }
    this._films = [].concat(this._films.splice(0, index), film, this._films.splice(index + 1));
    // const controllerIndex = this._showedFilmController.findIndex((it) => it.compareFilmData(film));
    // this._showedFilmController[controllerIndex].render(film);

    // ??
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
