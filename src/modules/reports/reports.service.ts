import axios from "axios";

const getAvailableDatetime = async () => {
  const response = await axios.get(
    "https://if-hub-available-date.pkshohag240.workers.dev/"
  );
  return response.data;
};

// Export the service
export const reportsService = {
  getAvailableDatetime,
};
