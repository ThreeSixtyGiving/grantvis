const chartCardData = [
  {
    id: 'fundingOrganization',
    title: 'Funders',
    instructions: 'Click on the bars or labels to select one or more funders.',
    color: 'orange',
  },
  {
    id: 'fundingOrganizationTSGType',
    title: 'Funder types',
    instructions: 'Click on the bars or labels to select one or more funding organisation types.',
    color: 'orange',
  },
  {
    id: 'byAmountAwarded',
    title: 'Award amount',
    instructions: 'Click on the bars or labels to select one or more award amount ranges, or enter a custom range.'
  },
  {
    id: 'byAwardDate',
    title: 'Award date',
    instructions: 'Enter a date range to filter your selection.'
  },
  {
    id: 'byGrantProgramme',
    title: 'Grant programmes',
    instructions: 'Click on the bars or labels to select one or more grant programmes.'
  },
  {
    id: 'byCountry',
    title: 'Countries',
    instructions: 'Click on the bars or labels to select one or more countries.'
  },
  {
    id: 'byRegion',
    title: 'Regions in England',
    instructions: 'Click on the bars or labels to select one or more regions.'
  },
  {
    id: 'byLocalAuthority',
    title: 'Local authorities',
    instructions: 'Click on the bars or labels to select one or more local authorities.'
  },
  {
    id: 'byArea',
    title: 'Distribution of Grants by location',
    instructions: 'Zoom into a Country/Region to view Local Authority-level data. Click on an area to view number of grants, and click on the number of grants to select the area.'
  },
  {
    id: 'byGeoSource',
    title: 'Source of location information',
    instructions: 'Data cannot be filtered using this chart.'
  },
  {
    id: 'byOrgType',
    title: 'Recipient organisation type',
    instructions: 'Click on the bars or labels to select one or more recipient organisation types.'
  },
  {
    id: 'byOrgSize',
    title: 'Latest income of charity recipients',
    instructions: 'Data cannot be filtered using this chart.'
  },
  {
    id: 'byOrgAge',
    title: 'Age of recipient organisations',
    instructions: ''
  },
  {
    id: 'byRecipientType',
    title: 'Type of grant recipient',
    instructions: 'Click on the bars or labels to select one or more recipient types',
  },
  {
    id: 'byGrantType',
    title: 'Type of grant',
    instructions: 'Click on the bars or labels to select one or more grant types',
  }

] /*TODO make this an object top level rather than an array  ? */

export { chartCardData };
