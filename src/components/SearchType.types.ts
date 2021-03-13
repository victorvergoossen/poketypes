export interface SearchTypeProps {
  getType: (newType: string, newName?: string) => void;
}

export type PokemonList = {
  name: string;
  url: string;
  sprite?: string;
  type?: string;
}

export type Pokemon = {
  data: {
    sprites: {
      'front_default': string;
    };
    types: any;
  }
}

