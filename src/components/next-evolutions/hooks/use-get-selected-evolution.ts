import { useEffect, useState } from "react";
import { getPokemonSpecies } from "../../../gateways/api-gateway";
import axios from "axios";
import { DamageTypes } from "../../../pages/poke-types.types";

interface IUseGetSelectedEvolution {
  name: string;
  data: DamageTypes | null;
}

export const useGetSelectedEvolution = ({
  name,
  data,
}: IUseGetSelectedEvolution) => {
  const [evolutionData, setEvolutionData] = useState<any>(null);

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

  return { evolutionData };
};