import FilmModel from "../models/film-model";
import CommentModel from "../models/comment-model";
import {ResponseStatus} from "../const";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= ResponseStatus.OK && response.status < ResponseStatus.REDIRECT) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({
      url: `movies`
    })
      .then((response) => response.json())
      .then(FilmModel.parseFilms);
  }

  getComments(id) {
    return this._load({
      url: `comments/${id}`
    })
      .then((response) => response.json())
      .then(CommentModel.parseComments);
  }

  updateFilm(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRaw()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(FilmModel.parseFilm);
  }

  deleteComment(id) {
    return this._load({
      url: `comments/${id}`,
      method: Method.DELETE
    });
  }

  createComment(data, filmId) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(data.toRaw()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then((response) => {
        return {
          film: FilmModel.parseFilm(response.movie),
          comments: CommentModel.parseComments(response.comments),
        };
      });
  }

  sync(data) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
