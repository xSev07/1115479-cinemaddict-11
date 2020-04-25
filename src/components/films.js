import {createElement} from "../util";

const createNoDataTemplate = () => {
  return (`
    <h2 class="films-list__title">There are no movies in our database</h2>  
  `);
};

const createHaveDataTemplate = () => {
  return (`
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    
    <div class="films-list__container"></div>
  `);
};

const createFilmsTemplate = (haveData) => {
  const innerContent = haveData ? createHaveDataTemplate() : createNoDataTemplate();
  return (`
    <section class="films">
      <section class="films-list">
        ${innerContent}
       </section>
    </section>
  `);
};

export default class Films {
  constructor(data) {
    this._element = null;
    this.setData(data);
  }

  getTemplate() {
    return createFilmsTemplate(this._haveData);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  setData(data) {
    this._haveData = !!data.length;
  }

  removeElement() {
    this._element = null;
  }
}
