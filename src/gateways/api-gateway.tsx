import axios from 'axios';
import { ApiTypes } from '../pages/Types.types';

export const getPokeTypes = async (type: string) => {
  if (!type) return;
  return await axios
    .get(`https://pokeapi.co/api/v2/type/${type}/`)
    .then((response: ApiTypes) => {
      return response;
    })
};
