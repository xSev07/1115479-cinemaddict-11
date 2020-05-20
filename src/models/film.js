export default class Film {
  constructor(data) {
    const filmInfo = data[`film_info`];
    const release = filmInfo[`release`];
    const userDetails = data[`user_details`];
    this.id = data[`id`];
    this.comments = data[`comments`];
    this.title = filmInfo[`title`];
    this.titleOriginal = filmInfo[`alternative_title`];
    this.age = filmInfo[`age_rating`];
    this.poster = filmInfo[`poster`];
    this.rating = filmInfo[`total_rating`];
    this.genres = filmInfo[`genre`];
    this.description = filmInfo[`description`];
    this.director = filmInfo[`director`];
    this.writers = filmInfo[`writers`];
    this.actors = filmInfo[`actors`];
    this.runtime = filmInfo[`runtime`];
    this.releaseDate = new Date(release[`date`]);
    this.country = release[`release_country`];
    this.watchlist = Boolean(userDetails[`watchlist`]);
    this.history = Boolean(userDetails[`already_watched`]);
    this.favorites = Boolean(userDetails[`favorite`]);
    this.watchingDate = new Date(userDetails[`watching_date`]);
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }
}
