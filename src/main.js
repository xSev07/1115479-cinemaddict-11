import {createSiteMenuTemplate} from "./components/site-menu";
import {createFilmDetailsTemplate} from "./components/film-details";
import {createFilmCardTemplate} from "./components/film-card";
import {createProfileTemplate} from "./components/profile";
import {createFilmsExtraTemplate} from "./components/films-extra";
import {createFilmsTemplate} from "./components/films";
import {createShowMoreButtonTemplate} from "./components/show-more-button";
import {createSortTemplate} from "./components/sort";
import {generateFilms} from "./mocks/film";

const FilmsQuantity = {
  ALL: 20,
  MAIN: 20,
  ADDITIONAL: 2
};

const AdditionalCategory = {
  RATE: `Top rated`,
  COMMENT: `Most commented`
};

const PlaceInsert = {
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`
};

const render = (container, htmlText, place = PlaceInsert.BEFORE_END) => {
  container.insertAdjacentHTML(place, htmlText);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, createProfileTemplate());
render(siteMainElement, createSiteMenuTemplate());
render(siteMainElement, createSortTemplate());
render(siteMainElement, createFilmsTemplate());

const filmsElement = siteMainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list__container`);

const films = generateFilms(FilmsQuantity.ALL);

for (let i = 0; i < FilmsQuantity.MAIN; i++) {
  render(filmsListElement, createFilmCardTemplate(films[i]));
}

render(filmsListElement, createShowMoreButtonTemplate(), PlaceInsert.AFTER_END);
render(filmsElement, createFilmsExtraTemplate(AdditionalCategory.RATE));
render(filmsElement, createFilmsExtraTemplate(AdditionalCategory.COMMENT));

const filmsExtraElement = filmsElement.querySelectorAll(`.films-list--extra`);

filmsExtraElement.forEach((it) => {
  const filmsListExtraElement = it.querySelector(`.films-list__container`);
  for (let i = 0; i < FilmsQuantity.ADDITIONAL; i++) {
    render(filmsListExtraElement, createFilmCardTemplate(films[i]));
  }
});

// render(siteFooterElement, createFilmDetailsTemplate(films[0]), PlaceInsert.AFTER_END);
