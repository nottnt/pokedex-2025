"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPokemons } from "@/lib/fetchPokemons";
import { NamedAPIResource } from "pokenode-ts";
import { DATA_LIMIT } from "@/constants";

export function usePokemons() {
  return useQuery<NamedAPIResource[], Error>({
    queryKey: ["pokemon-names"],
    queryFn: () => fetchPokemons(DATA_LIMIT, 0),
    staleTime: Infinity, // cache forever
    retry: false,
  });
}
