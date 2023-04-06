import axios from "axios";
import { AutoComplete, Loader } from "baseUI";
import { isEmpty } from "lodash-es";
import { useMemo, useState } from "react";
import { Meteor } from "types";
import { formatDateByYear, getYearFromString } from "utils";
import "./MeteorSearch.scss";
import {
  FETCH_ERROR,
  METEOR_API_ENDPOINT,
  NO_METEORS_WITH_MASS_THRESHOLD,
  NO_YEAR_FOUND_MATCHING_RESULTS,
  YEARS,
} from "./consts";

export const MeteorSearch = () => {
  const [selectedYear, setSelectedYear] = useState<string | undefined>();
  const [resultCount, setResultCount] = useState<number | undefined>();
  const [meteorMass, setMeteorMass] = useState<number | undefined>();
  const [showResultBanner, setShowResultBanner] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const meteorSearchQueryParams = useMemo(() => {
    const searchQueryParams: any = {};
    if (selectedYear) {
      const formattedYear = formatDateByYear(+selectedYear);
      searchQueryParams["year"] = formattedYear;
    }
    if (meteorMass) {
      searchQueryParams["$where"] = `mass>${meteorMass}`;
    }
    return searchQueryParams;
  }, [selectedYear, meteorMass]);

  const searchMeteorsByFilters = async () => {
    if (isEmpty(meteorSearchQueryParams)) return;
    setIsLoading(true);
    try {
      const { data } = await axios.get(METEOR_API_ENDPOINT, {
        params: meteorSearchQueryParams,
      });
      setIsLoading(false);
      setShowResultBanner(true);
      setResultCount(data.length);
      if (data.length === 0 && meteorMass) {
        alert(NO_METEORS_WITH_MASS_THRESHOLD);
        setFirstYearWithMassThreshold();
      }
    } catch (e) {
      console.error(FETCH_ERROR);
    }
  };

  const setFirstYearWithMassThreshold = async () => {
    try {
      const { data } = await axios.get(METEOR_API_ENDPOINT, {
        params: {
          $where: `mass>${meteorMass}`,
        },
      });

      if (isEmpty(data)) alert(NO_YEAR_FOUND_MATCHING_RESULTS);
      const firstResultYear = getYearFromString((data[0] as Meteor).year);
      setShowResultBanner(false);
      setSelectedYear(firstResultYear);
    } catch (e) {
      console.error(FETCH_ERROR);
    }
  };

  return (
    <>
      <div className="container">
        <div className="searchContainer">
          <div className="yearContainer">
            <span>Meteor Year</span>
            <AutoComplete
              selectedOption={selectedYear}
              suggestions={YEARS}
              onSelection={setSelectedYear}
              placeholder="Select Year"
            />
          </div>
          <div className="massContainer">
            <span>Mass greater than</span>
            <input
              type="number"
              min="0"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeteorMass(+e.target.value)}
              value={meteorMass ?? ""}
            />
          </div>
        </div>
        <div className="btnContainer">
          <button className="searchBtn" onClick={searchMeteorsByFilters}>
            Search
          </button>
        </div>

        <div className="totalContainer">
          {showResultBanner && <div className="total">Total Meteors: {resultCount}</div>}
        </div>
      </div>

      <Loader isLoading={isLoading} style={{ marginTop: 20 }} />
    </>
  );
};
