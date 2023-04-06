import axios from "axios";
import { AutoComplete } from "baseUI";
import { range } from "lodash-es";
import { useEffect, useState } from "react";
import { formatDateByYear } from "utils";

// todo figure out about absolute imports

const METEOR_API_ENDPOINT = "https://data.nasa.gov/resource/y77d-th95.json";
const YEARS = range(1800, 2024).map(String);

export const MeteorSearch = () => {
  const [selectedYear, setSelectedYear] = useState<string | undefined>();
  const [resultCount, setResultCount] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [meteorMass, setMeteorMass] = useState<number | undefined>();

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
    if (!Object.keys(meteorQueryStringParams).length) return;
    setIsLoading(true);
    const { data } = await axios.get(METEOR_API_ENDPOINT, {
      params: meteorQueryStringParams,
    });
    setIsLoading(false);
    setResultCount(data.length);
  };

  return (
    <>
      <AutoComplete suggestions={YEARS} onSelection={setSelectedYear} placeholder="Select Year" />
      <span>Mass greater than</span>
      <input
        type="number"
        min="0"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeteorMass(+e.target.value)}
        value={meteorMass ?? ""}
      />
      <button onClick={searchMeteorsByFilters}>Search</button>
      {isLoading ? <div>Loading...</div> : <div>{resultCount && <span>Total Meteors: {resultCount}</span>}</div>}
    </>
  );
};
