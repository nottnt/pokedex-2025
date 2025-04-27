export interface PokemonListResult {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  results: PokemonListResult[];
  next: string | null;
}

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

export async function fetchPokemons(
  limit = 20,
  offset = 0
): Promise<PokemonListResponse> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Pokémon list");
  }

  return res.json();
}

export async function fetchPokemonDetail(url: string): Promise<PokemonDetail> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch Pokémon detail");
  }

  return res.json();
}
