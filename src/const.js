const DESCRIPTION_PREVIEW_LENGTH = 140;

const MONTH_NAMES = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

const FilmsQuantity = {
  ALL: 22,
  ADDITIONAL: 2,
  SHOWING_ON_START: 5,
  SHOWING_BY_BUTTON: 5,
};

const AdditionalCategory = {
  RATE: {
    title: `Top rated`,
    additionalClass: `js-tr`,
  },
  COMMENT: {
    title: `Most commented`,
    additionalClass: `js-mc`
  }
};

const PlaceInsert = {
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`
};

export {DESCRIPTION_PREVIEW_LENGTH, MONTH_NAMES, FilmsQuantity, AdditionalCategory, PlaceInsert};
