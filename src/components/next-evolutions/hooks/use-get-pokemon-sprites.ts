import { useEffect, useState } from "react";
import { getPokemon } from "../../../gateways/api-gateway";

interface IUseGetPokemonSprites {
  nextEvolutions: any[]
}

export const useGetPokemonSprites = ({
  nextEvolutions,
}: IUseGetPokemonSprites) => {
  const [spriteData, setSpriteData] = useState<any[]>([]);

  useEffect(() => {
    // Generate sprites
    const getPokemonSprites = async (pName: string) => {
      const { data: pokemonData } = await getPokemon(pName);
      return pokemonData;
    };

    const spritePromises = nextEvolutions.map(async (species: any) => getPokemonSprites(species.name));
    spritePromises && spritePromises.length > 0 && Promise.all(spritePromises)?.then(res => {
      const sprites = res.map(r => r.sprites?.front_default);
      setSpriteData(sprites);
    });
  }, [nextEvolutions]);

  return { spriteData };
};