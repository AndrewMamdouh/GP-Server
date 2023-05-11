import axios from "axios";
import { options } from "../constants/axiosGeocoding.js";

export const getCity = async (lat, lon) => {
  const { data } = await axios.request({
    ...options,
    params: {
      lat,
      lon,
      "accept-language": "en",
      polygon_threshold: "0.0",
    },
  });
  return data;
};
