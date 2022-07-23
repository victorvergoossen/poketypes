import { PokemonList } from "../search-type.types";

interface SelectPokemonProps {
  getType: (type: string, name: string | undefined) => void;
  pokemon: PokemonList
  setShowList: (value: boolean) => void;
}

const selectPokemon = ({ getType, pokemon, setShowList }: SelectPokemonProps) => {
  if (!pokemon?.type) return;

  setShowList(false);
  getType(pokemon.type, pokemon.name);
};

export default selectPokemon;
