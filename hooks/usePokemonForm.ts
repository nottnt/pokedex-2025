"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPokemonFormById } from "@/lib/fetchPokemons";
import { PokemonForm } from "pokenode-ts";

export function usePokemonForm(id: number) {
  return useQuery<PokemonForm, Error>({
    queryKey: [id],
    queryFn: () => fetchPokemonFormById(id),
    staleTime: Infinity, // cache forever
    retry: false,
  });
}
