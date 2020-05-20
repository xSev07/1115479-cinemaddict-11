import API from "./api";
import PageController from "./controllers/page";

const moment = require(`moment`);
const momentDurationFormatSetup = require(`moment-duration-format`);
const AUTHORIZATION = `Basic gfjdoHFJDL59fdsfds7`;
const api = new API(AUTHORIZATION);
momentDurationFormatSetup(moment);

api.getFilms()
  .then((films) => {
    const pageController = new PageController(films);
    pageController.render();
  });
