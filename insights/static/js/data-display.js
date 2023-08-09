import { awardDateBarChart } from './components/award-date-bar-chart.js';
import { formatCurrency, formatDate, formatNumber, getAmountSuffix, formatNumberSuffix } from './components/filters.js';
import { choropleth } from './components/choropleth.js';

Vue.component('choropleth', choropleth);
Vue.component('award-date-bar-chart', awardDateBarChart);

Vue.filter('formatCurrency', formatCurrency);
Vue.filter('formatDate', formatDate);
Vue.filter('formatNumber', formatNumber);
Vue.filter('getAmountSuffix', getAmountSuffix);
Vue.filter('formatNumberSuffix', formatNumberSuffix);


var app = new Vue({
    el: '#data-display',
    data() {
        return {
            data: {},
            loading: false,
            loadingQ: 0,
            chartCardMetadata: chartCardMetadata,
            insightsConfig: INSIGHTS_CONFIG,
            grantnavUrl: "",
            currentApiUrl: new URL(window.location),
        }
    },
    watch: {
        'loadingQ': function () {
            if (this.loadingQ > 0) {
                this.loading = true;
            } else {
                this.loading= false;
            }
        },
    },
    methods: {
      async updateData(queryUrl = "/search") {
            this.loadingQ++;

            const url = new URL(`https://search.data.threesixtygiving.org/api/aggregates${queryUrl}`);
//            const url = new URL(`http://localhost:8000/api/aggregates${queryUrl}`);
            let urlSearch = url.searchParams;
            this.currentApiUrl = url;

            if (this.insightsConfig.query){
              url.searchParams.set("query", this.insightsConfig.query);
            }

            /* FIXME: for some reason the aggregate is called amountAwardedFixed
               and the search filter is called amountAwarded so we need to map this
            */
            if (urlSearch.getAll("amountAwarded")){
              urlSearch.delete("amountAwardedFixed");

              urlSearch.getAll("amountAwarded").forEach((value) => {
                urlSearch.append("amountAwardedFixed", value);
              });
            } else {
              urlSearch.delete("amountAwardedFixed");
            }
            /* FIXME: same as a above but awardDate = awardYear */
            if (urlSearch.getAll("awardDate")){
              urlSearch.delete("awardYear");

              urlSearch.getAll("awardDate").forEach((value) => {
                urlSearch.append("awardYear", value);
              });
            } else {
              urlSearch.delete("awardYear");
            }

            let res = await fetch(url);
            this.data = await res.json();

            /* Update Grantnav button url */
            this.grantnavUrl = `https://grantnav.threesixtygiving.org/search${url.search}`;


            /* In insights these are not "public facing parameters" and only
               apply to grantnav
            */
            urlSearch.delete("sort")
            urlSearch.delete("query");
            urlSearch.delete("default_field");

            /* Update our browser url */
            history.pushState(null, '', `?${urlSearch.toString()}`);

            this.loadingQ--;
        },
        removeFilter(id){
          if (id === 'amountAwardedFixed'){
            this.currentApiUrl.searchParams.delete('amountAwarded');
            this.currentApiUrl.searchParams.delete('min_amount');
            this.currentApiUrl.searchParams.delete('max_amount');
          }
          if (id === 'awardYear'){
            this.currentApiUrl.searchParams.delete('awardDate');
            this.currentApiUrl.searchParams.delete('max_date');
            this.currentApiUrl.searchParams.delete('min_date');
          }

          this.currentApiUrl.searchParams.delete(id);
          this.updateData(`/search${this.currentApiUrl.search}`);
        },
    },
    computed: {
      filtersApplied(){
        /* We only show filters applied if they're recognised from our list of charts */
        for(let chart of Object.keys(chartCardMetadata)){
          if (this.currentApiUrl.searchParams.get(chart) != null){
            return true;
          }
        }

        if (this.currentApiUrl.searchParams.get("min_date") ||
          this.currentApiUrl.searchParams.get("max_date") ||
          this.currentApiUrl.searchParams.get("max_amount") ||
          this.currentApiUrl.searchParams.get("min_amount")
        ) {
          return true;
        }
        return false;
      },
    },
    mounted() {
        if (window.location.search){
          this.updateData(`/search${window.location.search}`);
        } else {
          this.updateData();
        }
    }
})
