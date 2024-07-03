const chartCardMetadata = {
  "fundingOrganization": {
    "title": "Funders",
    "instructions": "<p>Click on the bars or labels to select one or more funders.</p>",
    "color": "orange",
    "chartType": "bar-horizontal",
    "filterer": { type: "finder" }
  },
  "fundingOrganizationTSGType": {
    "title": "Funder types",
    "instructions": "<p>Click on the bars or labels to select one or more funding organisation types.</p>",
    "color": "orange",
    "chartType": "bar-horizontal"
  },
  "amountAwardedFixed": {
    "title": "Award amount",
    "instructions": "<p>Click on the bars or labels to select one or more award amount ranges, or enter a custom range.</p>",
    "color": "orange",
    "chartType": "bar-horizontal",
    "filterer": { type: "number", fields: ["min_amount", "max_amount"] }
  },
  "awardYear": {
    "title": "Award date",
    "instructions": "<p>Enter a date range to filter your selection.</p>",
    "color": "orange",
    "chartType": "bar-vertical",
    "filterer": { type: "date" }
  },
  "grantProgramme": {
    "title": "Grant programmes",
    "instructions": "<p>Click on the bars or labels to select one or more grant programmes.</p>",
    "color": "orange",
    "chartType": "bar-horizontal",
    "filterer": { type: "finder" }
  },
  "recipientRegionName": {
    "title": "Best available countries and regions",
    "instructions": "<p>Click on the bars or labels to select one or more countries.</p>",
    "color": "red",
    "chartType": "bar-horizontal"
  },
  "recipientDistrictName": {
    "title": "Best available local authorities",
    "instructions": "<p>Click on the bars or labels to select one or more local authorities.</p>",
    "color": "red",
    "chartType": "bar-horizontal",
    "filterer": { type: "finder" }
  },
  "bestCountyName": {
    "title": "Best available county",
    "instructions": "<p>Click on the bars or labels to select one or more counties.</p>",
    "color": "red",
    "chartType": "bar-horizontal",
    "filterer": { type: "finder" }
  },
  "recipientOrgRegionName": {
    "title": "Recipient Organisation countries and regions",
    "instructions": "<p>Click on the bars or labels to select one or more countries.</p>",
    "color": "red",
    "chartType": "bar-horizontal"
  },
  "recipientOrgDistrictName": {
    "title": "Recipient Organisation local authorities",
    "instructions": "<p>Click on the bars or labels to select one or more local authorities.</p>",
    "color": "red",
    "chartType": "bar-horizontal",
    "filterer": { type: "finder" }
  },
  "recipientOrgCountyName": {
    "title": "Recipient Organisation county",
    "instructions": "<p>Click on the bars or labels to select one or more counties.</p>",
    "color": "red",
    "chartType": "bar-horizontal",
    "filterer": { type: "finder" }
  },
  "beneficiaryRegionName": {
    "title": "Beneficiary countries and regions",
    "instructions": "<p>Click on the bars or labels to select one or more countries.</p>",
    "color": "red",
    "chartType": "bar-horizontal"
  },
  "beneficiaryDistrictName": {
    "title": "Beneficiary local authorities",
    "instructions": "<p>Click on the bars or labels to select one or more local authorities.</p>",
    "color": "red",
    "chartType": "bar-horizontal",
    "filterer": { type: "finder" }
  },
  "beneficiaryCountyName": {
    "title": "Beneficiary county",
    "instructions": "<p>Click on the bars or labels to select one or more counties.</p>",
    "color": "red",
    "chartType": "bar-horizontal",
    "filterer": { type: "finder" }
  },

  "distributionChloropleth": {
    "title": "Distribution of Grants by best available location",
    "instructions": "<p>Zoom into a Country/Region to view Local Authority-level data. Click on an area to view number of grants, and click on the number of grants to select the area.</p>",
    "color": "red",
    "chartType": "map-chloropleth"
  },
  "recipientTSGType": {
    "title": "Type of grant recipient",
    "instructions": "<p>Click on the bars or labels to select one or more recipient types.</p>",
    "color": "teal",
    "chartType": "bar-horizontal"
  },
  "latestCharityIncomeFixed": {
    "title": "Latest income of charity recipients",
    "instructions": "<p>Data cannot be filtered using this chart.</p>",
    "color": "teal",
    "chartType": "bar-horizontal"
  },
  "orgAgeWhenAwarded": {
    "title": "Age of recipient organisations",
    "commentary": "<p>Organisation age at the time of the grant award, based on the registration date of that organisation. Only available for recipients with charity or company numbers.</p>",
    "color": "teal",
    "chartType": "bar-horizontal",
  },
  "simple_grant_type": {
    "title": "Type of grant",
    "instructions": "<p>Click on the bars or labels to select one or more grant types.</p>",
    "color": "orange",
    "chartType": "bar-horizontal"
  },
  "recipientOrganizationType": {
    "title": "Recipient organisation type",
    "instructions": "<p>Click on the bars or labels to select one or more recipient organisation types.</p>",
    "commentary": "<p>Organisation type is based on official organisation identifiers, such as registered charity or company numbers, found in the data.</p><p>Some organisation do not have an official identifier, for example because it is an unregistered community group, or the publisher has not included official identifiers in the data. Grants to Individuals also have no recipient organisation type.</p>",
    "color": "teal",
    "chartType": "bar-horizontal"
  }
}
