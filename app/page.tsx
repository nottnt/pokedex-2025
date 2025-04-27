"use client";

import { useState } from "react";
import { usePokemons } from "@/hooks/usePokemons";
import PokemonCard from "@/components/PokemonCard";
import { fetchPokemonDetail } from "@/lib/fetchPokemons";
import { getOfficialArtwork } from "@/utils";

export default function Home() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePokemons();

  return (
    <main className="p-8">
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {data?.pages.flatMap((page) =>
              page.results.map((pokemon) => (
                <div key={pokemon.name} className="flex flex-col items-center">
                  <PokemonCard
                    name={pokemon.name}
                    imageUrl={getOfficialArtwork(pokemon.url)}
                  />
                </div>
              ))
            )}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isFetchingNextPage ? "Loading more..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
