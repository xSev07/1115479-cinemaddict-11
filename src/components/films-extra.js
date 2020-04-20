export const createFilmsExtraTemplate = (data) => {
  return (`
    <section class="films-list--extra">
      <h2 class="films-list__title">${data.title}</h2>

      <div class="films-list__container ${data.additionalClass}"></div>
     </section>
  `);
};
