import {emojis} from "../const";
import {getFormatedCommentDate, getFormatedDate, getFormatedNumber} from "../utils/common";
import AbstractSmartComponent from "./abstract-smart-component";
const sanitizeHtml = require(`sanitize-html`);

const createCommentTemplate = (comment) => {
  const {id, text: notSanitizedText, emoji, author: notSanitizedAuthor, date} = comment;
  const text = sanitizeHtml(notSanitizedText);
  const author = sanitizeHtml(notSanitizedAuthor);

  return (`
    <li class="film-details__comment" data-comment-id="${id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${getFormatedCommentDate(date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
  `);
};

const createFilmControlTemplate = (name, isChecked, representation = name) => {
  return (`
    <input type="checkbox" class="film-details__control-input visually-hidden" id="${name}" name="${name}" ${isChecked ? `checked` : ``}>
    <label for="${name}" class="film-details__control-label film-details__control-label--${name}">Add to ${representation}</label>
  `);
};

const createEmojiTemplate = (name) => {
  return (`
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${name}" value="${name}">
    <label class="film-details__emoji-label" for="emoji-${name}">
      <img src="./images/emoji/${name}.png" width="30" height="30" alt="emoji">
    </label>  
  `);
};


const createFilmDetailsTemplate = (film, comments) => {
  const {title, titleOriginal, poster, age, rating, genres, description, releaseDate, runtime, director, writers, actors, country, watchlist, history, favorites} = film;

  const formatedRuntime = getFormatedNumber(runtime);

  const watchlistTemplate = createFilmControlTemplate(`watchlist`, watchlist);
  const watchedTemplate = createFilmControlTemplate(`watched`, history);
  const favoriteTemplate = createFilmControlTemplate(`favorite`, favorites, `favorites`);

  const commentTemplate = comments.map((it) => createCommentTemplate(it)).join(`\n`);
  const emojisTemplate = emojis.map((it) => createEmojiTemplate(it)).join(`\n`);

  return (`
    <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${poster}" alt="">
    
              <p class="film-details__age">${age}+</p>
            </div>
    
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">${titleOriginal}</p>
                </div>
    
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>
    
              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${getFormatedDate(releaseDate)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${formatedRuntime}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genre${genres.length > 1 ? `s` : ``}</td>
                  <td class="film-details__cell">
                  ${genres.map((it) => `<span class="film-details__genre">${it}</span>`).join(`\n`)}
                </tr>
              </table>
    
              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>
    
          <section class="film-details__controls">
            ${watchlistTemplate}
            ${watchedTemplate}
            ${favoriteTemplate}
          </section>
        </div>
    
        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
    
            <ul class="film-details__comments-list">
              ${commentTemplate}
            </ul>
    
            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>
    
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
    
              <div class="film-details__emoji-list">
                ${emojisTemplate}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>
  `);
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(film, comments) {
    super();
    this._comments = comments;
    this._film = film;
    this._commentSubmitHandler = null;
    this._closeClickHandler = null;
    this._emojiClickHandler = null;
    this._deleteButtonsClickHandler = null;
    this._watchlistClickHandler = null;
    this._watchedClickHandler = null;
    this._favoriteClickHandler = null;
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film, this._comments);
  }

  getCommentIdByEvent(evt) {
    const path = evt.path || (evt.composedPath && evt.composedPath());

    const index = path.findIndex((it) => it.className === `film-details__comment`);
    const elem = path[index];
    const id = elem.dataset.commentId;
    return id;
  }

  getNewCommentData() {
    const comment = this._parseData();
    comment.comment = sanitizeHtml(comment.comment);
    return comment;
  }

  recoveryListeners() {
    this.setCloseClickHandler(this._closeClickHandler);
    this.setWatchlistClickHandler(this._watchlistClickHandler);
    this.setWatchedClickHandler(this._watchedClickHandler);
    this.setFavoriteClickHandler(this._favoriteClickHandler);
    this.setEmojiClickHandler(this._emojiClickHandler);
    this.setDeleteButtonsClickHandler(this._deleteButtonsClickHandler);
    this.setCommentSubmitHandler(this._commentSubmitHandler);
  }

  clearNewComment() {
    const element = this.getElement();
    element.querySelector(`.film-details__add-emoji-label`).innerHTML = ``;
    element.querySelector(`.film-details__comment-input`).value = ``;
    element.querySelectorAll(`.film-details__emoji-item`).forEach((it) => {
      it.checked = false;
    });
  }

  setStatusDisabled(value) {
    this.getElement().querySelector(`#watchlist`).disabled = value;
    this.getElement().querySelector(`#watched`).disabled = value;
    this.getElement().querySelector(`#favorite`).disabled = value;
  }

  setCommentError(value) {
    if (value) {
      this.getElement().querySelector(`.film-details__comment-input`).classList.add(`film-details__comment-input--error`);
    } else {
      this.getElement().querySelector(`.film-details__comment-input`).classList.remove(`film-details__comment-input--error`);
    }
  }

  setNewCommentFormDisabled(value) {
    this.getElement().querySelector(`.film-details__comment-input`).disabled = value;
    this.getElement().querySelectorAll(`.film-details__emoji-item`)
      .forEach((it) => {
        it.disabled = value;
      });
  }

  setCommentDeleteButtonDisabled(button, value) {
    button.innerHTML = value ? `Deleting...` : `Delete`;
    button.disabled = value;
  }

  setEmoji(evt) {
    const selectedEmoji = evt.target.id.replace(`emoji-`, ``);

    const selectedEmojiElement = this.getElement().querySelector(`.film-details__add-emoji-label`);
    selectedEmojiElement.innerHTML = `<img src="images/emoji/${selectedEmoji}.png" width="55" height="55" alt="emoji-${selectedEmoji}">`;
  }

  _parseData() {
    const result = {
      comment: ``,
      emotion: `smile`,
      date: new Date(),
    };
    const newCommentElement = this.getElement().querySelector(`.film-details__new-comment`);
    const commentTextElement = newCommentElement.querySelector(`.film-details__comment-input`);
    const allEmojis = newCommentElement.querySelectorAll(`.film-details__emoji-item`);
    result.comment = commentTextElement.value;
    allEmojis.forEach((it) => {
      if (it.checked) {
        result.emotion = it.value;
      }
    });
    return result;
  }

  setCloseClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
    this._closeClickHandler = handler;
  }

  setWatchlistClickHandler(handler) {
    this.getElement().querySelector(`#watchlist`).addEventListener(`click`, handler);
    this._watchlistClickHandler = handler;
  }

  setWatchedClickHandler(handler) {
    this.getElement().querySelector(`#watched`).addEventListener(`click`, handler);
    this._watchedClickHandler = handler;
  }

  setFavoriteClickHandler(handler) {
    this.getElement().querySelector(`#favorite`).addEventListener(`click`, handler);
    this._favoriteClickHandler = handler;
  }

  setEmojiClickHandler(handler) {
    this.getElement().querySelectorAll(`.film-details__emoji-item`)
      .forEach((it) => it.addEventListener(`change`, handler));
    this._emojiClickHandler = handler;
  }

  setDeleteButtonsClickHandler(handler) {
    this.getElement().querySelectorAll(`.film-details__comment-delete`)
      .forEach((it) => it.addEventListener(`click`, handler));
    this._deleteButtonsClickHandler = handler;
  }

  setCommentSubmitHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, handler);
    this._commentSubmitHandler = handler;
  }
}
