import { FC, useEffect, useState } from "react";
import "./AutoComplete.scss";

type Props = {
  suggestions: any[];
  placeholder?: string;
  selectedOption: any;
  onSelection: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const AutoComplete: FC<Props> = ({ suggestions, onSelection, placeholder, selectedOption }) => {
  const [active, setActive] = useState(0);
  const [filtered, setFiltered] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    setInput(selectedOption);
  }, [selectedOption]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    const newFilteredSuggestions: any = suggestions.filter(
      (suggestion) => suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1
    );
    setActive(0);
    setFiltered(newFilteredSuggestions);
    setIsShow(true);
    setInput(e.currentTarget.value);
  };
  const onClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    setActive(0);
    setFiltered([]);
    setIsShow(false);
    setInput(e.currentTarget.innerText);
    onSelection(e.currentTarget.innerText);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setActive(0);
      setIsShow(false);
      setInput(filtered[active]);
      onSelection(filtered[active]);
    } else if (e.key === "ArrowUp") {
      return active === 0 ? null : setActive(active - 1);
    } else if (e.key === "ArrowDown") {
      return active - 1 === filtered.length ? null : setActive(active + 1);
    }
  };
  const renderAutocomplete = () => {
    if (isShow && input) {
      if (filtered.length) {
        return (
          <ul className="autocomplete">
            {filtered.map((suggestion, index) => {
              return (
                <li className={index === active ? "active" : ""} key={suggestion} onClick={onClick}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      }
      // else {
      //   return (
      //     <div className="no-autocomplete">
      //       <span>Not found</span>
      //     </div>
      //   );
      // }
    }
  };
  return (
    <>
      <input
        type="text"
        onFocus={() => setIsShow(true)}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={input ?? ""}
        placeholder={placeholder}
      />
      {renderAutocomplete()}
    </>
  );
};
