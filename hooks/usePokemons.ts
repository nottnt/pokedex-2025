"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPokemons } from "@/lib/fetchPokemons";

export const usePokemons = () => {
  return useInfiniteQuery({
    queryKey: ["pokemons"],
    queryFn: ({ pageParam = 0 }) => fetchPokemons(20, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined;
      return allPages.length * 20;
    },
    retry: false,
  });
};
