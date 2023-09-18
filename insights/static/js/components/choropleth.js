/* Property data expected format:
[
    {
        layerName: "name",
        areas: [
             { areaName : name, grant_count: int },
        ],
        layerBoundariesJsonFile: "file_name.geojson",
        popupHandler: function()
    },
]
*/


export const choropleth = {
    props: ['container', 'height', 'layerData', 'zoomControl'],

    props: {
            container: { type: String },
            height: { type: String },
            zoomControl: { type: Boolean, default: true },
            dataAll: { type: Object },
            dataId: { type: String },
            currentApiUrl: { type: URL },
        },
    data: function () {
        return {
            map: null,
            regionCountryLayer: null,
            laLayer: null,
            mapbox_access_token: MAPBOX_ACCESS_TOKEN,
            keys: ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'],
            chartCardMetadata: chartCardMetadata[this.dataId],
            layerData: this.createLayerData(),
        };
    },
    watch: {
        'layerData': {
            handler: function(){ this.updateMap(); },
        },
        'dataAll': {
            handler: function() {
              this.updateMap();
            },
            deep: true
        },
    },

    methods: {
        createLayerData() {
            let layerData = [
                {
                    layerName: "regionCountryLayer",
                    areas: this.dataAll.aggregations.recipientRegionName.buckets,
                    layerBoundariesJsonFile: "country_region.geojson",
                    popupHandler: function(layer){
                        /* This is outside of the vuejs scopes so need to do things a slightly different way */
                        return `<a href="#" data-filter="recipientRegionName" data-url='${layer.feature.properties.url}' onClick="this.dispatchEvent(new Event('map-select', {bubbles: true}));" >${layer.feature.properties.name} : ${layer.feature.properties.grantCount.toLocaleString()} grants</a>`;
                    },
                },
                {
                    layerName: "laLayer",
                    areas: this.dataAll.aggregations.recipientDistrictName.buckets,
                    layerBoundariesJsonFile: "lalt.geojson",
                    popupHandler: function(layer){
                        return `<a href="#" data-filter="recipientDistrictName" data-url="${layer.feature.properties.url}" onClick="this.dispatchEvent(new Event('map-select', {bubbles: true}));" >${layer.feature.properties.name} : ${layer.feature.properties.grantCount.toLocaleString()} grants</a>`;
                    },
                }
            ]

            return layerData;
        },


        updateMap() {

            var component = this;

            function getColor(d, maxGrantCount) {
                d = d / maxGrantCount;
                if (d == 0){
                    return '';
                }

                return(
                d > 0.9 ? component.keys[7] :
                    d > 0.8 ? component.keys[6] :
                        d > 0.7 ? component.keys[5]:
                            d > 0.6 ? component.keys[4] :
                                d > 0.5 ? component.keys[3] :
                                    d > 0.3 ? component.keys[2]:
                                        d > 0.1 ? component.keys[1] :
                                                     component.keys[0]);
            }

            function defaultStyle(feature) {
                const searchParams = component.currentApiUrl.searchParams;
                let opacity = 0;
                /* A selection has happened */
                if (searchParams.getAll("recipientRegionName")){
                    if (searchParams.getAll("recipientRegionName").indexOf(feature.properties.name) !== -1){
                        opacity = 0.7;
                    }
                }


                if (searchParams.getAll("recipientDistrictName")) {
                    if (searchParams.getAll("recipientDistrictName").indexOf(feature.properties.name) !== -1){
                        opacity = 0.7;
                    }
                }

                return {
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: opacity,
                    fillColor: getColor(feature.properties.grantCount, feature.properties.maxGrantCount)
                };

            }

            async function makeLayer(layer, addToMap){

                let geoJsonUrl = "/static/geo/"+layer.layerBoundariesJsonFile;
                let res = await fetch(geoJsonUrl);
                let geoJson = await res.json()

                let areaSelectLookup = {};

                layer.areas.forEach((area) => {
                  /* Create a lookup object for name->id with grant count */
                    areaSelectLookup[area.key] = {
                        grantCount: area.doc_count,
                        url: area.url,
                    };
                });

                let maxGrantCount = 0;

                geoJson.features.forEach((feature) => {
                    let name = "";

                    if (feature.properties.nuts118nm){
                        name = feature.properties.nuts118nm.replace(" (England)", "");
                    } else if (feature.properties.CTYUA20NM) {
                        name = feature.properties.CTYUA20NM;
                    } else if (feature.properties.LAD20NM){
                        name = feature.properties.LAD20NM;
                    }

                    /* Not every region in the geojson will correspond with one in our data */
                    if (areaSelectLookup[name]) {
                        feature.properties.name = name;
                        feature.properties.grantCount = areaSelectLookup[name].grantCount;
                        feature.properties.url = areaSelectLookup[name].url;

                        if (areaSelectLookup[name].grantCount > maxGrantCount){
                            maxGrantCount = areaSelectLookup[name].grantCount;
                        }

                    } else {
                        feature.properties.name = name;
                        feature.properties.url = "#";
                        feature.properties.grantCount = 0;
                    }
                });

                /* Copy the maxGrantCount into each feature for colour calc */
                geoJson.features.forEach((feature) => {
                    feature.properties.maxGrantCount = maxGrantCount;
                });

                component[layer.layerName] = L.geoJson(geoJson, {style: defaultStyle})

                component[layer.layerName].bindPopup(layer.popupHandler);

                if (addToMap){
                    component[layer.layerName].addTo(component.map);
                }
            }

            this.map.eachLayer((layer)=> {
                if (!layer.keep){
                    layer.remove();
                }
            });

            for (let i in this.layerData){
                /* Only add layer 0 to the map */
                makeLayer(this.layerData[i], i == 0);
            }
        },

        zoom(){
            if (!this.zoomControl){
                return;
            }
            /* Toggle the two layers based on zoom level */
            /* Todo make generic */
            if (this.map.getZoom() > 7){
                /* more detailed layer*/
                if (this.map.hasLayer(this.regionCountryLayer)){
                    this.regionCountryLayer.remove();
                }

                if (!this.map.hasLayer(this.laLayer)){
                    this.laLayer.addTo(this.map);
                }

            } else {
                /* low detail layer */
                if (!this.map.hasLayer(this.regionCountryLayer)){
                    this.regionCountryLayer.addTo(this.map);
                }

                if (this.map.hasLayer(this.laLayer)){
                    this.laLayer.remove();
                }
            }
        }
    },
    mounted() {

        L.mapbox.accessToken = this.mapbox_access_token;
        var map = L.mapbox.map(this.$refs['mapElement'], null, {
            attributionControl: { compact: true },
            zoomControl: this.zoomControl,
        }).setView([54.55, -2], 6);
        let styleLayer = L.mapbox.styleLayer('mapbox://styles/davidkane/cjvnt2h0007hm1clrbd20bbug');
        styleLayer.keep = true;
        styleLayer.addTo(map);

        // disable scroll when map isn't focused
        map.scrollWheelZoom.disable();
        map.on('focus', function () { map.scrollWheelZoom.enable(); });
        map.on('blur', function () { map.scrollWheelZoom.disable(); });
        map.on('zoomend', this.zoom);

        // ensure mapbox logo is shown (for attribution)
        document.querySelector('.mapbox-logo').classList.add('mapbox-logo-true');

        this.map = map;

        if (this.layerData.length){
            this.updateMap();
        }



    },
    created(){
        const app = this;
        document.addEventListener("map-select", function(event){
            event.preventDefault();
            console.log("map-select", event.target.dataset.url);
            /* Push this event up to data-display to set the filter */
            app.$emit("select", event.target.dataset.url);
        });
    },

    template: `
            <div class="grid__2 base-card base-card--left" v-bind:class="'base-card--'+chartCardMetadata.color" >
                <div class="base-card__content" >
                        <header class="base-card__header" style="display: flex; align-items: center;" >
                            <h3 class="base-card__heading" >{{ chartCardMetadata.title }}</h3>
                            <h4 class="base-card__subheading" style="margin-left: 5px">
                                (number of grants)
                            </h4>
                    </header>
                    <div v-bind:id="container" ref="mapElement" v-bind:style="{ height: height }"></div>
                    <div style="display: flex">
                        <p style="margin: auto 0.5em auto 0;">Key: Least grants</p>
                        <span v-for="key in keys" style="align-self: center; width: 15px; height: 15px" v-bind:style="'background-color:'+key"></span>
                        <p style="margin: auto 0 auto 0.5em "> Most grants</p>
                    </div>
                </div>
               <div>
                <hr class="separator-light">
                <p>{{ chartCardMetadata.instructions }}</p>
                </div>
            </div>
        `,
}
