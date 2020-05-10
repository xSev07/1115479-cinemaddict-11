import PageController from "./controllers/page";
import {generateFilms} from "./mocks/film";
import {FilmsQuantity} from "./const";

const moment = require(`moment`);
const momentDurationFormatSetup = require(`moment-duration-format`);

momentDurationFormatSetup(moment);

const films = generateFilms(FilmsQuantity.ALL);
const pageController = new PageController(films);
pageController.render();
