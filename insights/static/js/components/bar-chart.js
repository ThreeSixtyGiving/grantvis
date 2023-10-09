const MS_IN_DAY = (1000 * 60 * 60 * 24); // number of milliseconds in a day
const date = new Date();
let daysRange, lastYearLabel, language;

let days = []

/* TODO awardDate assumptions made here */

export const barChart = {
  name: 'BarChart',
  props: {
    chartData: { type: Array, required: true },
    currentApiUrl: { type: URL, required: true },
    color: { type: String, default: 'orange' },
  },
  data() {
    return {
      compiledData: [],
      bars: null,
      width: 600,
      height: 300,
      margin: { top: 20, right: 30, bottom: 40, left: 50 },
    }
  },
  computed: {
    fillColor: function(){
      if (this.color === 'teal'){
        return 'var(--color-teal)';
      }

      /* default */
      return 'var(--color-orange)';
    },
    processOlderData: function () {
      this.compiledData = [{
        key: 'Older',
        doc_count: 0
      }];

      this.chartData.forEach((item, index) => {
        const daysOld = Math.ceil((date - new Date(item.key)) / MS_IN_DAY);
        days.push(item.key)
        if (daysOld > 365 * 20) {
          // Push this.chartData older than 20 years into compiledData Older entry
          this.compiledData[0].doc_count += this.chartData[index].doc_count;
        } else {
          // Insert all other data > 20 years old to compiledData dataset in reverse order
          this.compiledData.splice(1, 0, item);
        }
      });

      // Check if date range is filtered /*
      if (this.currentApiUrl.searchParams.get("min_date")) {
        return this.chartData.reverse()
      }
      return this.compiledData;
    }
  },
  created() {
    lastYearLabel = '';
  },
  mounted() {
    this.drawChart();
    this.setTooltips();
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.drawChart();
        this.setTooltips();
      },
    },
  },
  methods: {
    itemClicked(data){
      if (data.url){
        this.$emit("select", data.url);
      }
    },
    setTooltips(){
      this.bars.attr('data-tippy-content', (d)=>{
          return `<strong>${this.parseLabels(d.key)}</strong><br>${d.doc_count.toLocaleString()}`;
      });
      tippy(this.bars.nodes(), {
        allowHTML: true
      });
    },
    parseLabels (value) {
      /* TODO This may not be needed as there is "key_as_string" property that already does this */
      if (typeof value !== 'string') {
        return new Date(value).toLocaleString(language, { year: 'numeric' });
      } else {
        return value;
      }
    },
    drawChart() {
      const dataset = this.processOlderData;

      d3.select(this.$refs.chart)
        .select('svg')
        .remove();

      const svg = d3.select(this.$refs.chart)
        .append('svg')
        .attr("viewBox", `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`)
        .append('g')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

      const x = d3.scaleBand()
        .domain(dataset.map(d => this.parseLabels(d.key)))
        .range([0, this.width])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.doc_count)])
        .nice()
        .range([this.height, 0]);

      const xAxis = svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${this.height})`)
        .call(d3.axisBottom(x).tickSize(0));

      if (dataset.length > 8) {
        xAxis.selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-0.8em')
          .attr('dy', '0.15em')
          .attr('transform', 'rotate(-45)');
      }

      const tooltip = d3.select(this.$refs.tooltip)

      svg.selectAll('.bar')
        .remove();

      this.bars = svg.selectAll('.bar')
        .data(dataset)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(this.parseLabels(d.key)))
        .attr('y', d => y(d.doc_count))
        .attr('width', x.bandwidth())
        .attr('height', d => this.height - y(d.doc_count))
        .style("margin-left", function(d) { return "0px"; })
        .style("cursor", "pointer")
        .attr('stroke', this.fillColor)
        .attr('stroke-width', '1')
        .attr('fill', (d) => {
          /* If a year is selected then don't fill it */
          if (this.currentApiUrl.searchParams.get('awardDate')) {
            if (this.currentApiUrl.searchParams.getAll('awardDate').includes(this.parseLabels(d.key))){
              return this.fillColor;
            } else {
              return 'white';
            }
          }
          return  this.fillColor
        })
        .on('click', (event, data) => { this.itemClicked(data) } )

      svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y).ticks(5));
    },
  },
  template: `
    <div ref="chart" style="width: 100%; position: relative;"></div>
  `
};
