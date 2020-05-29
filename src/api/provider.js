import CommentModel from "../models/comment-model";
import FilmModel from "../models/film-model";

const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, storeFilms, storeComments) {
    this._api = api;
    this._storeFilms = storeFilms;
    this._storeComments = storeComments;
    this._needSync = false;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = films.reduce((acc, current) => {
            return Object.assign({}, acc, {[current.id]: current.toRaw()});
          }, {});
          this._storeFilms.setItems(items);
          return films;
        });
    }

    const storeFilms = Object.values(this._storeFilms.getItems());

    return Promise.resolve(FilmModel.parseFilms(storeFilms));
  }

  getComments(id) {
    if (isOnline()) {
      this._storeComments.clear();
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

    this._needSync = true;
    const localFilm = FilmModel.clone(Object.assign(film, {id}));
    const localRawFilm = localFilm.toRaw();
    localRawFilm.needSync = true;
    this._storeFilms.setItem(id, localRawFilm);

    return Promise.resolve(localFilm);
  }

  deleteComment(id) {
    if (isOnline()) {
      return this._api.deleteComment(id)
        .then(() => this._storeComments.removeItem(id));
    }

    return Promise.reject(`No internet`);
  }

  createComment(comment, filmId) {
    if (isOnline()) {
      return this._api.createComment(comment, filmId)
        .then((response) => {
          const newComment = response.comments[response.comments.length - 1];
          this._storeComments.setItem(newComment.id, newComment.toRaw());
          this._storeFilms.setItem(response.film.id, response.film.toRaw());

          return response;
        });
    }
    return Promise.reject(`No internet`);
  }

  sync() {
    if (!this._needSync) {
      return true;
    }

    if (isOnline()) {
      const storeFilms = Object.values(this._storeFilms.getItems()).filter((film) => film.needSync);
      return this._api.sync(storeFilms)
        .then((response) => {
          response.updated.forEach((film) => this._storeFilms.setItem(film.id, film));
          this._needSync = false;
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
