import PageController from "./controllers/page";

const moment = require(`moment`);
const momentDurationFormatSetup = require(`moment-duration-format`);

momentDurationFormatSetup(moment);

const pageController = new PageController();
pageController.render();

// api.getFilms()
//   .then((films) => {
//     const pageController = new PageController(films);
//     pageController.render();
//   });
