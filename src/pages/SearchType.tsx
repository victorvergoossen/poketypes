import React from 'react';
import {MuiThemeProvider, TextField} from '@material-ui/core';
import { createMuiTheme } from "@material-ui/core";

const pokeTypes = [
  'bug',
  'dark',
  'dragon',
  'electric',
  'fairy',
  'fighting',
  'fire',
  'flying',
  'ghost',
  'grass',
  'ground',
  'ice',
  'normal',
  'poison',
  'psychic',
  'rock',
  'steel',
  'water',
];

const SearchType = () => {
  const theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: '#ffffff'
      },
    },
  });

  return (
    <div className="min-h-screen grid grid-cols-12 w-full h-full bg-gray-900 text-white">
      <div className="max-w-screen-xl lg:col-span-8 col-span-12 lg:col-start-3 col-start-1 px-4 pt-12 mb-12 mx-auto w-full">
        <p className="mb-2 mx-auto w-full">
          Search for a Pokémon:
        </p>

        <MuiThemeProvider theme={theme}>
          <TextField className="w-full" id="outlined-basic" label="Search Pokémon" variant="outlined" />
        </MuiThemeProvider>
      </div>
    </div>
  );
};

export default SearchType;
