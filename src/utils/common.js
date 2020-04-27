import {MONTH_NAMES} from "../const";

export const getFormatedNumber = (number) => {
  return number < 10 ? `0${number}` : `${number}`;
};

export const getFormatedDate = (date) => {
  return `${getFormatedNumber(date.getDate())} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
};

export const getFormatedCommentDate = (date) => {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${getFormatedNumber(date.getHours())}:${getFormatedNumber(date.getMinutes())}`;
};

