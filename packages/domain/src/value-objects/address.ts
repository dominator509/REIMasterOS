/** United States postal address. */
export interface Address {
  readonly street: string;
  readonly street2?: string;
  readonly city: string;
  readonly state: string;
  readonly zip: string;
  readonly county?: string;
  readonly country: "US";
}

const VALID_STATES = new Set([
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
]);

export function isValidState(state: string): boolean {
  return VALID_STATES.has(state.toUpperCase());
}

export function createAddress(params: {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  county?: string;
}): Address {
  if (!params.street.trim()) throw new Error("Street is required");
  if (!params.city.trim()) throw new Error("City is required");
  if (!isValidState(params.state)) throw new Error(`Invalid state: ${params.state}`);
  if (!/^\d{5}(?:-\d{4})?$/.test(params.zip)) throw new Error(`Invalid ZIP: ${params.zip}`);
  return {
    street: params.street.trim(),
    street2: params.street2?.trim(),
    city: params.city.trim(),
    state: params.state.toUpperCase(),
    zip: params.zip,
    county: params.county?.trim(),
    country: "US",
  };
}
