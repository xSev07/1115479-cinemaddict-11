import Film from "../models/film-model";

const StoreType = {
  FILMS: `films`,
  COMMENTS: `comments`
};

const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, store) {
    // реализовать два хранилища: для комментариев и фильмов
    this._api = api;
    this._storeFilms = store;
  }

  getFilms() {
    // if (isOnline()) {
    //   return this._api.getFilms()
    //     .then((films) => {
    //       const rawFilms = {};
    //       films.forEach((film) => {
    //         rawFilms[film.id] = film.toRaw();
    //       });
    //       this._storeFilms.setItem(StoreType.FILMS, rawFilms);
    //       return films;
    //     });
    // }

    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          films.forEach((film) => this._storeFilms.setItem(film.id, film.toRaw()));
          return films;
        });
    }

    return Promise.reject(`not implemented`);
  }

  getComments(id) {
    // if (isOnline()) {
    //   return this._api.getComments(id)
    //     .then((comments) => {
    //       const rawComments = {};
    //       comments.forEach((comment) => {
    //         rawComments[comment.id] = comment.toRaw();
    //       });
    //       this._storeFilms.setItem(StoreType.COMMENTS, rawComments);
    //       return comments;
    //     });
    // }

    if (isOnline()) {
      return this._api.getComments(id);
    }

    return Promise.reject(`not implemented`);
  }

  updateFilm(id, film) {
    if (isOnline()) {
      return this._api.updateFilm(id, film)
        .then((newFilm) => {
          this._storeFilms.setItem(newFilm.id, newFilm.toRaw());
          return newFilm;
        });
    }

    const localFilm = Film.clone(Object.assign(film, {id}));
    this._storeFilms.setItem(id, localFilm.toRaw());

    return Promise.resolve(localFilm);
  }

  deleteComment(id) {
    if (isOnline()) {
      return this._api.deleteComment(id);
    }

    return Promise.reject(`not implemented`);
  }

  createComment(data, filmId) {
    if (isOnline()) {
      return this._api.createComment(data, filmId);
    }

    return Promise.reject(`not implemented`);
  }
}
