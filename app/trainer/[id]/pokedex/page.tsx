"use client";

import { useSession } from "next-auth/react";
import PokemonCard from "@/components/PokemonCard";
import useTrainerPokedex from "@/hooks/useTrainerPokedex";
import { getOfficialArtwork } from "@/utils";
import { PokedexUpdateMode } from "@/types/common";

export default function Pokedex() {
  const { data: session } = useSession();
  const trainerId = session?.user?.trainer?._id as string;
  const { trainerPokedexData, removePokemonFromPokedex } =
    useTrainerPokedex(trainerId);

  return (
    <main className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {trainerPokedexData?.map((pokemon, index) => (
          <PokemonCard
            key={`${pokemon.pokemonName}-${index}`}
            name={pokemon.pokemonName}
            imageUrl={getOfficialArtwork(`${pokemon.pokemonId}`)}
            id={pokemon.pokemonId}
            pokedexUpdateMode={PokedexUpdateMode.REMOVE}
            removePokemonFromPokedex={(id: number, name: string) =>
              removePokemonFromPokedex({ pokemonId: id, pokemonName: name })
            }
          />
        ))}
      </div>
    </main>
  );
}
