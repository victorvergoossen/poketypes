import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getPokemon, getPokemonSpecies } from '../gateways/api-gateway';
import { fileExists } from '../utils/file-exists';
import { formatName } from '../utils/format-name';
import { DamageTypes } from '../pages/poke-types.types';
import { useWindowSize } from 'react-use';

interface INextEvolutions {
  name: string,
  data: DamageTypes | null,
}

export const NextEvolutions = ({
  name,
  data
}: INextEvolutions): JSX.Element | null => {
  const { width } = useWindowSize();

  const [openDialog, setOpenDialog] = useState<boolean>(width > 767);
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
      <div className="relative w-full mt-4 mb-12">

        <div className="w-full justify-between flex flex-row">
          {nextEvolutions?.map((species: any, index: number) => {
            const gifImgUrl = `/sprites/${formatName(species.name)}.gif`;
            return (
              <React.Fragment key={`evo_${species.name}`}>
                <div className="flex flex-col">
                  <img src={fileExists(gifImgUrl) ? gifImgUrl : spriteData[index]} className="absolute m-auto inset-0 w-16 h-16 object-contain relative z-50" alt={species.name} />
                  <span className="w-full inline-block font-bold capitalize text-center">{species.name}</span>
                </div>

                {index < nextEvolutions.length - 1 && (
                  <div className="relative w-full px-2 lg:px-5 m-auto h-12 mt-12">
                    <div className="w-full h-px border-t-2 border-gray-400" />

                    <div className="absolute inset-0 m-auto -mt-4 flex justify-center items-center rounded-full bg-gray-200 hover:bg-white w-8 h-8 cursor-pointer">
                      <span
                        onClick={() => setOpenDialog((prev) => !prev)}
                        className="absolute inset-0 m-auto font-bold text-black text-center h-8 w-8 flex justify-center items-center"
                      >
                        {evoLevelData[index] || '-'}
                      </span>

                      {openDialog && (
                        <div className="absolute z-10 px-4 py-2 mt-9 ml-1 rounded table top-0 left-0 m-auto bg-gray-900 border border-white shadow-lg">
                          <span className="inline-block text-black h-full w-full leading-5 text-white">
                            {evoTrigger[index]}
                          </span>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  );
};