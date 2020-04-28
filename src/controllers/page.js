import {generateFilms} from "../mocks/film";
import {FilmsQuantity} from "../const";
import {render} from "../utils/render";
import Profile from "../components/profile";
import SiteMenu from "../components/site-menu";
import Sort from "../components/sort";
import Films from "../components/films";
import FilmsController from "./films";
import Statistics from "../components/statistics";


export default class PageController {
  constructor() {
    this._profileComponent = new Profile();
    this._sortComponent = new Sort();
  }

  render(films) {
    const siteHeaderElement = document.querySelector(`.header`);
    const siteMainElement = document.querySelector(`.main`);
    const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);

    const siteMenuComponent = new SiteMenu(films);
    const filmsComponent = new Films(films);
    const filmsController = new FilmsController(filmsComponent);

    render(siteHeaderElement, this._profileComponent);
    render(siteMainElement, siteMenuComponent);
    render(siteMainElement, this._sortComponent);
    render(siteMainElement, filmsComponent);

    if (films.length > 0) {
      filmsController.render(films);
    }

    render(siteFooterStatisticsElement, new Statistics(films.length));

    this._sortComponent.setClickHandler(() => {
      const showingFilmsCount = FilmsQuantity.SHOWING_ON_START;
      const sortedFilms = films.slice();
      filmsController.renderFilmsAfterSorting(sortedFilms, 0, showingFilmsCount);
    });
  }
}
