import PageController from "./controllers/page-controller";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

momentDurationFormatSetup(moment);

const pageController = new PageController();
pageController.render();

`tunc`
