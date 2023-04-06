import { range } from "lodash-es";

const METEOR_API_ENDPOINT = "https://data.nasa.gov/resource/y77d-th95.json";
const YEARS = range(1000, 2024).map(String);
const FETCH_ERROR = "Something went wrong, could not fetch results";
const NO_METEORS_WITH_MASS_THRESHOLD =
  "The mass was not found, jumping to the first-year where there is a mass that fits the criteria";
const NO_YEAR_FOUND_MATCHING_RESULTS = "No year was found where there is a mass that fits the criteria ";

export { METEOR_API_ENDPOINT, YEARS, FETCH_ERROR, NO_METEORS_WITH_MASS_THRESHOLD, NO_YEAR_FOUND_MATCHING_RESULTS };
