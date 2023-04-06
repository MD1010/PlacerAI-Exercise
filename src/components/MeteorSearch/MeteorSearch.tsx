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
        <div className="searchContainer">
          <MeteorFilters
            selectedYear={selectedYear}
            meteorMass={meteorMass}
            setSelectedYear={setSelectedYear}
            setMeteorMass={setMeteorMass}
          />
        </div>
        <div className="btnContainer">
          <button className="searchBtn" onClick={searchByFilters}>
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
