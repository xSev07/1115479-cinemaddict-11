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
    this._store = store;
  }

  getFilms() {
    // if (isOnline()) {
    //   return this._api.getFilms()
    //     .then((films) => {
    //       const rawFilms = {};
    //       films.forEach((film) => {
    //         rawFilms[film.id] = film.toRaw();
    //       });
    //       this._store.setItem(StoreType.FILMS, rawFilms);
    //       return films;
    //     });
    // }

    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          films.forEach((film) => this._store.setItem(film.id, film.toRaw()));
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
    //       this._store.setItem(StoreType.COMMENTS, rawComments);
    //       return comments;
    //     });
    // }

    if (isOnline()) {
      return this._api.getComments(id);
    }

    return Promise.reject(`not implemented`);
  }

  updateFilm(id, data) {
    if (isOnline()) {
      return this._api.updateFilm(id, data);
    }

    return Promise.reject(`not implemented`);
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
