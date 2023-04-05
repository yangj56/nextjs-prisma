import { Country } from '../pages/airport';

export const getAirportAPI = async (): Promise<Country[]> => {
  const airportJSON = await fetch(`${process.env.NEXT_PUBLIC_AIRPORT_JSON}`);
  return await airportJSON.json();
};
