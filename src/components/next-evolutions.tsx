import React, { useEffect, useState } from 'react';
import { getPokemon, getPokemonSpecies } from '../gateways/api-gateway';
import axios from 'axios';

export const NextEvolutions = ({
  name,
  data
}: any) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [evolutionData, setEvolutionData] = useState<any>(null);
  const [nextEvolutions, setNextEvolutions] = React.useState<any[]>([]);
  const [spriteData, setSpriteData] = React.useState<any[]>([]);
  const [evoLevelData, setEvoLevelData] = React.useState<string[]>([]);
  const [evoTrigger, setEvoTrigger] = React.useState<string[]>([]);

  useEffect(() => {
    // Get evolution data
    const getSelectedEvolution = async () => {
      const { data: speciesData } = await getPokemonSpecies(name);
      if (!speciesData) return;

      const { data: evolutionData } = await axios.get(speciesData?.evolution_chain?.url);
      if (evolutionData) setEvolutionData(evolutionData);
    };

    if (name && data) {
      getSelectedEvolution();
    }
  }, [name, data]);

  useEffect(() => {
    let evoLevel: string[] = [];
    let evoTrigger: string[] = [];
    let species: any = [];

    const checkNextEvolution = async (evolutionChain: any) => {
      const nextSpecies = evolutionChain?.evolves_to?.[0]?.species;
      const nextEvoLevel = evolutionChain?.evolves_to?.[0]?.evolution_details?.[0]?.min_level;
      const nextEvoTrigger = evolutionChain?.evolves_to?.[0]?.evolution_details?.[0]?.trigger?.name;

      if (nextEvoLevel) evoLevel = [...evoLevel, `${nextEvoLevel}`];
      if (nextEvoTrigger) evoTrigger = [...evoTrigger, `${nextEvoTrigger}`];

      if (nextSpecies) {
        species = [...species, nextSpecies];
      } else {
        setNextEvolutions(species);
        setEvoLevelData(evoLevel);
        setEvoTrigger(evoTrigger);
      }

      checkNextEvolution(evolutionChain?.evolves_to?.[0]);
    };

    if (evolutionData) {
      species = [evolutionData?.chain?.species];
      if (evolutionData?.chain?.evolves_to?.length > 0) {
        checkNextEvolution(evolutionData.chain);
      }
    }
  }, [evolutionData]);

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

  if (nextEvolutions?.length <= 0 || spriteData?.length <= 0) {
    return null;
  }
  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold ml-2">Evolutions:</h3>
      <div className="relative w-full mb-12">
        <div className="absolute inset-0 m-auto w-3/4 rounded h-px bg-gray-400" />

        <div className="w-full justify-between flex flex-row">
          {nextEvolutions?.map((species: any, index: number) => (
            <React.Fragment key={species.name}>
              <div className="mr-2">
                <img src={spriteData[index]} alt={species.name} />
                <span className="w-full inline-block font-bold capitalize text-center">{species.name}</span>
              </div>

              {index !== nextEvolutions.length - 1 && (
                <div className="relative flex justify-center items-center rounded-full bg-gray-200 -ml-2 w-8 h-8 mt-10">
                  <span
                    onClick={() => setOpenDialog((prev) => !prev)}
                    className="absolute inset-0 m-auto font-bold text-black text-center h-8 w-8 flex justify-center items-center"
                  >
                    {evoLevelData[index] || '-'}
                  </span>

                  {openDialog && (
                    <div className="absolute z-10 px-4 py-2 mt-9 ml-1 rounded table top-0 left-0 m-auto bg-gray-200 shadow-lg">
                      <span className="inline-block text-black h-full w-full">
                        {evoTrigger[index]}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};