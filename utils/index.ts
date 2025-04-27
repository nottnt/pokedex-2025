export function getOfficialArtwork(pokemonUrl: string): string {
  const segments = pokemonUrl.split("/").filter(Boolean);
  const id = segments[segments.length - 1];
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
