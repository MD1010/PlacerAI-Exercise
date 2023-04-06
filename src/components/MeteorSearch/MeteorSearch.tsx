import axios from "axios";
import { AutoComplete } from "baseUI";
import { isEmpty, range } from "lodash-es";
import { useState } from "react";
import { Meteor } from "types";
import { formatDateByYear, getYearFromString } from "utils";
import "./MeteorSearch.scss";

// todo figure out about absolute imports

const METEOR_API_ENDPOINT = "https://data.nasa.gov/resource/y77d-th95.json";
const YEARS = range(1800, 2024).map(String);

export const MeteorSearch = () => {
  const [selectedYear, setSelectedYear] = useState<string | undefined>();
  const [resultCount, setResultCount] = useState<number | undefined>();
  const [meteorMass, setMeteorMass] = useState<number | undefined>();
  const [showResultBanner, setShowResultBanner] = useState<boolean>(false);

  const getMeteorSearchQueryParams = () => {
    const searchQueryParams: any = {};
    if (selectedYear) {
      const formattedYear = formatDateByYear(+selectedYear);
      searchQueryParams["year"] = formattedYear;
    }
    if (meteorMass) {
      searchQueryParams["$where"] = `mass>${meteorMass}`;
    }
    return searchQueryParams;
  };

  const searchMeteorsByFilters = async () => {
    const meteorQueryStringParams = getMeteorSearchQueryParams();
    if (isEmpty(meteorQueryStringParams)) return;
    try {
      const { data } = await axios.get(METEOR_API_ENDPOINT, {
        params: meteorQueryStringParams,
      });
      setShowResultBanner(true);
      setResultCount(data.length);
      if (data.length === 0 && meteorMass) {
        alert("The mass was not found, jumping to the first-year where there is a mass that fits the criteria");
        setFirstYearWithMassThreshold();
      }
    } catch (e) {
      console.error("Something went wrong, could not fetch results");
    }
  };

  const setFirstYearWithMassThreshold = async () => {
    try {
      const { data } = await axios.get(METEOR_API_ENDPOINT, {
        params: {
          $where: `mass>${meteorMass}`,
        },
      });

      setShowResultBanner(false);
      const firstResultYear = getYearFromString((data[0] as Meteor).year);
      setSelectedYear(firstResultYear);
    } catch (e) {
      console.error("Something went wrong, could not fetch results");
    }
  };

  return (
    <>
      <AutoComplete
        selectedOption={selectedYear}
        suggestions={YEARS}
        onSelection={setSelectedYear}
        placeholder="Select Year"
      />
      <span>Mass greater than</span>
      <input
        type="number"
        min="0"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeteorMass(+e.target.value)}
        value={meteorMass ?? ""}
      />
      <button onClick={searchMeteorsByFilters}>Search</button>
      {<div>{showResultBanner && <span>Total Meteors: {resultCount}</span>}</div>}
    </>
  );
};
