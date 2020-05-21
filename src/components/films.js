import AbstractComponent from "./abstract-component";

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

const createFilmsTemplate = () => {
  // const innerContent = haveData ? createHaveDataTemplate() : createNoDataTemplate();
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
