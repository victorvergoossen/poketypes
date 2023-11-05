// Modeled after api data
export interface DamageTypes {
  data: {
    damage_relations: {
      [key: string]: {
        name: string;
      }[];
    };
    pokemon?: {
      pokemon: {
        name: string;
        url: string;
      }[];
      slot: number;
    }[];
  };
}
