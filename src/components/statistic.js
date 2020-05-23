import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import AbstractSmartComponent from "./abstract-smart-component";
import {getProfileRank, getWatchedFilms} from "../utils/common";

const createChart = () => {
  const BAR_HEIGHT = 50;
  const statisticCtx = document.querySelector(`.statistic__chart`);

  // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
  statisticCtx.height = BAR_HEIGHT * 5;

  const myChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [`Sci-Fi`, `Animation`, `Fantasy`, `Comedy`, `TV Series`],
      datasets: [{
        data: [11, 8, 7, 4, 3],
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });

  return myChart;
};

const getTopGenre = (films) => {
  const allGenresRaw = films.map((it) => it.genres);
  const allGenres = [].concat(...allGenresRaw);
  const genresStatistic = allGenres.reduce((acc, it) => {
    acc[it] = (acc[it] || 0) + 1;
    return acc;
  }, {});
  const maxGenre = {
    genre: ``,
    count: 0
  };
  for (let key in genresStatistic) {
    if ({}.hasOwnProperty.call(genresStatistic, key)) {
      const currentValue = genresStatistic[key];
      if (currentValue > maxGenre.count) {
        maxGenre.genre = key;
        maxGenre.count = currentValue;
      }
    }
  }
  return maxGenre.genre;
};

const createStatisticTemplate = (films) => {
  const rank = getProfileRank(films);
  const watchedFilms = getWatchedFilms(films);
  const count = watchedFilms.length;
  const watchedTime = watchedFilms.reduce((acc, it) => {
    return acc + it.runtime;
  }, 0);
  const hours = Math.trunc(watchedTime / 60);
  const minutes = watchedTime - hours * 60;
  const genre = getTopGenre(watchedFilms);
  return (`
  <section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked="">
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${count} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${genre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>
  `);
};

export default class Statistic extends AbstractSmartComponent {
  constructor() {
    super();
    this._films = [];
    this.clickHandler = null;
    this._statsChangeHandler = null;
    this.setClickHandler = this.setClickHandler.bind(this);
    this.setStatsChangeHandler = this.setStatsChangeHandler.bind(this);
  }

  getTemplate() {
    return createStatisticTemplate(this._films);
  }

  setFilms(films) {
    this._films = films;
  }

  createChart() {
    createChart();
  }

  setClickHandler(handler) {
    this.getElement().querySelector(`.statistic`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler();
      });
    this.clickHandler = handler;
  }

  setStatsChangeHandler(handler) {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`change`, handler);
    this._statsChangeHandler = handler;
  }

  recoveryListeners() {
    // this.setClickHandler(this.clickHandler);
    this.setStatsChangeHandler(this._statsChangeHandler);
  }
}
