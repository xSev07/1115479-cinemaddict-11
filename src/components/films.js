import AbstractComponent from "./abstract-component";

const createFilmsTemplate = () => {
  return (`
    <section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    
        <div class="films-list__container"></div>
       </section>
    </section>
  `);
};

export default class Films extends AbstractComponent {
  // constructor(data) {
  //   super();
  //   this.setData(data);
  // }

  getTemplate() {
    return createFilmsTemplate();
  }

  // setData(data) {
  //   this._haveData = !!data.length;
  // }
}
