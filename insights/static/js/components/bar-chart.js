const MS_IN_DAY = (1000 * 60 * 60 * 24); // number of milliseconds in a day
const date = new Date();
let lastYearLabel, language;
if (window.navigator.languages) {
  language = window.navigator.languages[0];
} else {
  language = window.navigator.userLanguage || window.navigator.language;
}

// Create empty dataset with 'Older' entry to be populated with this.chartData entries
const compiledData = {
  labels: ['Older'],
  datasets: [{
    label: 'Data',
    backgroundColor: '#DE6E26',
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
            // Push this.chartData older than 20 years into compiledData Older entry
            compiledData.datasets[0].data[0] += this.chartData.datasets[0].data[index];
        } else {
            // Push all other data > 20 years old to compiledData dataset
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
                // Parse and display date labels
                if (value instanceof Date) {
                  const month = value.toLocaleString(language, { month: 'numeric' });
                  const year = value.toLocaleString(language, { year: 'numeric' });
                  let label = null;
                  
                  if (daysRange >= 1460) {
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
                    label = value.toLocaleString(language, { month: 'short', year: 'numeric' });
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
    !awardMinYear ? this.renderChart(compiledData, this.options) : this.renderChart(this.chartData, this.options);
  }
}
