export interface ApiTypes {
  data: {
    damage_relations?: {
      double_damage_to: {
        name: string;
      }[];
      double_damage_from: {
        name: string;
      }[];
      half_damage_from: {
        name: string;
      }[];
      half_damage_to: {
        name: string;
      }[];
    };
  };
}
