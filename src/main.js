import FilmCard from "./components/film-card";
import FilmDetails from "./components/film-details";
import Films from "./components/films";
import FilmsExtra from "./components/films-extra";
import Profile from "./components/profile";
import ShowMoreButton from "./components/show-more-button";
import SiteMenu from "./components/site-menu";
import Sort from "./components/sort";
import Statistics from "./components/statistics";
import {FilmsQuantity, AdditionalCategory} from "./const";
import {generateFilms} from "./mocks/film";
import {PlaceInsert, render, remove} from "./utils/render";

const renderFilm = (filmsListElement, footerElement, film) => {

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      closeFilmDetails();
    }
  };

  const closeFilmDetails = () => {
    remove(filmDetailsComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const openFilmDetails = () => {
    render(footerElement, filmDetailsComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const filmComponent = new FilmCard(film);
  filmComponent.setOpenClickHandler(openFilmDetails);

  const filmDetailsComponent = new FilmDetails(film);
  filmDetailsComponent.setCloseClickHandler(closeFilmDetails);
  render(filmsListElement, filmComponent);
};

const renderFilmsCards = (container, element, array, start = 0, finish = array.length) => {
  array.slice(start, finish).
  forEach((it) => {
    renderFilm(element, container, it);
  });
};

const renderFilms = (filmsComponent, films) => {
  const filmsElement = filmsComponent.getElement();
  const filmsListElement = filmsElement.querySelector(`.films-list__container`);
  const siteFooterElement = document.querySelector(`.footer`);

  let showingFilmsCount = FilmsQuantity.SHOWING_ON_START;
  renderFilmsCards(siteFooterElement, filmsListElement, films, 0, showingFilmsCount);

  const showMoreButtonComponent = new ShowMoreButton();
  render(filmsListElement, showMoreButtonComponent, PlaceInsert.AFTER_END);

  showMoreButtonComponent.setClickHandler(() => {
    const prevFilmCount = showingFilmsCount;
    showingFilmsCount += FilmsQuantity.SHOWING_BY_BUTTON;
    renderFilmsCards(siteFooterElement, filmsListElement, films, prevFilmCount, showingFilmsCount);
    if (showingFilmsCount >= films.length) {
      remove(showMoreButtonComponent);
    }
  });

  const topRatedFilms = films.slice().sort((a, b) => b.rating - a.rating);
  if (topRatedFilms[0].rating !== 0) {
    render(filmsElement, new FilmsExtra(AdditionalCategory.RATE));
    const filmsRatedElement = filmsComponent.getElement().querySelector(`.js-tr`);
    renderFilmsCards(siteFooterElement, filmsRatedElement, topRatedFilms, 0, FilmsQuantity.ADDITIONAL);
  }

  const mostCommentedFilms = films.slice().sort((a, b) => b.comments.length - a.comments.length);
  if (mostCommentedFilms[0].comments.length !== 0) {
    render(filmsElement, new FilmsExtra(AdditionalCategory.COMMENT));
    const filmsCommentedElement = filmsComponent.getElement().querySelector(`.js-mc`);
    renderFilmsCards(siteFooterElement, filmsCommentedElement, mostCommentedFilms, 0, FilmsQuantity.ADDITIONAL);
  }
};

const films = generateFilms(FilmsQuantity.ALL);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);

render(siteHeaderElement, new Profile());
render(siteMainElement, new SiteMenu(films));
render(siteMainElement, new Sort());

const filmsComponent = new Films(films);
render(siteMainElement, filmsComponent);

if (films.length > 0) {
  renderFilms(filmsComponent, films);
}

render(siteFooterStatisticsElement, new Statistics(films.length));
