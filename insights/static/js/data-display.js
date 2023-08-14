import { lineChart } from './components/line-chart.js';
import { barChart } from './components/bar-chart.js';
import { GQL, gqlSingleGraph, graphqlQuery } from './gql/query.js';
import { formatCurrency, formatDate, formatNumber, getAmountSuffix, formatNumberSuffix } from './components/filters.js';
import { debounce } from './lib/debounce.js';


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

function constructMonth(month, year) {
    if (month && year) {
        return year + '-' + month;
    }
    else {
        return null;
    }
}

function initialFilters(useQueryParams) {

}

/* Friendly names map for filter options */
/* TODO */
var filtersToTitles = {
    awardAmount: "Award amounts",
    awardDates: "Award dates",
    orgSize: "Size of recipient organisations",
    orgAge: "Age of recipient organisations",
    orgtype: "Recipient organisation type",
    grantProgrammes: "Grant programmes",
    funders: "Funders",
    funderTypes: "Funder types",
    area: "Location",
    localAuthorities: "Local Authorities",
    recipientTypes: "Recipient types",
    grantTypes: "Grant type",
}

var chartToFilters = {
    byGrantProgramme: 'grantProgrammes',
    byFunder: 'funders',
    byFunderType: 'funderTypes',
    byCountryRegion: 'area',
    byOrgType: 'orgtype',
    byLocalAuthority: 'localAuthorities',
    byRecipientType: 'recipientTypes',
    byGrantType: 'grantTypes',
}

/* Same as above but k,v swapped */
var filtersToChart = Object.fromEntries(Object.entries(chartToFilters).map(([key,val]) => [val, key] ));

function clamp(num, min, max){
    return Math.min(Math.max(num, min), max);
}

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
            activeFilters: [],
            funders: [],
            choroplethData: [],
            chartCardMetadata: chartCardMetadata,
            insights_config: INSIGHTS_CONFIG,
            grantnavUrl: "",
            subtitle: SUBTITLE,
            title: TITLE,
        }
    },
    computed: {
        /*grantnavUrl: function () {
            /* Create the grantnav search url from the current filter selection
            // TODO, look this up from the config
            var url = 'https://grantnav.threesixtygiving.org/search?';

            var searchParams = new URLSearchParams();

            if (this.filters.orgtype.length || this.filters.localAuthorities.length) {
                return null;
            }

            if (this.filters.awardAmount.min) {
                searchParams.append('min_amount', this.filters.awardAmount.min);
            }
            if (this.filters.awardAmount.max) {
                searchParams.append('max_amount', this.filters.awardAmount.max);
            }

            if (this.filters.awardDates.min.month && this.filters.awardDates.min.year) {
                searchParams.append('min_date', this.filters.awardDates.min.month + '/' + this.filters.awardDates.min.year);
            }
            if (this.filters.awardDates.max.month && this.filters.awardDates.max.year) {
                searchParams.append('max_date', this.filters.awardDates.max.month + '/' + this.filters.awardDates.max.year);
            }

            var text_query = '';
            this.filters.area.forEach((area) => {
                var area_prefix = area.slice(0, 3);
                if (['E06', 'E07', 'E08', 'E09', 'N09', 'S12', 'W06'].includes(area_prefix)) {
                    text_query += ' additional_data.recipientDistrictGeoCode:' + area;
                } else if (['E12'].includes(area_prefix)) {
                    text_query += ' additional_data.recipientOrganizationLocation.rgn:' + area;
                } else if (['E92', 'N92', 'S92', 'W92'].includes(area_prefix)) {
                    text_query += ' additional_data.recipientOrganizationLocation.ctry:' + area;
                }
            });
            if (text_query) {
                searchParams.append('query', text_query);
            }

            this.filters.funderTypes.forEach((funderType) => {
                searchParams.append('fundingOrganizationTSGType', funderType)
            });
            this.filters.funders.forEach((funder) => {
                searchParams.append('fundingOrganization', funder);
            });
            this.filters.grantProgrammes.forEach((grantProgramme) => {
                searchParams.append('grantProgramme', grantProgramme);
            });

            this.filters.recipientTypes.forEach((recipientType) => {
                searchParams.append('recipientTSGType', recipientType);
            });

            this.filters.grantTypes.forEach((grantType) => {
                searchParams.append('simple_grant_type', grantType);
            });

            return url + searchParams.toString();
        }*/
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

            let res = await fetch(url);
            this.data = await res.json();

            /* Update active filters */
            let queryParamsObj = new URLSearchParams(url.search);
            this.activeFilters = Array.from(queryParamsObj.keys());

            /* Update Grantnav button url */
            this.grantnavUrl = `https://grantnav.threesixtygiving.org${queryUrl}`;

            /* Update our browser url */
            history.pushState(null, '', url.search);

            this.loadingQ--;
        },
        updateChoropleth() {
          return;

            if (!this.chartData.byCountryRegion || !this.chartData.byLocalAuthority) {
                return [];
            };

            let areas = [];
            let laAreas = [];

            this.chartData.byCountryRegion.forEach((area) => {
                if (!area.bucketGroup[0].id) {
                    return;
                }

                let choroplethArea = {};

                /* England is split into regions */
                if (area.bucketGroup[0].id == "E92000001") {
                    choroplethArea = { ...area.bucketGroup[1] };
                } else {
                    choroplethArea = { ...area.bucketGroup[0] };
                }

                choroplethArea.grant_count = area.grants;
                areas.push(choroplethArea);
            });

            this.chartData.byLocalAuthority.forEach((area) => {
                if (!area.bucketGroup[0].id) {
                    return;
                }

                let choroplethArea = {};
                choroplethArea = { ...area.bucketGroup[0] };
                choroplethArea.grant_count = area.grants;

                laAreas.push(choroplethArea);
            });

            this.choroplethData = [
                {
                    layerName: "regionCountryLayer",
                    areas: areas,
                    layerBoundariesJsonFile: "country_region.geojson",
                    popupHandler: function(layer){
                        return `<a href="#" data-filter="area" data-area="${layer.feature.properties.areaId}" onClick="this.dispatchEvent(new Event('map-select', {bubbles: true}))" >${layer.feature.properties.name} : ${layer.feature.properties.grantCount.toLocaleString()} grants</a>`;
                    },
                },
                {
                    layerName: "laLayer",
                    areas: laAreas,
                    layerBoundariesJsonFile: "lalt.geojson",
                    popupHandler: function(layer){
                        return `<a href="#" data-filter="localAuthorities" data-area="${layer.feature.properties.areaId}" onClick="this.dispatchEvent(new Event('map-select', {bubbles: true}))" >${layer.feature.properties.name} : ${layer.feature.properties.grantCount.toLocaleString()} grants</a>`;
                    },
                }
            ]
        },
        removeFilter(id){
          let queryParams = new URLSearchParams(window.location.search);
          queryParams.delete(id);

          this.updateData(`/search${queryParams.toString()}`);
        },

        toggleInArray(array, item){
            let idx = array.indexOf(item);
            if (idx > -1){
                /* Item exists remove it */
                array.splice(idx, 2);
            } else {
                array.push(item);
            }
        },
        safeLength(array){
            /* utility for avoiding race conditions on determining length in templates */
            if (!array){
                return 0;
             }

             return array.length;
        },
        getChartCardData(id) { /* todo remove me */
              return chartCardData.filter(item => item.id === id)
        },
        getChartCardMetadata(id) {
              return chartCardData.filter(item => item.id === id)
        },
    },
    mounted() {
        if (window.location.search){
          this.updateData(`/search${window.location.search}`);
        } else {
          this.updateData();
        }

        let app = this;

        document.addEventListener("map-select", function(event){
            event.preventDefault();
            app.toggleInArray(app.filters[event.target.dataset.filter], event.target.dataset.area);
        });
    }
})
