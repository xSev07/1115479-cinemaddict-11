import {remove, render, replace} from "../utils/render";
import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";

export default class FilmController {
  /**
   * Создает экземплят класса FilmController
   *
   * @param {HTMLElement} container контейнер для карточки фильма
   * @param {HTMLElement} containerDetails контейнер для детальной информации о фильме
   * @param {function} onDataChange функция вызываемая при изменении данных
   * @param {function} onViewChange функция вызываемая при изменении отображения фильма
   */
  constructor(container, containerDetails, onDataChange, onViewChange) {
  // constructor(container, containerDetails, changeFunctions) {
    this._container = container;
    this._containerDetails = containerDetails;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    // this._onDataChange = changeFunctions.FILM_DATA;
    // this._onCommentChange = changeFunctions.COMMENT_DATA;
    // this._onViewChange = changeFunctions.VIEW;
    this._displayed = false;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._openFilmDetails = this._openFilmDetails.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
  }

  render(film, commentsModel) {
    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmCard(film);
    this._filmComponent.setOpenClickHandler(this._openFilmDetails);
    this._setStatusClickHandlers(this._filmComponent, film);

    this._commentsModel = commentsModel;
    const comments = film.comments.map((it) => this._commentsModel.getComment(it));

    this._filmDetailsComponent = new FilmDetails(film, comments);
    this._filmDetailsComponent.setCloseClickHandler(this._closeFilmDetails);
    this._setStatusClickHandlers(this._filmDetailsComponent, film);
    this._filmDetailsComponent.setEmojiClickHandler((evt) => {
      if (evt.target.tagName !== `IMG`) {
        return;
      }

      const selectedEmoji = evt.target.dataset.emojiName;

      const selectedEmojiElement = this._filmDetailsComponent.getElement().querySelector(`.film-details__add-emoji-label`);
      selectedEmojiElement.innerHTML = `<img src="images/emoji/${selectedEmoji}.png" width="55" height="55" alt="emoji-${selectedEmoji}">`;
    });

    if (oldFilmComponent && oldFilmDetailsComponent) {
      replace(this._filmComponent, oldFilmComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
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
      this._displayed = false;
    }
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  // при изменении комментария вызывать другую функцию(onDataChange)

  _onDataUpdate(evt, film, propertyName) {
    evt.preventDefault();
    this._onDataChange(film, Object.assign({}, film, {[propertyName]: !film[propertyName]}));
  }

  _setStatusClickHandlers(component, film) {
    component.setWatchlistClickHandler((evt) => this._onDataUpdate(evt, film, `watchlist`));
    component.setWatchedClickHandler((evt) => this._onDataUpdate(evt, film, `history`));
    component.setFavoriteClickHandler((evt) => this._onDataUpdate(evt, film, `favorites`));
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._closeFilmDetails();
    }
  }

  _closeFilmDetails() {
    // remove(this._filmDetailsComponent);

    this._filmDetailsComponent.getElement().remove();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _openFilmDetails() {
    this._onViewChange();
    render(this._containerDetails, this._filmDetailsComponent);
    this._displayed = true;
    // this._filmDetailsComponent.setCloseClickHandler(this._closeFilmDetails);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }
}
