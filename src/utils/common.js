import {Period, Rank, SortType} from "../const";
import moment from "moment";

export const getFormatedNumber = (number) => {
  return moment.duration(number, `m`).format(`hh[h] mm[m]`);
};

export const getFormatedDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const getFormatedCommentDate = (date) => {
  const currentDate = moment(new Date());
  const targetDate = moment(date);
  const diffDays = currentDate.diff(targetDate, `days`);
  if (diffDays > 5) {
    return targetDate.startOf(`day`).fromNow();
  } else {
    return targetDate.format(`YYYY/MM/DD hh:mm`);
  }
};

export const sortFilms = (films, sortType) => {
  let sortedFilms = films.slice();
  switch (sortType) {
    case SortType.DEFAULT:
      sortedFilms = sortedFilms.sort((a, b) => a.id - b.id);
      break;
    case SortType.DATE:
      sortedFilms = sortedFilms.sort((a, b) => b.releaseDate - a.releaseDate);
      break;
    case SortType.RATING:
      sortedFilms = sortedFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.COMMENTS:
      sortedFilms = sortedFilms.sort((a, b) => b.comments.length - a.comments.length);
      break;
  }
  return sortedFilms;
};

export const isWatchlistFilm = (film) => {
  return film.watchlist;
};

export const isHistoryFilm = (film) => {
  return film.history;
};

export const isFavoritesFilm = (film) => {
  return film.favorites;
};

export const transformToFirstCapitalSymbol = (str) => {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
};

export const getWatchedFilms = (films) => {
  return films.filter((it) => it.history);
};

export const getProfileRank = (films) => {
  let count = getWatchedFilms(films).length;
  let rank = ``;
  if (count > 0 && count <= 10) {
    rank = Rank.LOW;
  } else if (count > 10 && count <= 20) {
    rank = Rank.MIDDLE;
  } else if (count > 20) {
    rank = Rank.HIGH;
  }
  return rank;
};

export const getWatchedFilmsByPeriod = (films, period) => {
  const watchedFilms = getWatchedFilms(films);
  let targetDate = new Date();
  switch (period) {
    case Period.ALL:
      targetDate = new Date(0);
      break;
    case Period.TODAY:
      break;
    case Period.WEEK:
      targetDate.setDate(targetDate.getDay() - 6);
      break;
    case Period.MONTH:
      targetDate.setMonth(targetDate.getMonth() - 1);
      break;
    case Period.YEAR:
      targetDate.setFullYear(targetDate.getFullYear() - 1);
      break;
  }
  targetDate.setHours(0, 0, 0);
  return watchedFilms.filter((it) => it.watchingDate >= targetDate);
};
