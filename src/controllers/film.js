import {remove, render, replace} from "../utils/render";
import FilmCardComponent from "../components/film-card-component";
import FilmDetailsComponent from "../components/film-details-component";
import {CommentMode, KeyCode} from "../const";
import Film from "../models/film";
import Comment from "../models/comment";

const SHAKE_ANIMATION_TIMEOUT = 600;

const FilmStatus = {
  WATCHLIST: `watchlist`,
  WATCHED: `history`,
  FAVORITE: `favorites`
};

export default class FilmController {
  constructor(container, containerDetails, api, changeFunctions) {
    this._container = container;
    this._containerDetails = containerDetails;
    this._onDataChange = changeFunctions.FILM_DATA;
    this._onCommentChange = changeFunctions.COMMENT_DATA;
    this._onViewChange = changeFunctions.VIEW;
    this._displayed = false;
    this._api = api;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._openFilmDetails = this._openFilmDetails.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
  }

  render(film, commentsModel, close = true) {
    this._film = film;
    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmCardComponent(film);
    this._filmComponent.setOpenClickHandler(this._openFilmDetails);
    this._setStatusClickHandlers(this._filmComponent, film);

    this._commentsModel = commentsModel || this._commentsModel;
    const comments = film.comments.map((it) => this._commentsModel.getComment(it));

    this._filmDetailsComponent = new FilmDetailsComponent(film, comments);
    this._filmDetailsComponent.setCloseClickHandler(this._closeFilmDetails);
    this._setStatusClickHandlers(this._filmDetailsComponent, film);
    this._onEmojiClick();
    this._onCommentDelete();
    this._onCommentSubmit();

    if (oldFilmComponent && oldFilmDetailsComponent) {
      replace(this._filmComponent, oldFilmComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      if (close) {
        this._onViewChange();
      }
      render(this._container, this._filmComponent);
    }
  }

  compareFilmData(id) {
    return this._filmComponent.getFilmData().id === id;
  }

  setDefaultView() {
    if (this._displayed) {
      this._closeFilmDetails();
      this._filmDetailsComponent.clearNewComment();
      this._displayed = false;
    }
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setStatusDisabled(value) {
    this._filmComponent.setStatusDisabled(value);
    this._filmDetailsComponent.setStatusDisabled(value);
  }

  shake() {
    this._filmComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._filmDetailsComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._filmComponent.getElement().style.animation = ``;
      this._filmDetailsComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _onDataUpdate(evt, film, propertyName) {
    evt.preventDefault();
    const newFilm = Film.clone(film);
    newFilm[propertyName] = !newFilm[propertyName];
    if (propertyName === FilmStatus.WATCHED) {
      newFilm.watchingDate = newFilm[propertyName] ? new Date() : new Date(0);
    }
    this._onDataChange(film, newFilm);
  }

  _setStatusClickHandlers(component, film) {
    component.setWatchlistClickHandler((evt) => this._onDataUpdate(evt, film, FilmStatus.WATCHLIST));
    component.setWatchedClickHandler((evt) => this._onDataUpdate(evt, film, FilmStatus.WATCHED));
    component.setFavoriteClickHandler((evt) => this._onDataUpdate(evt, film, FilmStatus.FAVORITE));
  }

  _onEmojiClick() {
    this._filmDetailsComponent.setEmojiClickHandler((evt) => {
      this._filmDetailsComponent.setEmoji(evt);
    });
  }

  _onCommentSubmit() {
    this._filmDetailsComponent.setCommentSubmitHandler((evt) => {
      if (evt.ctrlKey && evt.keyCode === KeyCode.ENTER) {
        this._filmDetailsComponent.setNewCommentFormDisabled(true);
        this._filmDetailsComponent.setCommentError(false);
        const newCommentData = this._filmDetailsComponent.getNewCommentData();
        const newComment = new Comment(newCommentData);

        this._api.createComment(newComment, this._film.id)
          .then((response) => {
            this._onCommentChange(response.comments[response.comments.length - 1], response.film, CommentMode.ADD);
          })
          .catch(() => {
            this._filmDetailsComponent.setNewCommentFormDisabled(false);
            this._filmDetailsComponent.setCommentError(true);
            this.shake();
          });
      }
    });
  }

  _onCommentDelete() {
    this._filmDetailsComponent.setDeleteButtonsClickHandler((evt) => {
      evt.preventDefault();
      this._filmDetailsComponent.setCommentDeleteButtonDisabled(evt.target, true);
      const commentId = this._filmDetailsComponent.getCommentIdByEvent(evt);
      this._api.deleteComment(commentId)
        .then(() => {
          this._commentsModel.removeComment(commentId);
        })
        .catch(() => {
          this._filmDetailsComponent.setCommentDeleteButtonDisabled(evt.target, false);
          this.shake();
        });
    });
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === KeyCode.ESCAPE || evt.key === KeyCode.ESC;
    if (isEscKey) {
      this._closeFilmDetails();
    }
  }

  _closeFilmDetails() {
    this._filmDetailsComponent.clearNewComment();
    this._filmDetailsComponent.getElement().remove();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _openFilmDetails() {
    this._onViewChange();
    render(this._containerDetails, this._filmDetailsComponent);
    this._displayed = true;
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }
}
