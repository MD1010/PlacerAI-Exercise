import { AxiosError } from "axios";
import { debounce } from "lodash-es";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

export type AutoCompleteOption = {
  name: string;
  [key: string]: any;
};

type Props = {
  onSearch: (
    searchTerm: string,
    setSuggestions: React.Dispatch<React.SetStateAction<AutoCompleteOption[] | null>>
  ) => any;
};

export const AutoComplete: FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  // state that hold API data
  const [suggestions, setSuggestions] = useState<null | any[]>([]);

  const getSuggestions = useCallback(
    debounce((searchTerm) => onSearch(searchTerm, setSuggestions), 300),
    [onSearch]
  );

  useEffect(() => {
    if (query.length) getSuggestions(query);
  }, [query]);

  return (
    <>
      <input
        type="text"
        placeholder="Type location"
        name="query"
        onChange={(e) => setQuery(e.target.value)}
        list="locations"
      />
      <datalist id="locations">
        {query.length > 0 &&
          suggestions?.map((suggestion: AutoCompleteOption, index) => {
            if (suggestion.name.toLowerCase().includes(query)) {
              return <option key={index} value={suggestion.name} />;
            }
            return "";
          })}
      </datalist>
    </>
  );
};
