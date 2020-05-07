import {SortType} from "../const";
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
