import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Loader from './Loader';
import { getPokemon, getPokemons } from '../gateways/api-gateway';
import { debounce, MuiThemeProvider, TextField } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core';
import { PokemonList, Pokemon, SearchTypeProps } from './SearchType.types';

const SearchType = ({ getType }: SearchTypeProps) => {
  const charactersUntilApiCall = 2;

  const timeOut = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [data, setData] = useState<any>(null);
  const [showList, setShowList] = useState<boolean>(false);
  const [activePokemon, setActivePokemon] = useState<PokemonList[]>([]);
  const [searching, setSearching] = useState<boolean>(false);

  const theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: '#ffffff'
      },
    },
  });

  const isEven = (number: number) => number % 2 == 0;

  useEffect(() => {
    const getData = () => {
      getPokemons()
        .then((res) => {
          setData(res?.data?.results);
        });
    };

    getData();
  }, []);

  const selectPokemon = (name: string | undefined, type: string | undefined) => {
    if (!type) return;
    setShowList(false);
    getType(type, name);
  };

  const onChange = debounce((event: ChangeEvent & { target: { value: string } }) => {
    if (!data) return;
    const filterData = (value: string) => {
      if (!value) return;

      const promises: PromiseLike<Pokemon>[] = [];
      const filteredPokemon: PokemonList[] = data
        ?.filter((filter: { name: string | string[]; }) => filter.name.includes(value));

      filteredPokemon.forEach((filtered) => {
        promises.push(getPokemon(filtered.name));
      });

      Promise.all(promises).then((promisedResult: Pokemon[]) => {
        filteredPokemon.forEach((filtered, i) => {
          filtered['sprite'] = promisedResult[i]?.data?.sprites?.['front_default'];
          filtered['type'] = promisedResult[i]?.data?.types?.[0]?.type?.name;
        });
        setSearching(false);
        setActivePokemon(filteredPokemon);
      });
    };

    // When user types more than 2 characters, start timeout until api is called
    if (timeOut.current) clearTimeout(timeOut.current);
    setSearching(true);

    timeOut.current = setTimeout(() => {
      if (event?.target?.value?.length > charactersUntilApiCall) {
        setActivePokemon([]);
        setShowList(true);
        filterData(event.target.value.toLowerCase());
      } else {
        setShowList(false);
      }
    }, 1000);
  }, 150);

  return (
    <div className="absolute left-0 top-0 right-0 max-w-lg mt-8 mx-auto px-4 z-20">
      <MuiThemeProvider theme={theme}>
        <TextField onChange={onChange} className="w-full" id="outlined-basic" label="Search Pokémon" variant="outlined" />
      </MuiThemeProvider>

      {showList && (
        <div className="grid grid-cols-2 gap-2 bg-gray-900 shadow-lg p-4">
          {!searching && activePokemon.length < 1 && (
            <div className="relative h-48 w-full p-4 bg-gray-800 col-span-2">
              <span className="block font-dot absolute inset-0 w-full h-4 m-auto text-center capitalize">No matches</span>
            </div>
          )}

          {searching && activePokemon.length < 1 && (
            <div className="relative p-4 col-span-2">
              <Loader absolute />
            </div>
          )}

          {activePokemon.map((pokemon: PokemonList, i: number) => (
            <button
              onClick={() => selectPokemon(pokemon.name, pokemon.type)}
              key={`pokemon_search_${i}`}
              className={`relative p-4 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 col-span-1 ${isEven(i) ? '' : 'col-start-2'}`}
            >
              {pokemon.sprite &&
              <img src={pokemon.sprite} className="h-48 w-48 pb-6 pt-6 mx-auto object-contain" alt={pokemon.name} />}

              <span className="block font-dot absolute right-0 bottom-0 left-0 text-center mb-16 capitalize">{pokemon.name}</span>
              <span className={`block ${pokemon.type} rounded border border-white py-1 w-32 mx-auto`}>{pokemon.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchType;
