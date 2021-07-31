import { MutableRefObject } from "react";
import { PokemonList } from "../search-type.types";

interface ClearInputProps {
  inputRef: MutableRefObject<HTMLDivElement | null>;
  setSearching: (value: boolean) => void;
  setShowList: (value: boolean) => void;
  setActivePokemon: (value: PokemonList[]) => void;
}

const clearInput = ({ 
  inputRef, 
  setSearching, 
  setShowList, 
  setActivePokemon 
}: ClearInputProps) => {
  const inputField = inputRef.current?.querySelector('input');
  if (inputField) {
    inputField.value = '';
    setSearching(false);
    setShowList(false);
    setActivePokemon([]);
  }
};

export default clearInput;