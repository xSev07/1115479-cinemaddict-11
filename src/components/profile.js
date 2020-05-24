import AbstractComponent from "./abstract-component";

const createProfileTemplate = (rank) => {
  return (`
    <section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `);
};

export default class Profile extends AbstractComponent {
  constructor() {
    super();
    this._rank = ``;
  }

  getTemplate() {
    return createProfileTemplate(this._rank);
  }

  setRank(rank) {
    this._rank = rank;
  }

  getRank() {
    return this._rank;
  }
}
