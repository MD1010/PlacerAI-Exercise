import axios from "axios";
import { AutoComplete } from "baseUI";
import { isEmpty } from "lodash-es";
import { useMemo, useState } from "react";
import { Meteor } from "types";
import { formatDateByYear, getYearFromString } from "utils";
import "./MeteorSearch.scss";
import { METEOR_API_ENDPOINT, NO_METEORS_WITH_MASS_THRESHOLD, YEARS } from "./consts";

export const MeteorSearch = () => {
  const [selectedYear, setSelectedYear] = useState<string | undefined>();
  const [resultCount, setResultCount] = useState<number | undefined>();
  const [meteorMass, setMeteorMass] = useState<number | undefined>();
  const [showResultBanner, setShowResultBanner] = useState<boolean>(false);

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
    try {
      const { data } = await axios.get(METEOR_API_ENDPOINT, {
        params: meteorSearchQueryParams,
      });
      setShowResultBanner(true);
      setResultCount(data.length);
      if (data.length === 0 && meteorMass) {
        alert(NO_METEORS_WITH_MASS_THRESHOLD);
        setFirstYearWithMassThreshold();
      }
    } catch (e) {
      console.error();
    }
  };

  const setFirstYearWithMassThreshold = async () => {
    try {
      const { data } = await axios.get(METEOR_API_ENDPOINT, {
        params: {
          $where: `mass>${meteorMass}`,
        },
      });

      const firstResultYear = getYearFromString((data[0] as Meteor).year);
      setShowResultBanner(false);
      setSelectedYear(firstResultYear);
    } catch (e) {
      console.error("Something went wrong, could not fetch results");
    }
  };

  return (
    <div className="container">
      <div className="searchContainer">
        <div className="yearContainer">
          <span>Metoer Year</span>
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
  );
};
