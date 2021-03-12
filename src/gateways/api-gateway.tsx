import axios from 'axios';
import { DamageTypes } from '../pages/Types.types';

export const getPokeTypes = async (type: string) => {
  if (!type) return;
  return await axios
    .get(`https://pokeapi.co/api/v2/type/${type}/`)
    .then((response: DamageTypes) => response)
    .catch(err => console.error(err));
};

export const getPokemons = async () => {
  return await axios
    .get("https://pokeapi.co/api/v2/pokemon?limit=1000")
    .then((response: any) => response)
    .catch(err => console.error(err));
};

export const getPokemon = async (name: string) => {
  return await axios
    .get(`https://pokeapi.co/api/v2/pokemon/${name}/`)
    .then((response: any) => response)
    .catch(err => console.error(err));
};
