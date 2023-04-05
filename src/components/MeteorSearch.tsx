import axios from "axios";
import { AutoComplete } from "baseUI";
import { range } from "lodash-es";
import { useEffect, useState } from "react";
import { formatDateByYear } from "utils";

// todo figure out about absolute imports

const METEOR_API_ENDPOINT = "https://data.nasa.gov/resource/y77d-th95.json";
const YEARS = range(1900, 2023).map(String);

export const MeteorSearch = () => {
  const [selectedYear, setSelectedYear] = useState<string | undefined>();
  const searchMeteorByYear = async (selectedYear: number) => {
    const formattedYear = formatDateByYear(selectedYear);
    const { data } = await axios.get(`${METEOR_API_ENDPOINT}?year=${formattedYear}`);
    console.log(data);
  };

  useEffect(() => {
    selectedYear && searchMeteorByYear(+selectedYear);
  }, [selectedYear]);

  // const results = await
  //   const getLocations = (
  //     searchTerm: string,
  //     setSuggestions: React.Dispatch<React.SetStateAction<AutoCompleteOption[] | null>>
  //   ) => {
  //     return (
  //       axios
  //         .get(METEOR_API_ENDPOINT)
  //         //set data
  //         .then((data) => {
  //           setSuggestions(data.data as Meteor[]);
  //         })
  //         .catch((err) => {
  //           console.error(err);
  //         })
  //     );
  //   };

  return (
    <>
      <AutoComplete suggestions={YEARS} onSelection={setSelectedYear} />
    </>
  );
};
