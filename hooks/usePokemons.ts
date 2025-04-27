"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPokemons } from "@/lib/fetchPokemons";
import { NamedAPIResource } from "pokenode-ts";

export function usePokemons() {
  return useQuery<NamedAPIResource[], Error>({
    queryKey: ["pokemon-names"],
    queryFn: () => fetchPokemons(100000, 0),
    staleTime: Infinity, // cache forever
    retry: false,
  });
}
