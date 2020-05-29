import PageController from "./controllers/page-controller";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import API from "./api/api";
import Provider from "./api/provider";
import Store from "./api/store";

momentDurationFormatSetup(moment);

const AUTHORIZATION = `Basic gfjdoHFJDL59fdsfds7`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict--localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const pageController = new PageController(apiWithProvider);
pageController.render();

// window.addEventListener(`load`, () => {
//   navigator.serviceWorker.register(`/sw.js`);
// });
