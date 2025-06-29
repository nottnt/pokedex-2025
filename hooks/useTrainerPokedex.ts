import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

interface Pokemon {
  pokemonId: number;
  pokemonName: string;
}

// The data needed to add a new Pokémon. Usually just the species ID.
interface AddPokemonPayload extends Pokemon {}

interface RemovePokemonPayload {
  pokemonId: number;
}

const useTrainerPokedex = (trainerId: string) => {
  const queryClient = useQueryClient();

  // 1. The query now fetches the LIST of Pokémon for a given trainer.
  //    The queryKey uniquely identifies this data.
  const {
    data: trainerPokedexData,
    isLoading,
    isError,
    error,
  } = useQuery<Pokemon[], Error>({
    // The key now includes the trainerId to be specific
    queryKey: ["trainerPokedex", trainerId],
    queryFn: async () => {
      // The API endpoint should fetch the collection for the trainer
      const res = await fetch(`/api/trainer/${trainerId}/pokedex`);
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "An unknown error occurred" }));
        throw new Error(
          errorData.message || `Request failed with status ${res.status}`
        );
      }
      return res.json();
    },
    // This query should only run when we have a valid trainerId
    enabled: !!trainerId,
    retry: false,
  });

  // 2. The mutation is for ADDING a new Pokémon.
  //    It's a POST request to the trainer's collection endpoint.
  const { mutate: addPokemonToPokedex, isPending: isAddingPokemon } =
    useMutation<Pokemon, Error, AddPokemonPayload>({
      mutationFn: async (payload) => {
        const res = await fetch(`/api/trainer/${trainerId}/pokedex`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res
            .json()
            .catch(() => ({ message: "An unknown error occurred" }));
          throw new Error(
            errorData.message || `Request failed with status ${res.status}`
          );
        }
        return res.json();
      },
      // 3. After successfully adding, we must refetch the list.
      onSuccess: () => {
        toast.success("Pokémon added to your Pokedex!");
        // Invalidate the query for the trainer's pokedex list.
        // This tells React Query to refetch the data and update the UI.
        queryClient.invalidateQueries({
          queryKey: ["trainerPokedex", trainerId],
        });
      },
      onError: (mutationError) => {
        toast.error("Failed to add Pokémon!", {
          description: mutationError.message,
        });
      },
    });

  const { mutate: removePokemonFromPokedex, isPending: isRemovingPokemon } =
    useMutation<Pokemon, Error, RemovePokemonPayload>({
      mutationFn: async (payload) => {
        const res = await fetch(
          `/api/trainer/${trainerId}/pokedex/${payload.pokemonId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const errorData = await res
            .json()
            .catch(() => ({ message: "An unknown error occurred" }));
          throw new Error(
            errorData.message || `Request failed with status ${res.status}`
          );
        }
        return res.json();
      },
      // 3. After successfully adding, we must refetch the list.
      onSuccess: () => {
        toast.success("Pokémon released from your Pokedex!");
        // Invalidate the query for the trainer's pokedex list.
        // This tells React Query to refetch the data and update the UI.
        queryClient.invalidateQueries({
          queryKey: ["trainerPokedex", trainerId],
        });
      },
      onError: (mutationError) => {
        toast.error("Failed to add Pokémon!", {
          description: mutationError.message,
        });
      },
    });

  // Effect for handling query fetch errors
  React.useEffect(() => {
    if (isError && error) {
      toast.error("Failed to fetch trainer's Pokedex!", {
        description: error.message,
      });
    }
  }, [isError, error]);

  return {
    // Data and state from the query
    trainerPokedexData,
    isLoading,
    isError,

    // Function and state from the mutation
    addPokemonToPokedex,
    isAddingPokemon,
    removePokemonFromPokedex,
    isRemovingPokemon,
  };
};

export default useTrainerPokedex;
