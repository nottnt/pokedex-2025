export const getPokemonIdFromPokemonUrl = (pokemonUrl: string): number => {
  const segments = pokemonUrl.split("/").filter(Boolean);
  const id = segments[segments.length - 1];

  return Number(id);
};
export const getOfficialArtwork = (pokemonUrl: string): string => {
  const id = getPokemonIdFromPokemonUrl(pokemonUrl);

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};
