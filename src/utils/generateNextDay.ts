export const generateNextDay = () => {
  const date = new Date();

  // Add 1 day to the current date
  date.setDate(date.getDate() + 1);

  // Check if the next day is Friday (5) or Saturday (6)
  if (date.getDay() === 5 || date.getDay() === 6) {
    // If it's Friday or Saturday, set the date to Sunday
    date.setDate(date.getDate() + (7 - date.getDay()));
  }

  // Convert the date to BDT timezone (UTC+6)
  const bdtOffset = 6 * 60; // BDT is UTC+6 (6 hours ahead of UTC)
  const bdtDate = new Date(date.getTime() + bdtOffset * 60 * 1000);

  // Format the date as "YYYY-MM-DD"
  const year = bdtDate.getUTCFullYear();
  const month = String(bdtDate.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(bdtDate.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default generateNextDay;
