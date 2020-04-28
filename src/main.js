import PageController from "./controllers/page";
import {generateFilms} from "./mocks/film";
import {FilmsQuantity} from "./const";

const films = generateFilms(FilmsQuantity.ALL);
const pageController = new PageController(films);
pageController.render();
