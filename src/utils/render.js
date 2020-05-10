export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

export const PlaceInsert = {
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`
};
export const render = (container, component, place = PlaceInsert.BEFORE_END) => {
  switch (place) {
    case PlaceInsert.AFTER_BEGIN:
      container.prepend(component.getElement());
      break;
    case PlaceInsert.BEFORE_END:
      container.append(component.getElement());
      break;
    case PlaceInsert.AFTER_END:
      container.parentNode.append(component.getElement());
      break;
  }
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  if (parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};
