import React, { ChangeEvent, FunctionComponent, memo, useEffect, useRef, useState } from 'react';
import Loader from '../loader';
import { getPokemon, getPokemons } from '../../gateways/api-gateway';
import { debounce, MuiThemeProvider, TextField } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core';
import { PokemonList, Pokemon, SearchTypeProps } from './search-type.types';
import isEven from '../../utils/is-even';
import clearInput from './functions/clear-input';
import selectPokemon from './functions/select-pokemon';

const SearchType: FunctionComponent<SearchTypeProps> = ({ getType }) => {
  const inputLengthUntilRequest = 2;

  const inputRef = useRef<HTMLDivElement | null>(null);
  const timeOut = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [data, setData] = useState<PokemonList[]>([]);
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

  useEffect(() => {
    getPokemons()
      .then((res) => {
        setData(res?.data?.results);
      });
  }, []);

  const onChange = debounce((event: ChangeEvent & { target: { value: string } }) => {
    if (!data) return;
    const filterData = (value: string) => {
      if (!value) return;

      const promises: PromiseLike<Pokemon>[] = [];
      const filteredPokemon = data
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
      if (event?.target?.value?.length > inputLengthUntilRequest) {
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
        <div className="relative">
          <TextField
            ref={inputRef}
            onChange={onChange}
            className="w-full"
            id="outlined-basic"
            label="Search Pokémon"
            variant="outlined"
          />
          <button
            className="absolute top-0 right-0 bottom-0 my-auto ml-auto px-6 focus:outline-none font-dot"
            onClick={() => clearInput({
              inputRef,
              setActivePokemon,
              setSearching,
              setShowList,
            })}
          >
            X
          </button>
        </div>
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
              onClick={() => selectPokemon({
                getType,
                pokemon,
                setShowList,
              })}
              key={`pokemon_search_${i}`}
              className={`relative p-4 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 col-span-1 ${isEven(i) ? '' : 'col-start-2'}`}
            >
              {pokemon.sprite && (
                <img src={pokemon.sprite} className="h-48 w-48 pb-6 pt-6 mx-auto object-contain" alt={pokemon.name} />
              )}

              <span className="block font-dot absolute right-0 bottom-0 left-0 text-center mb-16 capitalize">{pokemon.name}</span>
              <span className={`block ${pokemon.type} rounded border border-white py-1 w-32 mx-auto`}>{pokemon.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(SearchType);
