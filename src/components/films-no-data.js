import AbstractSmartComponent from "./abstract-smart-component";
import {NoDataStatus} from "../const";

const createFilmsTemplate = (status) => {
  return (`
    <section class="films">
      <section class="films-list">
        <h2 class="films-list__title">${status}</h2>
       </section>
    </section>
  `);
};

export default class FilmsNoData extends AbstractSmartComponent {
  constructor() {
    super();
    this._status = NoDataStatus.LOADING;
  }

  getTemplate() {
    return createFilmsTemplate(this._status);
  }

  setStatus(status) {
    this._status = status;
    this.rerender();
  }

  recoveryListeners() {

  }
}
