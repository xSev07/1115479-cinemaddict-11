import {MONTH_NAMES, SortType} from "../const";

export const getFormatedNumber = (number) => {
  return number < 10 ? `0${number}` : `${number}`;
};

export const getFormatedDate = (date) => {
  return `${getFormatedNumber(date.getDate())} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
};

export const getFormatedCommentDate = (date) => {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${getFormatedNumber(date.getHours())}:${getFormatedNumber(date.getMinutes())}`;
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
