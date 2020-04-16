import {MONTH_NAMES} from "./const";

const getFormatedNumber = (number) => {
  return number < 10 ? `0${number}` : `${number}`;
};

const getFormatedDate = (date) => {
  return `${getFormatedNumber(date.getDate())} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
};

const getFormatedCommentDate = (date) => {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${getFormatedNumber(date.getHours())}:${getFormatedNumber(date.getMinutes())}`;
};

export {getFormatedNumber, getFormatedDate, getFormatedCommentDate};
