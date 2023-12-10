import { useEffect, useState } from "react";
import { getPokemon } from "../../../gateways/api-gateway";
import { TNextEvolutions } from "../next-evolutions.types";

interface IUseGetPokemonSprites {
  nextEvolutions: TNextEvolutions
}

export const useGetPokemonSprites = ({
  nextEvolutions,
}: IUseGetPokemonSprites) => {
  const [spriteData, setSpriteData] = useState<string[]>([]);

  useEffect(() => {
    const getPokemonSprites = async (pName: string) => {
      const { data: pokemonData } = await getPokemon(pName);
      return pokemonData;
    };

    const spritePromises = nextEvolutions.map(async (species) => getPokemonSprites(species.name));
    spritePromises && spritePromises.length > 0 && Promise.all(spritePromises)?.then(res => {
      const sprites = res.map(r => r.sprites?.front_default);
      setSpriteData(sprites);
    });
  }, [nextEvolutions]);

  return { spriteData };
};