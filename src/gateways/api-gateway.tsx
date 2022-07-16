import axios from 'axios';
import ShowAlert from '../components/alert';
import { DamageTypes } from '../pages/poke-types.types';

const getTimeout = 10_000;

export const getPokeTypes = async (type: string) => {
  if (!type) return null;
  return await axios
    .get(`https://pokeapi.co/api/v2/type/${type}/`, { timeout: getTimeout })
    .then((response: DamageTypes) => response)
    .catch((err: Error) => {
      ShowAlert('There was a problem getting this type info.');
      console.error(err);
    });
};

export const getPokemons = async () => {
  return await axios
    .get("https://pokeapi.co/api/v2/pokemon?limit=1000", { timeout: getTimeout })
    .then((response: any) => response)
    .catch((err: Error) => {
      ShowAlert('There was a problem reaching the database.');
      console.error(err);
    });
};

export const getPokemon = async (name: string) => {
  return await axios
    .get(`https://pokeapi.co/api/v2/pokemon/${name}/`, { timeout: getTimeout })
    .then((response: any) => response)
    .catch((err: Error) => {
      ShowAlert('There was a problem retrieving this Pokémon info.');
      console.error(err);
    });
};
