const chartCardMetadata = {
  "fundingOrganization": {
      "title": "Funders",
      "instructions": "Click on the bars or labels to select one or more funders.",
      "colour": "orange",
      "filterer":  { type: "finder" },
  },
  "fundingOrganizationTSGType": {
      "title": "Funder types",
      "instructions": "Click on the bars or labels to select one or more funding organisation types.",
      "colour": "orange"
  },
  "amountAwardedFixed": {
      "title": "Award amount",
      "instructions": "Click on the bars or labels to select one or more award amount ranges, or enter a custom range.",
      "colour": "orange",
      "filterer": { type: "number", fields: ["min_amount", "max_amount"] },
  },
  "awardYear": {
      "title": "Award date",
      "instructions": "Enter a date range to filter your selection.",
      "filterer": { type: "date" },
  },
  "grantProgramme": {
      "title": "Grant programmes",
      "instructions": "Click on the bars or labels to select one or more grant programmes."
  },
  "byCountry": {
      "title": "Countries",
      "instructions": "Click on the bars or labels to select one or more countries."
  },
  "byRegion": {
      "title": "Regions in England",
      "instructions": "Click on the bars or labels to select one or more regions."
  },
  "byLocalAuthority": {
      "title": "Local authorities",
      "instructions": "Click on the bars or labels to select one or more local authorities."
  },
  "byArea": {
      "title": "Distribution of Grants by location",
      "instructions": "Zoom into a Country/Region to view Local Authority-level data. Click on an area to view number of grants, and click on the number of grants to select the area."
  },
  "byGeoSource": {
      "title": "Source of location information",
      "instructions": "Data cannot be filtered using this chart."
  },
  "byOrgType": {
      "title": "Recipient organisation type",
      "instructions": "Click on the bars or labels to select one or more recipient organisation types."
  },
  "byOrgSize": {
      "title": "Latest income of charity recipients",
      "instructions": "Data cannot be filtered using this chart."
  },
  "byOrgAge": {
      "title": "Age of recipient organisations",
      "instructions": ""
  },
  "byRecipientType": {
      "title": "Type of grant recipient",
      "instructions": "Click on the bars or labels to select one or more recipient types"
  },
  "byGrantType": {
      "title": "Type of grant",
      "instructions": "Click on the bars or labels to select one or more grant types"
  }
}