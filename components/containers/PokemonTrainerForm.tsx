// app/page.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { trainerSchema, TrainerFormData } from "@/lib/validation/trainer";
import { useMutation } from "@tanstack/react-query";
import { BadgeAlert } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useTrainer from "@/hooks/useTrainer";

export default function PokemonTrainerForm() {
  const params = useParams();
  const trainerId = params.id?.[0];
  const { trainerData, isLoading, isError } = useTrainer(trainerId);

  const form = useForm<TrainerFormData>({
    resolver: zodResolver(trainerSchema),
    defaultValues: {
      name: "",
      age: "",
      region: "",
    },
  });

  const mutation = useMutation({
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

  const onSubmit = (data: TrainerFormData) => {
    mutation.mutate(data);
  };

  React.useEffect(() => {
    if (trainerId && trainerData) {
      form.reset(trainerData);
    }
  }, [trainerData, trainerId]);

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pokémon Trainer Profile</h1>
      <Badge variant="secondary" className="mb-4">
        <BadgeAlert />
        <span className="mx-1">
          Fill in the information to create your Pokédex
        </span>
      </Badge>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Satoshi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input placeholder="Kanto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Save"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
