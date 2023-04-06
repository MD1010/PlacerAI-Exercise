import { AutoComplete } from "baseUI";
import { FC } from "react";
import { YEARS } from "./consts";

type Props = {
  selectedYear: string | undefined;
  setSelectedYear: React.Dispatch<React.SetStateAction<string | undefined>>;
  meteorMass: number | undefined;
  setMeteorMass: React.Dispatch<React.SetStateAction<number | undefined>>;
};
export const MeteorFilters: FC<Props> = ({ selectedYear, setSelectedYear, meteorMass, setMeteorMass }) => {
  return (
    <>
      <div className="yearContainer">
        <span>Meteor Year</span>
        <AutoComplete
          selectedOption={selectedYear}
          suggestions={YEARS}
          onSelection={setSelectedYear}
          placeholder="Select Year"
        />
      </div>
      <div className="massContainer">
        <span>Mass greater than</span>
        <input
          type="number"
          min="0"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeteorMass(+e.target.value)}
          value={meteorMass ?? ""}
        />
      </div>
    </>
  );
};
