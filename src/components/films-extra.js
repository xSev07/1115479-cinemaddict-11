import AbstractComponent from "./abstract-component";

const createFilmsExtraTemplate = (title, additionalClass) => {
  return (`
    <section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>

      <div class="films-list__container ${additionalClass}"></div>
     </section>
  `);
};

export default class FilmsExtra extends AbstractComponent {
  constructor(data) {
    super();
    this._title = data.title;
    this._additionalClass = data.additionalClass;
  }

  getTemplate() {
    return createFilmsExtraTemplate(this._title, this._additionalClass);
  }
}
