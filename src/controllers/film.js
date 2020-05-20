import {remove, render, replace} from "../utils/render";
import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";
import {KeyCode} from "../const";

export default class FilmController {
  constructor(container, containerDetails, changeFunctions) {
    this._container = container;
    this._containerDetails = containerDetails;
    this._onDataChange = changeFunctions.FILM_DATA;
    this._onCommentChange = changeFunctions.COMMENT_DATA;
    this._onViewChange = changeFunctions.VIEW;
    this._displayed = false;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._openFilmDetails = this._openFilmDetails.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
  }

  render(film, commentsModel) {
    this._film = film;
    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmCard(film);
    this._filmComponent.setOpenClickHandler(this._openFilmDetails);
    this._setStatusClickHandlers(this._filmComponent, film);

    this._commentsModel = commentsModel || this._commentsModel;
    const comments = film.comments.map((it) => this._commentsModel.getComment(it));

    // this._filmDetailsComponent = new FilmDetails(film, comments);
    // this._filmDetailsComponent.setCloseClickHandler(this._closeFilmDetails);
    // this._setStatusClickHandlers(this._filmDetailsComponent, film);
    // this._onEmojiClick();
    // this._onCommentDelete();
    // this._onCommentSubmit();

    if (oldFilmComponent && oldFilmDetailsComponent) {
      replace(this._filmComponent, oldFilmComponent);
      // replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      this._onViewChange();
      render(this._container, this._filmComponent);
    }
  }

  compareFilmData(filmData) {
    return this._filmComponent.getFilmData().id === filmData.id;
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

  _onDataUpdate(evt, film, propertyName) {
    evt.preventDefault();
    this._onDataChange(film, Object.assign({}, film, {[propertyName]: !film[propertyName]}));
  }

  _setStatusClickHandlers(component, film) {
    component.setWatchlistClickHandler((evt) => this._onDataUpdate(evt, film, `watchlist`));
    component.setWatchedClickHandler((evt) => this._onDataUpdate(evt, film, `history`));
    component.setFavoriteClickHandler((evt) => this._onDataUpdate(evt, film, `favorites`));
  }

  _onEmojiClick() {
    this._filmDetailsComponent.setEmojiClickHandler((evt) => {
      this._filmDetailsComponent.setEmoji(evt);
    });
  }

  _onCommentSubmit() {
    this._filmDetailsComponent.setCommentSubmitHandler((evt) => {
      if (evt.ctrlKey && evt.keyCode === KeyCode.ENTER) {
        const newComment = this._filmDetailsComponent.getNewCommentData();
        this._onCommentChange(newComment, this._film);
      }
    });
  }

  _onCommentDelete() {
    this._filmDetailsComponent.setDeleteButtonsClickHandler((evt) => {
      evt.preventDefault();
      const commentId = this._filmDetailsComponent.getCommentIdByEvent(evt);
      this._commentsModel.removeComment(commentId);
    });
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._closeFilmDetails();
    }
  }

  _closeFilmDetails() {
    // this._filmDetailsComponent.clearNewComment();
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
