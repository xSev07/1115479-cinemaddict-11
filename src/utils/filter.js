import {FilterType} from "../const";
import {isFavoritesFilm, isHistoryFilm, isWatchlistFilm} from "./common";


const getWatchlistFilms = (films) => {
  return films.filter((it) => isWatchlistFilm(it));
};

const getHistoryFilms = (films) => {
  return films.filter((it) => isHistoryFilm(it));
};

const getFavoritesFilms = (films) => {
  return films.filter((it) => isFavoritesFilm(it));
};

const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.WATCHLIST:
      return getWatchlistFilms(films);
    case FilterType.HISTORY:
      return getHistoryFilms(films);
    case FilterType.FAVORITES:
      return getFavoritesFilms(films);
  }
  return films;
};

export {getFilmsByFilter};
