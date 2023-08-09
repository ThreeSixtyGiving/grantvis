const chartCardMetadata = {
  "fundingOrganization": {
    "title": "Funders",
    "instructions": "Click on the bars or labels to select one or more funders.",
    "color": "orange",
    "chartType": "bar-horizontal",
    "filterer": { type: "finder" }
  },
  "fundingOrganizationTSGType": {
    "title": "Funder types",
    "instructions": "Click on the bars or labels to select one or more funding organisation types.",
    "color": "orange",
    "chartType": "bar-horizontal"
  },
  "amountAwardedFixed": {
    "title": "Award amount",
    "instructions": "Click on the bars or labels to select one or more award amount ranges, or enter a custom range.",
    "color": "orange",
    "chartType": "bar-horizontal",
    "filterer": { type: "number", fields: ["min_amount", "max_amount"] }
  },
  "awardYear": {
    "title": "Award date",
    "instructions": "Enter a date range to filter your selection.",
    "color": "orange",
    "chartType": "bar-vertical",
    "filterer": { type: "date" }
  },
  "grantProgramme": {
    "title": "Grant programmes",
    "instructions": "Click on the bars or labels to select one or more grant programmes.",
    "color": "orange",
    "chartType": "bar-horizontal",
    "filterer": { type: "finder" }
  },
  "recipientRegionName": {
    "title": "Countries and regions",
    "instructions": "Click on the bars or labels to select one or more countries.",
    "color": "red",
    "chartType": "bar-horizontal"
  },
  "recipientDistrictName": {
    "title": "Local authorities",
    "instructions": "Click on the bars or labels to select one or more local authorities.",
    "color": "red",
    "chartType": "bar-horizontal",
    "filterer": { type: "finder" }
  },
  "distributionChloropleth": {
    "title": "Distribution of Grants by location",
    "instructions": "Zoom into a Country/Region to view Local Authority-level data. Click on an area to view number of grants, and click on the number of grants to select the area.",
    "color": "red",
    "chartType": "map-chloropleth"
  },
  "recipientTSGType": {
    "title": "Type of grant recipient",
    "instructions": "Click on the bars or labels to select one or more recipient types",
    "color": "teal",
    "chartType": "bar-horizontal"
  },
  "latestCharityIncomeFixed": {
    "title": "Latest income of charity recipients",
    "instructions": "Data cannot be filtered using this chart.",
    "color": "teal",
    "chartType": "bar-horizontal"
  },
  "orgAgeWhenAwarded": {
    "title": "Age of recipient organisations",
    "instructions": "Data cannot be filtered using this chart. Organisation age at the time of the grant award, based on the registration date of that organisation. Only available for recipients with charity or company numbers.",
    "color": "teal",
    "chartType": "bar-horizontal",
  },
  "simple_grant_type": {
    "title": "Type of grant",
    "instructions": "Click on the bars or labels to select one or more grant types",
    "color": "orange",
    "chartType": "bar-horizontal"
  },
  "recipientOrganizationType": {
    "title": "Recipient organisation type",
    "instructions": "Click on the bars or labels to select one or more recipient organisation types.",
    "color": "teal",
    "chartType": "bar-horizontal"
  }
}
