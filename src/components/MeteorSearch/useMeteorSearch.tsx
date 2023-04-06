import axios from "axios";
import { useSearch } from "hooks";
import { isEmpty } from "lodash-es";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Meteor } from "types";
import { formatDateByYear, getYearFromString } from "utils";
import "./MeteorSearch.scss";
import {
  FETCH_ERROR,
  METEOR_API_ENDPOINT,
  NO_METEORS_WITH_MASS_THRESHOLD,
  NO_YEAR_FOUND_MATCHING_RESULTS,
} from "./consts";

export const useMeteorSearch = () => {
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

  const { data, isLoading, searchByFilters, showResultBanner, setShowResultBanner } = useSearch<Meteor>(
    METEOR_API_ENDPOINT,
    meteorSearchQueryParams
  );

  const setFirstYearWithMassThreshold = useCallback(async () => {
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
  }, [meteorMass]);

  useEffect(() => {
    console.log("data", data);

    if (isEmpty(data) && meteorMass) {
      alert(NO_METEORS_WITH_MASS_THRESHOLD);
      setFirstYearWithMassThreshold();
    }
  }, [data.length, showResultBanner]);

  return {
    resultCount: data.length,
    showResultBanner,
    isLoading,
    selectedYear,
    meteorMass,
    setSelectedYear,
    setMeteorMass,
    searchByFilters,
  };
};
