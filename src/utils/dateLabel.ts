export const getMajlisDateLabel = (dateValue: string, fallbackDate: string) => {
  if (dateValue.trim() === "") {
    return fallbackDate;
  }

  const today = new Date();

  const majlisDate = new Date(`${dateValue}T00:00:00`);

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const startOfMajlisDate = new Date(
    majlisDate.getFullYear(),
    majlisDate.getMonth(),
    majlisDate.getDate(),
  );

  const differenceInDays = Math.round(
    (startOfMajlisDate.getTime() - startOfToday.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (differenceInDays === 0) {
    return "Today";
  }

  if (differenceInDays === 1) {
    return "Tomorrow";
  }

  return fallbackDate;
};
