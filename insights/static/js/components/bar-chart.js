const MS_IN_DAY = (1000 * 60 * 60 * 24); // number of milliseconds in a day
const date = new Date();
let daysRange, lastYearLabel, language;
let days = []
if (window.navigator.languages) {
  language = window.navigator.languages[0];
} else {
  language = window.navigator.userLanguage || window.navigator.language;
}

// Create empty dataset with 'Older' entry to be populated with this.chartData entries
const compiledData = {
  labels: ['Older'],
  datasets: [{
    backgroundColor: '#DE6E26',
    hoverBackgroundColor: '#A8501A',
    data: [0]
  }]
};

// Check if date range is filtered
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
  props: ['chartData', 'hideLegend'],
  data() {
      return {}
  },
  computed: {
    options: function () {

      this.chartData.forEach((item, index) => {
        const daysOld = Math.ceil((date - new Date(item.key)) / MS_IN_DAY);
        days.push(item.key)
        if (daysOld > 365 * 20) {
          // Push this.chartData older than 20 years into compiledData Older entry
          compiledData.datasets[0].data[0] += Number(this.chartData[index].doc_count);
        } else {
          // Insert all other data > 20 years old to compiledData dataset in reverse order
            compiledData.labels.splice(1, 0, item.key);
            compiledData.datasets[0].data.splice(1, 0, item.doc_count);
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
              if (typeof tooltipItem[0].xLabel !== 'string') {
                return new Date(tooltipItem[0].xLabel).toLocaleString(language, { year: 'numeric' });
              } else {
                return tooltipItem[0].xLabel
              }
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
                // Parse and display date labels
                if (typeof value !== 'string') {
                  const month = new Date(value).toLocaleString(language, { month: 'numeric' });
                  const year = new Date(value).toLocaleString(language, { year: 'numeric' });
                  let label = null;

                  daysRange = Math.ceil((Math.max(...days) - Math.min(...days)) / MS_IN_DAY)
                  if (daysRange > 365 * 4) {
                    // Hide date labels older than 20 years
                    if (date.getFullYear() - year >= 20) {
                      label = null;
                    } else if (month === '10' || month === '11' || month === '12') {
                      // Hide label if month is Oct / Nov / Dec to prevent overlapping
                      label = null;
                    } else if (year !== lastYearLabel) {
                      // Show label on first instance of the year (prevents duplicates)
                      label = year;
                    } else {
                      label = null;
                    }
                  } else {
                    // Show month and year if date range < 1460 days (4 years)
                    label = new Date(value).toLocaleString(language, { month: 'short', year: 'numeric' });
                  }
                  
                  lastYearLabel = year;

                  return label;
                } else {
                  // Show 'Older' (non-date) label if date range isn't filtered
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
    // Switch dataset between original and 'Older' depending on if min date range filter
    this.renderChart(compiledData, this.options)
  }
}
