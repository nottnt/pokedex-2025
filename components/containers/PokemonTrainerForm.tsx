// app/page.tsx
"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trainerSchema, TrainerFormData } from "@/lib/validation/trainer";
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
  const trainerId = params.id as string;
  const { trainerData, updateTrainer, isUpdating } = useTrainer(trainerId);

  const form = useForm<TrainerFormData>({
    resolver: zodResolver(trainerSchema),
    defaultValues: {
      name: "",
      age: "",
      region: "",
    },
  });

  const onSubmit = (data: TrainerFormData) => {
    updateTrainer(data);
  };

  useEffect(() => {
    if (trainerId && trainerData) {
      form.reset(trainerData);
    }
  }, [trainerData, trainerId, form]);

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

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Submitting..." : "Save"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
