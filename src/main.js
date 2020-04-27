import Films from "./components/films";
import FilmsController from "./controllers/films";
import {generateFilms} from "./mocks/film";
import Profile from "./components/profile";
import {render} from "./utils/render";
import SiteMenu from "./components/site-menu";
import Sort from "./components/sort";
import Statistics from "./components/statistics";
import {FilmsQuantity} from "./const";

const films = generateFilms(FilmsQuantity.ALL);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);

render(siteHeaderElement, new Profile());
render(siteMainElement, new SiteMenu(films));
render(siteMainElement, new Sort());

const filmsComponent = new Films(films);
const filmsController = new FilmsController(filmsComponent);
render(siteMainElement, filmsComponent);

if (films.length > 0) {
  filmsController.render(films);
}

render(siteFooterStatisticsElement, new Statistics(films.length));
