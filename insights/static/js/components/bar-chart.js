const MS_IN_DAY = (1000 * 60 * 60 * 24); // number of milliseconds in a day
const date = new Date();
let lastYearLabel, language;
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
      
      const daysRange = Math.ceil(
        (
            Math.max(...this.chartData.labels) - Math.min(...this.chartData.labels)
        ) / MS_IN_DAY
      )

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
              autoSkip: false,
              callback(value, index, ticks) {
                if (value instanceof Date) {
                  const year = value.toLocaleString(language, { year: 'numeric' });
                  let label = null;
                  
                  if (daysRange >= 365) {
                    if (date.getFullYear() - year >= 20) {
                      label = null;
                    } else if (year !== lastYearLabel) {
                      label = year;
                    } else {
                      label = null;
                    }
                  } else {
                    label = value.toLocaleString(language, { month: 'short', year: 'numeric' });
                  }
                  
                  lastYearLabel = year;

                  return label;
                } else {
                  return awardDates ? null : value;
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
  created() {
    lastYearLabel = '';
  },
  mounted() {
    !awardMinYear ? this.renderChart(compiledData, this.options) : this.renderChart(this.chartData, this.options);
  }
}
