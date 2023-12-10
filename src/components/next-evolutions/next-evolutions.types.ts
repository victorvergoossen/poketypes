// Modeled after api data
export type TEvolutionData<EvoData> = {
  chain: {
    species: EvoData,
    evolves_to: {
      species: EvoData
      evolution_details: {
        min_level: number;
        trigger: {
          name: string;
        }
      }[],
    }[],
  }
};

export type TNextEvolutions = {
  name: string;
}[];
