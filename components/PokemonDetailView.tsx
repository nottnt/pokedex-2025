"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { Pokemon } from "pokenode-ts";

import { Button } from "@/components/ui/button";
import useTrainerPokedex from "@/hooks/useTrainerPokedex";

// Import Pokemon detail card components
import PokemonImageCard from "@/components/pokemon-detail/PokemonImageCard";
import PokemonTypesCard from "@/components/pokemon-detail/PokemonTypesCard";
import PokemonPhysicalCard from "@/components/pokemon-detail/PokemonPhysicalCard";
import PokemonStatsCard from "@/components/pokemon-detail/PokemonStatsCard";
import PokemonAbilitiesCard from "@/components/pokemon-detail/PokemonAbilitiesCard";
import PokemonSpritesCard from "@/components/pokemon-detail/PokemonSpritesCard";

interface PokemonDetailViewProps {
  pokemon: Pokemon;
}

export default function PokemonDetailView({ pokemon }: PokemonDetailViewProps) {
  const { data: session } = useSession();
  const trainerId = session?.user?.trainer?._id as string;
  const {
    trainerPokedexData,
    addPokemonToPokedex,
    removePokemonFromPokedex,
    isLoading: isPokedexLoading,
  } = useTrainerPokedex(trainerId);

  const isInPokedex = trainerPokedexData?.some(
    (p: any) => p.pokemonId === pokemon.id
  );

  const handleTogglePokedex = () => {
    if (isInPokedex) {
      removePokemonFromPokedex({
        pokemonId: pokemon.id,
        pokemonName: pokemon.name,
      });
    } else {
      addPokemonToPokedex({ pokemonId: pokemon.id, pokemonName: pokemon.name });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>

        {trainerId && (
          <Button
            onClick={handleTogglePokedex}
            disabled={isPokedexLoading}
            variant={"default"}
            className="flex items-center gap-2 group"
          >
            {isInPokedex ? (
              <>
                <Image
                  src={"/images/pokéball-open.webp"}
                  alt={"pokéball-open"}
                  width="30"
                  height="30"
                  className="transition-transform duration-300 ease-in-out group-hover:animate-bounce"
                />
                Remove from Pokédex
              </>
            ) : (
              <>
                <Image
                  src={"/images/pokéball.webp"}
                  alt={"pokéball"}
                  width="24"
                  height="24"
                  className="transition-transform duration-300 ease-in-out group-hover:rotate-20"
                />
                Add to Pokédex
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image and Basic Info */}
        <div className="space-y-6">
          <PokemonImageCard pokemon={pokemon} />
          <PokemonTypesCard pokemon={pokemon} />
          <PokemonPhysicalCard pokemon={pokemon} />
        </div>

        {/* Right Column - Stats and Abilities */}
        <div className="space-y-6">
          <PokemonStatsCard pokemon={pokemon} />
          <PokemonAbilitiesCard pokemon={pokemon} />
          <PokemonSpritesCard pokemon={pokemon} />
        </div>
      </div>
    </div>
  );
}
