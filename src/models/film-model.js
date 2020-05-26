export default class FilmModel {
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

  toRaw() {
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.title,
        "alternative_title": this.titleOriginal,
        "total_rating": this.rating,
        "poster": this.poster,
        "age_rating": this.age,
        "director": this.director,
        "writers": this.writers,
        "actors": this.actors,
        "release": {
          "date": this.releaseDate.toISOString(),
          "release_country": this.country
        },
        "runtime": this.runtime,
        "genre": this.genres,
        "description": this.description,
      },
      "user_details": {
        "watchlist": this.watchlist,
        "already_watched": this.history,
        "watching_date": this.watchingDate.toISOString(),
        "favorite": this.favorites
      }
    };
  }

  static parseFilm(data) {
    return new FilmModel(data);
  }

  static parseFilms(data) {
    return data.map(FilmModel.parseFilm);
  }

  static clone(data) {
    return new FilmModel(data.toRaw());
  }
}
