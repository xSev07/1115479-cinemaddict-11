import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import AbstractSmartComponent from "./abstract-smart-component";
import {getWatchedFilms, transformToFirstCapitalSymbol} from "../utils/common";
import {Period} from "../const";

const periods = [
  `all-time`,
  `today`,
  `week`,
  `month`,
  `year`
];

const getGenresStatistic = (films) => {
  const allGenresRaw = films.map((it) => it.genres);
  const allGenres = [].concat(...allGenresRaw);
  return allGenres.reduce((acc, it) => {
    acc[it] = (acc[it] || 0) + 1;
    return acc;
  }, {});
};

const getTopGenre = (films) => {
  const genresStatistic = getGenresStatistic(films);
  const maxGenre = {
    genre: ``,
    count: 0
  };
  for (const key in genresStatistic) {
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

const getChartData = (films) => {
  const watchedFilms = getWatchedFilms(films);
  const genresStatistic = getGenresStatistic(watchedFilms);

  const genres = [];
  for (const key in genresStatistic) {
    if ({}.hasOwnProperty.call(genresStatistic, key)) {
      genres.push({
        genre: key,
        count: genresStatistic[key]
      });
    }
  }
  genres.sort((a, b) => b.count - a.count);
  const result = {
    labels: [],
    data: []
  };
  genres.forEach((it) => {
    result.labels.push(it.genre);
    result.data.push(it.count);
  });

  return result;
};

const createChart = (films) => {
  const chartData = getChartData(films);
  const BAR_HEIGHT = 50;
  const statisticCtx = document.querySelector(`.statistic__chart`);

  statisticCtx.height = BAR_HEIGHT * chartData.labels.length;

  const myChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartData.labels,
      datasets: [{
        data: chartData.data,
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

const createPeriodTemplate = (period, activePeriod) => {
  const periodName = transformToFirstCapitalSymbol(period).replace(`-`, ` `);
  return (`
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${period}" value="${period}" ${period === activePeriod ? `checked` : ``}>
    <label for="statistic-${period}" class="statistic__filters-label">${periodName}</label>
  `);
};

const createStatisticTemplate = (films, activePeriod, rank) => {
  const watchedFilms = getWatchedFilms(films);
  const count = watchedFilms.length;
  const watchedTime = watchedFilms.reduce((acc, it) => {
    return acc + it.runtime;
  }, 0);
  const hours = Math.trunc(watchedTime / 60);
  const minutes = watchedTime - hours * 60;
  const genre = getTopGenre(watchedFilms);

  const periodsTemplate = periods.map((it) => createPeriodTemplate(it, activePeriod)).join(`\n`);

  return (`
  <section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      ${periodsTemplate}
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

export default class StatisticComponent extends AbstractSmartComponent {
  constructor() {
    super();
    this._films = [];
    this._chart = null;
    this._rank = ``;
    this._period = Period.ALL;
    this._statsChangeHandler = null;
    this.setStatsChangeHandler = this.setStatsChangeHandler.bind(this);
  }

  getTemplate() {
    return createStatisticTemplate(this._films, this._period, this._rank);
  }

  setFilms(films) {
    this._films = films;
  }

  setPeriod(period) {
    this._period = period;
  }

  setRank(rank) {
    this._rank = rank;
  }

  createChart() {
    this._chart = createChart(this._films);
  }

  rerender() {
    super.rerender();
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
    this.createChart();
  }

  recoveryListeners() {
    this.setStatsChangeHandler(this._statsChangeHandler);
  }

  setStatsChangeHandler(handler) {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`change`, handler);
    this._statsChangeHandler = handler;
  }
}
