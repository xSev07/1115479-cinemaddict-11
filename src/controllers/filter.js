import {FilterType} from "../const";
import {remove, render} from "../utils/render";
import FilterComponent from "../components/filter";
import {getFilmsByFilter} from "../utils/filter";

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
    const allFilms = this._filmsModel.getFilmsAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getFilmsByFilter(allFilms, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    this._filterComponent = new FilterComponent(filters);
    render(this._container, this._filterComponent);
  }

  _onDataChange() {
    this.render();
  }

  _onFilterChange(filterType) {
    this._filmsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
