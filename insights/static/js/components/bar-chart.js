const MS_IN_DAY = (1000 * 60 * 60 * 24); // number of milliseconds in a day
const date = new Date();

let language;
if (window.navigator.languages) {
  language = window.navigator.languages[0];
} else {
  language = window.navigator.userLanguage || window.navigator.language;
}

const compiledData = {
  labels: ['Older'],
  datasets: [{
    label: 'Data',
    backgroundColor: '#F26202',
    data: [0]
  }]
};

let params = new URLSearchParams(document.location.search);
let awardDates = false
let awardMinYear = null;
for (const [key, value] of params) {
  if (key.includes('awardDates.min')) {
    awardDates = true;
    if (key.includes('year')) {
      awardMinYear = value;
    }
  }
}

export const barChart = {
  extends: VueChartJs.Bar,
  mixins: [VueChartJs.mixins.reactiveProp],
  props: ['chartData', 'hideLegend', 'percentages'],
  data() {
      return {}
  },
  computed: {
    options: function () {

      this.chartData.labels.forEach((label, index) => {
        const daysOld = Math.ceil((date - new Date(label)) / MS_IN_DAY);
        if (daysOld > 365 * 20) {
            compiledData.datasets[0].data[0] += this.chartData.datasets[0].data[index];
        } else {
            compiledData.labels.push(label);
            compiledData.datasets[0].data.push(this.chartData.datasets[0].data[index]);
        }
      });

      return {
        responsive: true,
        legend: {
          display: (this.hideLegend ? false : true)
        },
        tooltips: { 
          callbacks: {
            title: function(tooltipItem, data) {
              return tooltipItem[0].xLabel.toLocaleString(language, {dateStyle: 'medium', timeStyle: 'short'});
            },
            label: function(tooltipItem, data) {
              return tooltipItem.yLabel.toLocaleString();
            }
          }
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
              offsetGridLines: true
            },
            offset: true,
            ticks: {
              userCallback(value, index, ticks) {
                if (value instanceof Date) {
                  return value.toLocaleString(language, { month: 'short', year: 'numeric' });
                } else {
                  return awardDates ? '' : value;
                }
              }
            },
            display: true,
          }],
          yAxes: [{
            gridLines: {
              display: false,
            },
            ticks: {
              userCallback(value) {
                return value.toLocaleString();
              },
                beginAtZero: true,
                precision: 0
            },
          }]
        }
      }
    }
  },
  mounted() {
    !awardMinYear ? this.renderChart(compiledData, this.options) : this.renderChart(this.chartData, this.options)
  }
}
