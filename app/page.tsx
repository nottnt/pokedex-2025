"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
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
  const searchParams = useSearchParams();
  const trainerId = session?.user?.trainer?._id as string;
  const { addPokemonToPokedex, setOfTrainerPokedex } =
    useTrainerPokedex(trainerId);
  const [filteredPokemons, setFilteredPokemons] = useState<NamedAPIResource[]>(
    []
  );
  const [displayPokemons, setDisplayPokemons] = useState<NamedAPIResource[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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

  // Check for email verification success
  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true") {
      setTimeout(() => {
        toast.success("Email Verified!", {
          description:
            "Your email has been successfully verified. Welcome to Pokédex-2025!",
        });
      }, 500); // Slight delay to ensure toast shows after redirect

      // Remove the query parameter from URL without page refresh
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("verified");
      window.history.replaceState({}, "", newUrl.pathname + newUrl.search);
    }
  }, [searchParams]);

  useEffect(() => {
    // Only handle next page if it's not the initial page (page 1)
    if (page > 1) {
      handleNextPage(page);
    }
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
