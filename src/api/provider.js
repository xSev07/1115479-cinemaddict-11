import CommentModel from "../models/comment-model";
import FilmModel from "../models/film-model";

const StoreType = {
  FILMS: `films`,
  COMMENTS: `comments`
};

const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, storeFilms, storeComments) {
    this._api = api;
    this._storeFilms = storeFilms;
    this._storeComments = storeComments;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          films.forEach((film) => this._storeFilms.setItem(film.id, film.toRaw()));
          return films;
        });
    }

    const storeFilms = Object.values(this._storeFilms.getItems());

    return Promise.resolve(FilmModel.parseFilms(storeFilms));
  }

  getComments(id) {
    if (isOnline()) {
      return this._api.getComments(id)
        .then((comments) => {
          comments.forEach((comment) => this._storeComments.setItem(comment.id, comment.toRaw()));
          return comments;
        });
    }

    const storeComments = Object.values(this._storeComments.getItems());

    return Promise.resolve(CommentModel.parseComments(storeComments));
  }

  updateFilm(id, film) {
    if (isOnline()) {
      return this._api.updateFilm(id, film)
        .then((newFilm) => {
          this._storeFilms.setItem(newFilm.id, newFilm.toRaw());
          return newFilm;
        });
    }

    const localFilm = FilmModel.clone(Object.assign(film, {id}));
    this._storeFilms.setItem(id, localFilm.toRaw());

    return Promise.resolve(localFilm);
  }

  deleteComment(id) {
    if (isOnline()) {
      return this._api.deleteComment(id)
        .then(() => this._storeComments.removeItem(id));
    }

    this._storeComments.removeItem(id);

    return Promise.resolve();
  }

  createComment(data, filmId) {
    if (isOnline()) {
      return this._api.createComment(data, filmId);
    }

    return Promise.reject(`not implemented`);
  }
}
