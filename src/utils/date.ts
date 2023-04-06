export const formatDateByYear = (year: number) => {
  return year + "-01-01T00:00:00.000";
};

export const getYearFromString = (fullDateString: string) => {
  return fullDateString.split("-01-01T00:00:00.000")[0];
};
