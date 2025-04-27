"use client";

import { useState } from "react";
import PokemonCard from "@/components/PokemonCard";
import { getOfficialArtwork } from "@/utils";
import { fetchPokemonByName } from "@/lib/fetchPokemons";
import { usePokemons } from "@/hooks/usePokemons";

export default function Home() {
  const { data, isLoading } = usePokemons();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedPokemon, setSearchedPokemon] = useState<null | {
    name: string;
    imageUrl: string;
  }>(null);
  const [error, setError] = useState("");

  const allPokemons = data || [];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const pokemon = await fetchPokemonByName(searchTerm);

      setSearchedPokemon({
        name: pokemon.name,
        imageUrl: getOfficialArtwork(`${pokemon.id}`),
      });
      setError("");
    } catch (err) {
      console.error(err);
      setError("Pokémon not found!");
      setSearchedPokemon(null);
    }
  };

  const filteredPokemons = allPokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="p-8">
      {/* Search Panel */}
      <form onSubmit={handleSearch} className="mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-6 py-2 hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {/* If searched Pokémon found, show it */}
          {searchedPokemon ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <PokemonCard
                name={searchedPokemon.name}
                imageUrl={searchedPokemon.imageUrl}
              />
            </div>
          ) : (
            <>
              {/* Else show normal Pokémon list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredPokemons.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.name}
                    name={pokemon.name}
                    imageUrl={getOfficialArtwork(pokemon.url)}
                  />
                ))}
              </div>

              {/* {hasNextPage && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {isFetchingNextPage ? "Loading more..." : "Load More"}
                  </button>
                </div>
              )} */}
            </>
          )}
        </>
      )}
    </main>
  );
}
