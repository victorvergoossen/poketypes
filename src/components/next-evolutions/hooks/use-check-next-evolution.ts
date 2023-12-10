import { useEffect, useState } from "react";

interface IUseCheckNextEvolution {
  evolutionData: any;
}

export const useCheckNextEvolution = ({
  evolutionData,
}: IUseCheckNextEvolution) => {
  const [nextEvolutions, setNextEvolutions] = useState<any[]>([]);
  const [evoLevelData, setEvoLevelData] = useState<string[]>([]);
  const [evoTrigger, setEvoTrigger] = useState<string[]>([]);

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

  return { evoLevelData, evoTrigger, nextEvolutions };
};