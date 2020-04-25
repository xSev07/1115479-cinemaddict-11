import {MONTH_NAMES} from "./const";

export const PlaceInsert = {
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`
};

export const getFormatedNumber = (number) => {
  return number < 10 ? `0${number}` : `${number}`;
};

export const getFormatedDate = (date) => {
  return `${getFormatedNumber(date.getDate())} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
};

export const getFormatedCommentDate = (date) => {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${getFormatedNumber(date.getHours())}:${getFormatedNumber(date.getMinutes())}`;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

export const render = (container, element, place = PlaceInsert.BEFORE_END) => {
  switch (place) {
    case PlaceInsert.AFTER_BEGIN:
      container.prepend(element);
      break;
    case PlaceInsert.BEFORE_END:
      container.append(element);
      break;
    case PlaceInsert.AFTER_END:
      container.parentNode.append(element);
      break;
  }
};
