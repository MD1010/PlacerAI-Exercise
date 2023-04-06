import axios from "axios";
import { AutoComplete, Loader } from "baseUI";
import { filter, isEmpty } from "lodash-es";
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
import { MeteorFilters } from "./MeteorFilters";

export const MeteorSearch = () => {
  const [resultCount, setResultCount] = useState<number | undefined>();
  const [showResultBanner, setShowResultBanner] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedYear, setSelectedYear] = useState<string | undefined>();
  const [meteorMass, setMeteorMass] = useState<number | undefined>();

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

  const handleNoMeteorsFound = () => {
    alert(NO_METEORS_WITH_MASS_THRESHOLD);
    setFirstYearWithMassThreshold();
  };

  const searchMeteorsByFilters = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(METEOR_API_ENDPOINT, {
        params: meteorSearchQueryParams,
      });
      setIsLoading(false);
      setShowResultBanner(true);
      setResultCount(data.length);
      data.length === 0 && meteorMass && handleNoMeteorsFound();
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
          <MeteorFilters
            selectedYear={selectedYear}
            meteorMass={meteorMass}
            setSelectedYear={setSelectedYear}
            setMeteorMass={setMeteorMass}
          />
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
