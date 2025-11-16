"use client";

import { notFound } from "next/navigation";
import { fetchPokemonByName } from "@/lib/fetchPokemons";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import PokemonDetailView from "@/components/PokemonDetailView";
import LoadingPage from "@/components/LoadingPage";

interface PokemonDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const { id } = use(params);
  const pokemonId = parseInt(id);

  // Fetch detailed pokemon data
  const {
    data: pokemon,
    isLoading: isPokemonLoading,
    error: pokemonError,
  } = useQuery({
    queryKey: ["pokemon", pokemonId],
    queryFn: () => fetchPokemonByName(pokemonId.toString()),
    enabled: !!pokemonId,
    staleTime: Infinity,
    retry: false,
  });

  if (isNaN(pokemonId) || pokemonId < 1) {
    notFound();
  }

  if (pokemonError) {
    notFound();
  }

  if (isPokemonLoading) {
    return <LoadingPage />;
  }

  if (!pokemon) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PokemonDetailView pokemon={pokemon} />
    </div>
  );
}
