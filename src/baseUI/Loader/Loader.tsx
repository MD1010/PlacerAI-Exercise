import { FC } from "react";
import "./Loader.scss";

type Props = {
  isLoading: boolean;
  style?: React.CSSProperties;
};

export const Loader: FC<Props> = ({ isLoading, style }) => {
  return isLoading ? <div className="loader" style={style}></div> : null;
};
