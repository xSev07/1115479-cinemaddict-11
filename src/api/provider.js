import CommentModel from "../models/comment-model";
import FilmModel from "../models/film-model";
import {nanoid} from "nanoid";

const LOCAL_AUTHOR = `Unkown Anonymus`;

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

    const localNewCommentId = nanoid();
    const localNewComment = CommentModel.clone(Object.assign(comment, {
      id: localNewCommentId,
      author: LOCAL_AUTHOR
    }));

    const storeFilm = this._storeFilms.getItem(filmId);
    const localChangedFilm = new FilmModel(storeFilm);
    localChangedFilm.comments.push(localNewComment.id);
    this._storeComments.setItem(localNewComment.id, localNewComment.toRaw());
    this._storeFilms.setItem(localChangedFilm.id, localChangedFilm.toRaw());

    const localResponse = {
      film: localChangedFilm,
      comments: [localNewComment]
    };

    return Promise.resolve(localResponse);
  }
}
