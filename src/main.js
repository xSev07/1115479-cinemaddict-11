import PageController from "./controllers/page-controller";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import API from "./api/api";
import Provider from "./api/provider";
import Store from "./api/store";

momentDurationFormatSetup(moment);

const AUTHORIZATION = `Basic gfjdoHFJDL59fdsfds7`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX_FILMS = `cinemaddict-films--localstorage`;
const STORE_PREFIX_COMMENTS = `cinemaddict-comments--localstorage`;
const STORE_VER = `v1`;
const STORE_NAME_FILMS = `${STORE_PREFIX_FILMS}-${STORE_VER}`;
const STORE_NAME_COMMENTS = `${STORE_PREFIX_COMMENTS}-${STORE_VER}`;
const api = new API(END_POINT, AUTHORIZATION);
const storeFilms = new Store(STORE_NAME_FILMS, window.localStorage);
const storeComments = new Store(STORE_NAME_COMMENTS, window.localStorage);
const apiWithProvider = new Provider(api, storeFilms, storeComments);

const pageController = new PageController(apiWithProvider);
pageController.render();

// window.addEventListener(`load`, () => {
//   navigator.serviceWorker.register(`/sw.js`);
// });
