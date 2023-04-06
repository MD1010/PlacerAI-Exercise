import { useEffect, useRef, useState } from "react";
import "./AutoComplete.scss";

type Props = {
  suggestions: any[];
  placeholder?: string;
  selectedOption: any;
  onSelection: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const AutoComplete: React.FC<Props> = ({ suggestions, onSelection, placeholder, selectedOption }) => {
  const [active, setActive] = useState<number>(0);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const autoCompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInput(selectedOption ?? "");
  }, [selectedOption]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (autoCompleteRef.current && !autoCompleteRef.current.contains(event.target as Node)) {
      setIsShow(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((prevActive) => (prevActive - 1 >= 0 ? prevActive - 1 : filtered.length - 1));
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((prevActive) => (prevActive + 1 < filtered.length ? prevActive + 1 : 0));
    } else if (event.key === "Escape") {
      setIsShow(false);
    } else if (event.key === "Enter") {
      event.preventDefault();
      setInput(filtered[active]);
      onSelection(filtered[active]);
      setIsShow(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;
    const newFilteredSuggestions = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
    );
    setActive(0);
    setFiltered(newFilteredSuggestions);
    setInput(inputValue);
    setIsShow(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    onSelection(suggestion);
    setIsShow(false);
  };

  const handleOnFocus = () => {
    setIsShow(true);
  };

  return (
    <div className="autocompleteInput" ref={autoCompleteRef}>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleOnFocus}
        placeholder={placeholder}
      />
      {isShow && (
        <ul className="autocomplete">
          {filtered.map((suggestion, index) => (
            <li
              key={suggestion}
              className={active === index ? "active" : ""}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
