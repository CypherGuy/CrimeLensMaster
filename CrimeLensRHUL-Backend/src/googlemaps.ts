const API_KEY = "AIzaSyCy-9dP2gyQzbx5-xRjPbpiefN5a_oeFLY";
const BASE_URL = "https://maps.googleapis.com/maps/api";

export const getPlaceDetails = async (placeName: string): Promise<any> => {
  try {
    const url = new URL(`${BASE_URL}/place/findplacefromtext/json`);
    url.searchParams.append("input", placeName);
    url.searchParams.append("inputtype", "textquery");
    url.searchParams.append("fields", "formatted_address,name,geometry");
    url.searchParams.append("key", API_KEY);

    const response = await fetch(url.toString(), { method: "GET" });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "OK") {
      return data.candidates[0];
    } else {
      throw new Error(`Error: ${data.status} - ${data.error_message}`);
    }
  } catch (error) {
    console.error("Google Maps API Error:", error);
    throw error;
  }
};
