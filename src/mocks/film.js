import {getFormatedNumber} from "../util";

const Count = {
  DESCRIPTION_MIN: 1,
  DESCRIPTION_MAX: 5,
  COMMENTS_MIN: 0,
  COMMENTS_MAX: 5,
  GENRES_MIN: 1,
  GENRES_MAX: 3,
  HUMANS_MIN: 1,
  HUMANS_MAX: 3,
};

const DAYS_IN_YEAR = 365;
const YEARS_RANGE = 10;
const SECOND_IN_DAY = 24 * 60 * 60;
const MS_IN_SECOND = 1000;

const filmsName = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`,
  `The Great Flamarion`,
  `Made for Each Other`
];

const ages = [
  `0+`,
  `6+`,
  `12+`,
  `16+`,
  `18+`
];

const posters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const genres = [
  `Musical`,
  `Western`,
  `Drama`,
  `Comedy`,
  `Cartoon`,
  `Mystery`
];

const humans = [
  `Anthony Mann`,
  `Anne Wigton`,
  `Heinz Herald`,
  `Richard Weil`,
  `Erich von Stroheim`,
  `Mary Beth Hughes`,
  `Dan Duryea`,
  `Tim Macoveev`,
  `John Doe`
];

const countrys = [
  `USA`,
  `Canada`,
  `Brasil`,
  `Argentina`
];

const emojis = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];

const reviewFish = `The Earth is captured by alien cats . This screenshot was taken by the famous tinfoil portrait artist ijustfoundtheporn on the official tinfoil cat Tumblr. You can see from the original of the post that it had already been posted thousands of times before anyone had even noticed the plot hole. The account was also highlighted on an article on Gizmodo , so it is no wonder he found the picture so noteworthy that he eventually post it on Tumblr. However, since his post it had been collected and reblogged thousands of times (many of them by the same user on the Tumblr and many others even on reddit.com /r/tumblr ) by dozens of tinfoil cat fans around the world.`;
const reviews = reviewFish.split(`. `);
const descriptionFish = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const descriptions = descriptionFish.split(`. `);

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomBoolean = () => {
  return Math.random() > 0.5;
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

const getRandomDate = () => {
  const targetDate = new Date(`1950-01-01T00:00:00`);
  const sign = getRandomBoolean() ? 1 : -1;
  const diffDays = sign * getRandomIntegerNumber(0, YEARS_RANGE * DAYS_IN_YEAR);
  const diffTime = getRandomIntegerNumber(0, SECOND_IN_DAY) * MS_IN_SECOND;
  targetDate.setDate(targetDate.getDate() + diffDays);
  targetDate.setTime(targetDate.getTime() + diffTime);

  return targetDate;
};

const generateRating = () => {
  return (Math.random() * 10).toFixed(1);
};

const generateRandomArray = (array, min, max) => {
  const count = getRandomIntegerNumber(min, max);
  const copy = array.slice();
  const res = [];
  for (let i = 0; i < count; i++) {
    const index = getRandomIntegerNumber(0, copy.length);
    res.push(copy.splice(index, 1));
  }
  return res;
};

const generateDescription = () => {
  return generateRandomArray(descriptions, Count.DESCRIPTION_MIN, Count.DESCRIPTION_MAX).join(`. `);
};

const generateGenres = () => {
  return generateRandomArray(genres, Count.GENRES_MIN, Count.GENRES_MAX);
};

const generateRuntime = () => {
  const hours = getRandomIntegerNumber(0, 2);
  const minutes = hours === 0 ? getRandomIntegerNumber(30, 59) : getRandomIntegerNumber(0, 59);
  return `${hours}h ${getFormatedNumber(minutes)}m`;
};

const generateHumans = () => {
  return generateRandomArray(humans, Count.HUMANS_MIN, Count.HUMANS_MAX);
};

const generateComment = () => {
  return {
    text: getRandomArrayItem(reviews),
    emoji: getRandomArrayItem(emojis),
    author: getRandomArrayItem(humans),
    date: getRandomDate(),
  };
};

const generateComments = () => {
  const count = getRandomIntegerNumber(Count.COMMENTS_MIN, Count.COMMENTS_MAX);
  return Array.from(Array(count), generateComment);
};

const generateFilm = () => {
  const title = getRandomArrayItem(filmsName);
  return {
    title,
    titleOriginal: `Original: ${title}`,
    age: getRandomArrayItem(ages),
    poster: getRandomArrayItem(posters),
    rating: generateRating(),
    genres: generateGenres(),
    description: generateDescription(),
    comments: generateComments(),
    director: getRandomArrayItem(humans),
    writers: generateHumans(),
    actors: generateHumans(),
    releaseDate: getRandomDate(),
    runtime: generateRuntime(),
    country: getRandomArrayItem(countrys),
    watchlist: getRandomBoolean(),
    history: getRandomBoolean(),
    favorites: getRandomBoolean()
  };
};

const generateFilms = (count) => {
  return Array.from(Array(count), generateFilm);
};

export {generateFilms, generateFilm};
