export const createFilmsExtraTemplate = (header) => {
  return (`
    <section class="films-list--extra">
      <h2 class="films-list__title">${header}</h2>

      <div class="films-list__container"></div>
     </section>
  `);
};
