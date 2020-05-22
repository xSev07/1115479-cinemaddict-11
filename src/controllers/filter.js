import {FilterType, Pages} from "../const";
import {render, replace} from "../utils/render";
import FilterComponent from "../components/filter";
import {getFilmsByFilter} from "../utils/filter";

export default class FilterController {
  constructor(container, filmsModel, onPageChange) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;
    this._onPageChange = onPageChange;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onStatisticClick = this._onStatisticClick.bind(this);

    this._filmsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getFilmsByFilter(this._filmsModel.getFilmsAll(), filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);
    this._filterComponent.setStatisticClickHandler(this._onStatisticClick);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._container, this._filterComponent);
    }
  }

  _onDataChange() {
    this.render();
  }

  _onFilterChange(evt, filterType) {
    if (this._activeFilterType === filterType) {
      return;
    }
    this._onPageChange(Pages.FILMS);
    this._filmsModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render();
  }

  _onStatisticClick(evt) {
    this._activeFilterType = null;
    this._onPageChange(Pages.STATISTIC);
    this.render();
  }
}
