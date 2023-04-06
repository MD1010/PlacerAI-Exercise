import axios from "axios";
import { useCallback, useState } from "react";
import { FETCH_ERROR } from "../components/MeteorSearch/consts";

export function useSearch<T>(searchEndpoint: string, searchQueryParams: any) {
  const [data, setData] = useState<T[]>([]);
  const [showResultBanner, setShowResultBanner] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchResult = (data: T[]) => {
    setIsLoading(false);
    setShowResultBanner(true);
    setData(data);
  };
  const searchByFilters = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(searchEndpoint, {
        params: searchQueryParams,
      });
      handleSearchResult(data);
    } catch (e) {
      console.error(FETCH_ERROR);
    }
  }, [JSON.stringify(searchQueryParams)]);

  return {
    data,
    showResultBanner,
    setShowResultBanner,
    isLoading,
    searchByFilters,
  };
}
