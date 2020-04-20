import {createSiteMenuTemplate} from "./components/site-menu";
import {createFilmDetailsTemplate} from "./components/film-details";
import {createFilmCardTemplate} from "./components/film-card";
import {createProfileTemplate} from "./components/profile";
import {createFilmsExtraTemplate} from "./components/films-extra";
import {createFilmsTemplate} from "./components/films";
import {createFooterStatistics} from "./components/statistics";
import {createShowMoreButtonTemplate} from "./components/show-more-button";
import {createSortTemplate} from "./components/sort";
import {FilmsQuantity, AdditionalCategory, PlaceInsert} from "./const";
import {generateFilms} from "./mocks/film";

const films = generateFilms(FilmsQuantity.ALL);

const render = (container, htmlText, place = PlaceInsert.BEFORE_END) => {
  container.insertAdjacentHTML(place, htmlText);
};

const renderElementsArray = (array, element, start = 0, finish = array.length) => {
  array.slice(start, finish).
    forEach((it) => {
      render(element, createFilmCardTemplate(it));
    });
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);

render(siteHeaderElement, createProfileTemplate());
render(siteMainElement, createSiteMenuTemplate(films));
render(siteMainElement, createSortTemplate());
render(siteMainElement, createFilmsTemplate());

const filmsElement = siteMainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list__container`);

let showingFilmsCount = FilmsQuantity.SHOWING_ON_START;
renderElementsArray(films, filmsListElement, 0, showingFilmsCount);
render(filmsListElement, createShowMoreButtonTemplate(), PlaceInsert.AFTER_END);

const showMoreButtonElement = filmsElement.querySelector(`.films-list__show-more`);

showMoreButtonElement.addEventListener(`click`, () => {
  const prevFilmCount = showingFilmsCount;
  showingFilmsCount += FilmsQuantity.SHOWING_BY_BUTTON;
  renderElementsArray(films, filmsListElement, prevFilmCount, showingFilmsCount);
  if (showingFilmsCount >= films.length) {
    showMoreButtonElement.remove();
  }
});

const topRatedFilms = films.slice().sort((a, b) => b.rating - a.rating);
if (topRatedFilms[0].rating !== 0) {
  render(filmsElement, createFilmsExtraTemplate(AdditionalCategory.RATE));
  const filmsRatedElement = filmsElement.querySelector(`.js-tr`);
  // const filmsTopContainerElement = filmsRatedElement.querySelector(`.films-list__container`);
  renderElementsArray(topRatedFilms, filmsRatedElement, 0, FilmsQuantity.ADDITIONAL);
}


const mostCommentedFilms = films.slice().sort((a, b) => b.comments.length - a.comments.length);
if (mostCommentedFilms[0].comments.length !== 0) {
  render(filmsElement, createFilmsExtraTemplate(AdditionalCategory.COMMENT));
  const filmsCommentedElement = filmsElement.querySelector(`.js-mc`);
  // const filmsCommentedContainerElement = filmsCommentedElement.querySelector(`.films-list__container`);
  renderElementsArray(mostCommentedFilms, filmsCommentedElement, 0, FilmsQuantity.ADDITIONAL);
}

render(siteFooterStatisticsElement, createFooterStatistics(films.length));

render(siteFooterElement, createFilmDetailsTemplate(films[0]), PlaceInsert.AFTER_END);
