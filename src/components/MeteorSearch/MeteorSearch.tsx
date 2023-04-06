import { Loader } from "baseUI";
import { MeteorFilters } from "./MeteorFilters";
import "./MeteorSearch.scss";
import { useMeteorSearch } from "./useMeteorSearch";

export const MeteorSearch = () => {
  const {
    resultCount,
    showResultBanner,
    isLoading,
    selectedYear,
    meteorMass,
    setSelectedYear,
    setMeteorMass,
    searchByFilters,
  } = useMeteorSearch();

  return (
    <>
      <div className="container">
        <MeteorFilters
          selectedYear={selectedYear}
          meteorMass={meteorMass}
          setSelectedYear={setSelectedYear}
          setMeteorMass={setMeteorMass}
        />

        <button className="searchBtn" onClick={searchByFilters}>
          Search
        </button>

        {showResultBanner && <div className="total">Total Meteors: {resultCount}</div>}
      </div>

      <Loader isLoading={isLoading} style={{ marginTop: 20 }} />
    </>
  );
};
