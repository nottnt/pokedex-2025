import { TrainerFormData } from "@/lib/validation/trainer";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const useTrainer = (trainerId: string | undefined) => {
  const { data, error, isError, isLoading } = useQuery<TrainerFormData, Error>({
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

  React.useEffect(() => {
    if (isError && error) {
      toast.error("Failed to get trainer data!", {
        description: error.message,
      });
    }
  }, [isError, error]);

  return { trainerData: data, isLoading, isError, error };
};

export default useTrainer;
