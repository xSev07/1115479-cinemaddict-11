import {remove, render} from "../utils/render";
import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";

export default class FilmController {
  /**
   * Создает экземплят класса FilmController
   *
   * @param {HTMLElement} container контейнер для карточки фильма
   * @param {HTMLElement} containerDetails контейнер для детальной информации о фильме
   */
  constructor(container, containerDetails) {
    this._container = container;
    this._containerDetails = containerDetails;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._openFilmDetails = this._openFilmDetails.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
  }

  render(film) {
    this._filmComponent = new FilmCard(film);
    this._filmComponent.setOpenClickHandler(this._openFilmDetails);

    this._filmDetailsComponent = new FilmDetails(film);
    this._filmDetailsComponent.setCloseClickHandler(this._closeFilmDetails);
    render(this._container, this._filmComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._closeFilmDetails();
    }
  }

  _closeFilmDetails() {
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _openFilmDetails() {
    render(this._containerDetails, this._filmDetailsComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }
}
