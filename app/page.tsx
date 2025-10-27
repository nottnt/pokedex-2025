"use client";

import React from "react";
import { useSession } from "next-auth/react";
import PokemonCard from "@/components/PokemonCard";
import { getOfficialArtwork, getPokemonIdFromPokemonUrl } from "@/utils";
import { usePokemons } from "@/hooks/usePokemons";
import useTrainerPokedex from "@/hooks/useTrainerPokedex";
import { NamedAPIResource } from "pokenode-ts";
import { DATA_PER_PAGE } from "@/constants";
import { SearchPanel } from "@/components/compositions/SearchPanel";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";

export default function Home() {
  const { data: allPokemons = [], isLoading } = usePokemons();
  const { data: session } = useSession();
  const trainerId = session?.user?.trainer?._id as string;
  const { addPokemonToPokedex, setOfTrainerPokedex } =
    useTrainerPokedex(trainerId);
  const [filteredPokemons, setFilteredPokemons] = React.useState<
    NamedAPIResource[]
  >([]);
  const [displayPokemons, setDisplayPokemons] = React.useState<
    NamedAPIResource[]
  >([]);
  const [page, setPage] = React.useState(1);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

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

  React.useEffect(() => {
    if (allPokemons.length > 0) {
      initPokemons();
    }
  }, [allPokemons]);

  React.useEffect(() => {
    // Only handle next page if it's not the initial page (page 1)
    if (page > 1) {
      handleNextPage(page);
    }
  }, [page]);

  const hasNextPage = React.useMemo(() => {
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
            {displayPokemons
              .filter((pokemon) => {
                const pokemonId = getPokemonIdFromPokemonUrl(pokemon.url);
                return !setOfTrainerPokedex.has(pokemonId);
              })
              .map((pokemon, index) => {
                const pokemonId = getPokemonIdFromPokemonUrl(pokemon.url);

                return (
                  <PokemonCard
                    key={`${pokemon.name}-${index}`}
                    name={pokemon.name}
                    imageUrl={getOfficialArtwork(pokemon.url)}
                    id={pokemonId}
                    addPokemonToPokedex={(id: number, name: string) =>
                      addPokemonToPokedex({
                        pokemonId: id,
                        pokemonName: name,
                      })
                    }
                  />
                );
              })}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={async () => {
                  setIsLoadingMore(true);
                  // Add small delay to show loading state
                  await new Promise((resolve) => setTimeout(resolve, 300));
                  setPage((prev) => prev + 1);
                  setIsLoadingMore(false);
                }}
                disabled={isLoadingMore}
                variant="outline"
                size="lg"
                className="min-w-[140px] bg-background hover:bg-muted"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Load More
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
