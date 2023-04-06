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
  const [isShown, setIsShow] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const autoCompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInput(selectedOption ?? "");
  }, [selectedOption]);

  useEffect(() => {
    scrollToActive();
  }, [active]);

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
    if (event.key === "Enter") {
      setActive(0);
      setIsShow(false);
      setInput(filtered[active]);
      onSelection(filtered[active]);
    } else if (event.key === "ArrowUp") {
      setActive(active === 0 ? filtered.length - 1 : active - 1);
    } else if (event.key === "ArrowDown") {
      setActive(active === filtered.length - 1 ? 0 : active + 1);
    } else if (event.key === "Escape") {
      setIsShow(false);
    }
  };

  const scrollToActive = () => {
    const element = document.querySelector(".autocomplete li.active");
    if (element) {
      element.scrollIntoView({
        block: "nearest",
      });
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
      {isShown && (
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
