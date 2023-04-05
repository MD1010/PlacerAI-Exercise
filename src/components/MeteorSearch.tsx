import axios from "axios";
import { AutoComplete, AutoCompleteOption } from "baseUI/AutoComplete";
import { Meteor } from "types";

// todo figure out about absolute imports

const METEOR_API_ENDPOINT = "https://data.nasa.gov/resource/y77d-th95.json";

export const MeteorSearch = () => {
  const getLocations = (
    searchTerm: string,
    setSuggestions: React.Dispatch<React.SetStateAction<AutoCompleteOption[] | null>>
  ) => {
    return (
      axios
        .get(METEOR_API_ENDPOINT)
        //set data
        .then((data) => {
          setSuggestions(data.data as Meteor[]);
        })
        .catch((err) => {
          console.error(err);
        })
    );
  };

  return (
    <>
      <AutoComplete onSearch={getLocations} />
    </>
  );
};
