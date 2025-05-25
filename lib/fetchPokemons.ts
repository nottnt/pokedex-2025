import {
  NamedAPIResource,
  Pokemon,
  PokemonClient,
  PokemonForm,
} from "pokenode-ts";

const pokemonApi = new PokemonClient();

export async function fetchPokemons(
  limit = 20,
  offset = 0
): Promise<NamedAPIResource[]> {
  const response = await pokemonApi.listPokemons(offset, limit);

  return response.results;
}

export async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const response = await pokemonApi.getPokemonByName(
    `${name.toLowerCase().trim()}`
  );
  return response;
}

export async function fetchPokemonFormById(id: number): Promise<PokemonForm> {
  const response = await pokemonApi.getPokemonFormById(id);
  return response;
}
