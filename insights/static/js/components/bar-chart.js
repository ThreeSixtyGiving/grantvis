const MS_IN_DAY = (1000 * 60 * 60 * 24); // number of milliseconds in a day
const date = new Date();

let language;
if (window.navigator.languages) {
    language = window.navigator.languages[0];
} else {
    language = window.navigator.userLanguage || window.navigator.language;
}

const newData = {
  labels: ['Older'],
  datasets: [{
      label: 'Data',
      backgroundColor: '#F26202',
      data: [],
  }]
};

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
                newData.datasets[0].data[0] += this.chartData.datasets[0].data[index];
            } else {
                newData.labels.push(label);
                newData.datasets[0].data.push(this.chartData.datasets[0].data[index]);
            }
          });

            let params = new URLSearchParams(document.location.search);
            let awardDates = false
            for (const [key, value] of params) {
              if (key.includes('awardDates')) {
                awardDates = true
              }
            }
            
            var daysRange = Math.ceil(
                (
                    Math.max(...this.chartData.labels) - Math.min(...this.chartData.labels)
                ) / MS_IN_DAY
            )
            return {
                responsive: true,
                legend: {
                    display: (this.hideLegend ? false : true)
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false,
                            offsetGridLines: true,
                        },
                        offset: true,
                        ticks: {
                          userCallback(value, index, ticks) {
                            if (value instanceof Date) {
                              const month = new Intl.DateTimeFormat(language, { month: 'long' }).format(value)
                              const year = value.getUTCFullYear()
                              return language.includes('en') ? `${month.substring(0,3)} ${year}` : `${month} ${year}`
                            } else {
                              return awardDates ? '' : value
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
                            return value.toLocaleString()
                          },
                            beginAtZero: true,
                            precision: 0,
                        },
                    }]
                }
            }
        }
    },
    mounted() {
        this.renderChart(newData, this.options)
    }
}
