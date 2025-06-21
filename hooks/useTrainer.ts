import { TrainerFormData } from "@/lib/validation/trainer";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const useTrainer = (trainerId: string | undefined) => {
  const {
    data,
    error: queryError,
    isError: isQueryError,
    isLoading: isQueryLoading,
  } = useQuery<TrainerFormData, Error>({
    queryKey: ["trainer", trainerId],
    queryFn: async () => {
      const res = await fetch(`/api/trainer/profile/?id=${trainerId}`);
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
    enabled: !!trainerId,
    retry: false,
  });

  const {
    mutate: updateTrainer,
    isPending: isUpdating,
    error: mutationError,
    isError: isMutationError,
  } = useMutation({
    mutationFn: async (data: TrainerFormData) => {
      const res = await fetch("/api/trainer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Update failed");
      }

      toast.success("Successful!", {
        description: "Trainer information updated successfully!",
      });

      return res.json();
    },
    onError: (err: any) => {
      toast.error("Update Failed!", {
        description: err.message,
      });
    },
  });

  // Effect for handling query errors
  React.useEffect(() => {
    if (isQueryError && queryError) {
      toast.error("Failed to get Trainer data!", {
        description: queryError.message,
      });
    }
  }, [isQueryError, queryError]);

  // Effect for handling mutation errors
  React.useEffect(() => {
    if (isMutationError && mutationError) {
      toast.error("Failed to update Trainer!", {
        description: mutationError.message,
      });
    }
  }, [isMutationError, mutationError]);

  return {
    trainerData: data,
    isLoading: isQueryLoading,
    isError: isQueryError,
    error: queryError,

    // From useMutation
    updateTrainer,
    isUpdating,
  };
};

export default useTrainer;
