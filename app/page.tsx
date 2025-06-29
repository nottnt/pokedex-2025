"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import PokemonCard from "@/components/PokemonCard";
import { getOfficialArtwork, getPokemonIdFromPokemonUrl } from "@/utils";
import { usePokemons } from "@/hooks/usePokemons";
import useTrainerPokedex from "@/hooks/useTrainerPokedex";
import { NamedAPIResource } from "pokenode-ts";
import { DATA_PER_PAGE } from "@/constants";
import { SearchPanel } from "@/components/compositions/SearchPanel";

export default function Home() {
  const { data: allPokemons = [], isLoading } = usePokemons();
  const { data: session } = useSession();
  const trainerId = session?.user?.trainer?._id as string;
  const { addPokemonToPokedex } = useTrainerPokedex(trainerId);
  const [filteredPokemons, setFilteredPokemons] =
    useState<NamedAPIResource[]>(allPokemons);
  const [displayPokemons, setDisplayPokemons] =
    useState<NamedAPIResource[]>(allPokemons);
  const [page, setPage] = useState(1);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) initPokemons();
    else {
      const filteredPokemons = allPokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPokemons(filteredPokemons);
      setDisplayPokemons(slicePokemons(filteredPokemons));
    }
    setPage(1);
  };

  const slicePokemons = (
    pokemons: NamedAPIResource[],
    start: number = 0,
    end: number = DATA_PER_PAGE
  ) => {
    const slicedPokemons = pokemons.slice(start, end);
    return slicedPokemons;
  };

  const handleNextPage = (page: number) => {
    const nextPokemons = slicePokemons(
      filteredPokemons,
      (page - 1) * DATA_PER_PAGE,
      page * DATA_PER_PAGE
    );
    console.log("nextPokemons", nextPokemons);
    setDisplayPokemons((prev) => [...prev, ...nextPokemons]);
  };

  const initPokemons = () => {
    const initialPokemons = slicePokemons(allPokemons);
    setDisplayPokemons(initialPokemons);
    setFilteredPokemons(allPokemons);
  };

  useEffect(() => {
    if (allPokemons.length > 0) {
      initPokemons();
    }
  }, [allPokemons]);

  useEffect(() => {
    handleNextPage(page);
  }, [page]);

  const hasNextPage = useMemo(() => {
    return displayPokemons.length < filteredPokemons.length;
  }, [filteredPokemons, displayPokemons]);

  return (
    <main className="p-8">
      <SearchPanel onSubmit={handleSearch} />

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {/* Else show normal Pokémon list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {displayPokemons.map((pokemon, index) => (
              <PokemonCard
                key={`${pokemon.name}-${index}`}
                name={pokemon.name}
                imageUrl={getOfficialArtwork(pokemon.url)}
                id={getPokemonIdFromPokemonUrl(pokemon.url)}
                addPokemonToPokedex={(id: number, name: string) =>
                  addPokemonToPokedex({
                    pokemonId: id,
                    pokemonName: name,
                  })
                }
              />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
