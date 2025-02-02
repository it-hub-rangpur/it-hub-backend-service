export const generateNextDay = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  // Check if the next day is Friday (5) or Saturday (6)
  if (date.getDay() === 5 || date.getDay() === 6) {
    // If it's Friday or Saturday, set the date to Sunday
    date.setDate(date.getDate() + (7 - date.getDay()));
  }

  // Format the date as "YYYY-MM-DD"
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default generateNextDay;
