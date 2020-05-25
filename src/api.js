import Film from "./models/film";
import Comment from "./models/comment";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
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
      .then(Film.parseFilms);
  }

  getComments(id) {
    return this._load({
      url: `comments/${id}`
    })
      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  updateFilm(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRaw()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Film.parseFilm);
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
          film: Film.parseFilm(response.movie),
          comments: Comment.parseComments(response.comments),
        };
      });
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
