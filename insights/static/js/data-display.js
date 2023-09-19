import { lineChart } from './components/line-chart.js';
import { barChart } from './components/bar-chart.js';
import { formatCurrency, formatDate, formatNumber, getAmountSuffix, formatNumberSuffix } from './components/filters.js';


const COLORS = {
    yellow: "#EFC329",
    red: "#BC2C26",
    teal: "#4DACB6",
    orange: "#DE6E26",
}

import { choropleth } from './components/choropleth.js';

Vue.component('choropleth', choropleth);

Vue.component('bar-chart', barChart);
Vue.component('line-chart', lineChart);

Vue.filter('formatCurrency', formatCurrency);
Vue.filter('formatDate', formatDate);
Vue.filter('formatNumber', formatNumber);
Vue.filter('getAmountSuffix', getAmountSuffix);
Vue.filter('formatNumberSuffix', formatNumberSuffix);


var app = new Vue({
    el: '#data-display',
    data() {
        return {
            dataset: "main", // TODO remove
            data: {},
            loading: false,
            loadingQ: 0,
            summary: {
                grants: 0,
                recipientIndividuals: 0,
                recipientOrganisations: 0,
                funders: 0,
                currencies:[ {
                    currency: "GBP",
                    grants: 0,
                    total: 0,
                    mean: 0,
                }],
            },
            default_currency: 'GBP',
            chartCardMetadata: chartCardMetadata,
            insights_config: INSIGHTS_CONFIG,
            grantnavUrl: "",
            subtitle: SUBTITLE,
            title: TITLE,
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

            this.currentApiUrl = url;

            let res = await fetch(url);
            this.data = await res.json();

            /* Update Grantnav button url */
            this.grantnavUrl = `https://grantnav.threesixtygiving.org/search${url.search}`;

            /* Update our browser url */
            history.pushState(null, '', url.search);

            this.loadingQ--;
        },
        removeFilter(id){
          this.currentApiUrl.searchParams.delete(id);
          this.updateData(`/search${this.currentApiUrl.search}`);
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
