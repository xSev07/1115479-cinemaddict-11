import {FilterType} from "../const";
import {remove, render, replace} from "../utils/render";
import FilterComponent from "../components/filter";
import {getAllFilters, getFilmsByFilter} from "../utils/filter";

export default class FilterController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._filmsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const filters = getAllFilters(this._filmsModel.getFilmsAll(), this._activeFilterType);

    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);
    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._container, this._filterComponent);
    }
  }

  _onDataChange() {
    this.render();
  }

  _onFilterChange(filterType) {
    this._filmsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
