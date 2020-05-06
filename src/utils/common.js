import {SortType} from "../const";
import moment from "moment";

export const getFormatedNumber = (number) => {
  return moment.duration(number, `m`).format(`hh[h] mm[m]`);
};

export const getFormatedDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const getFormatedCommentDate = (date) => {
  // if ()
  return moment(date).startOf(`day`).fromNow();
};

export const sortFilms = (films, sortType) => {
  let sortedFilms = films.slice();
  switch (sortType) {
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
